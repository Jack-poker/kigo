import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

interface Product {
  product_id: string;
  name: string;
  price: number;
  affiliate_link: string;
  description?: string;
  image_url?: string;
}

const ShopManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Cache mechanism
  const productsCache = useRef<{data: Product[], timestamp: number} | null>(null);
  const CACHE_TTL = 60000; // 1 minute cache
  const tokenRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 5;
  const initialDelay = 1000;

  // Fetch CSRF token with enhanced retry logic and exponential backoff
  const fetchCsrfToken = async (retries = maxRetries, delay = initialDelay): Promise<string | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get('http://localhost:8001/admin/get-csrf-token', {
          withCredentials: true, // Send session_id cookie
          timeout: 5000, // 5 second timeout
        });
        console.log('🔑 CSRF Token refreshed');
        setCsrfToken(response.data.csrf_token);
        setError('');
        
        // Schedule token refresh before expiration
        if (tokenRefreshTimerRef.current) {
          clearTimeout(tokenRefreshTimerRef.current);
        }
        tokenRefreshTimerRef.current = setTimeout(() => {
          fetchCsrfToken();
        }, 4 * 60 * 1000); // Refresh 1 minute before 5-minute expiration
        
        return response.data.csrf_token;
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || 'Failed to fetch CSRF token';
        console.error(`🔴 CSRF token error (attempt ${attempt}/${retries}):`, err);
        
        if (attempt === retries) {
          setError(`Authentication error: ${errorMsg}. Please refresh the page.`);
          return null;
        }
        
        // Exponential backoff with jitter
        const backoffDelay = Math.min(delay * Math.pow(2, attempt - 1), 30000);
        const jitter = Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffDelay + jitter));
      }
    }
    return null;
  };

  // Fetch products with caching
  const fetchProducts = useCallback(async (skipCache = false) => {
    if (!csrfToken) return;
    
    // Check cache first if not skipping cache
    if (!skipCache && productsCache.current && 
        (Date.now() - productsCache.current.timestamp < CACHE_TTL)) {
      setProducts(productsCache.current.data);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setRefreshing(true);
      
      const response = await axios.get('http://localhost:8001/admin/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true, // Send session_id cookie
        timeout: 8000, // 8 second timeout
      });
      
      // Update cache
      productsCache.current = {
        data: response.data,
        timestamp: Date.now()
      };
      
      setProducts(response.data);
      setLoading(false);
      setRefreshing(false);
      setError('');
    } catch (err: any) {
      // Handle CSRF token errors
      if (err.response?.status === 403 && 
          err.response?.data?.detail?.includes('CSRF')) {
        console.log('🔄 CSRF token expired, refreshing...');
        const newToken = await fetchCsrfToken();
        if (newToken) {
          fetchProducts(true); // Retry with fresh token, skip cache
          return;
        }
      }
      
      const errorMsg = err.response?.data?.detail || 'Failed to fetch products';
      setError(errorMsg);
      console.error('🔴 Products fetch error:', err);
      setLoading(false);
      setRefreshing(false);
    }
  }, [csrfToken]);

  // Initial CSRF token fetch
  useEffect(() => {
    fetchCsrfToken();
    
    return () => {
      // Clean up token refresh timer
      if (tokenRefreshTimerRef.current) {
        clearTimeout(tokenRefreshTimerRef.current);
      }
    };
  }, []);

  // Fetch products when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchProducts();
    }
  }, [csrfToken, fetchProducts]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
    }));
    
    // Update preview for image URL changes
    if (name === 'image_url' && editingProductId) {
      setPreviewProduct(prev => prev ? {...prev, [name]: value} : null);
    }
  };

  // Handle create or update product
  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        'X-CSRF-Token': csrfToken,
      };
      
      // Optimistic UI update
      const tempId = `temp-${Date.now()}`;
      const optimisticProduct = {
        ...formData,
        product_id: editingProductId || tempId,
      } as Product;
      
      if (editingProductId) {
        // Update existing product
        setProducts(products.map((product) => 
          (product.product_id === editingProductId ? optimisticProduct : product)
        ));
        
        try {
          const response = await axios.put(`http://localhost:8001/admin/products/${editingProductId}`, formData, {
            headers,
            withCredentials: true,
          });
          
          setProducts(products.map((product) => 
            (product.product_id === editingProductId ? response.data : product)
          ));
          
          // Update cache
          if (productsCache.current) {
            productsCache.current.data = productsCache.current.data.map(product => 
              product.product_id === editingProductId ? response.data : product
            );
          }
        } catch (err) {
          // Rollback on error
          setProducts(products);
          throw err;
        }
      } else {
        // Create new product
        setProducts([...products, optimisticProduct]);
        
        try {
          const response = await axios.post('http://localhost:8001/admin/products', formData, {
            headers,
            withCredentials: true,
          });
          
          setProducts(prev => 
            prev.map(p => p.product_id === tempId ? response.data : p)
          );
          
          // Update cache
          if (productsCache.current) {
            productsCache.current.data = productsCache.current.data
              .filter(p => p.product_id !== tempId)
              .concat(response.data);
          }
        } catch (err) {
          // Rollback on error
          setProducts(products);
          throw err;
        }
      }
      
      setFormData({});
      setEditingProductId(null);
      setPreviewProduct(null);
      setShowPreview(false);
      setError('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to save product';
      setError(errorMsg);
      console.error('🔴 Product save error:', err);
    }
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      affiliate_link: product.affiliate_link,
      description: product.description || '',
      image_url: product.image_url || '',
    });
    setEditingProductId(product.product_id);
    setPreviewProduct(product);
  };

  // Handle delete product
  const handleDeleteProduct = async (product_id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    // Optimistic UI update
    const productToDelete = products.find(p => p.product_id === product_id);
    const originalProducts = [...products];
    setProducts(products.filter((product) => product.product_id !== product_id));
    
    try {
      await axios.delete(`http://localhost:8001/admin/products/${product_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      
      // Update cache
      if (productsCache.current) {
        productsCache.current.data = productsCache.current.data
          .filter(product => product.product_id !== product_id);
      }
      
      setError('');
    } catch (err: any) {
      // Rollback on error
      setProducts(originalProducts);
      
      const errorMsg = err.response?.data?.detail || 'Failed to delete product';
      setError(errorMsg);
      console.error('🔴 Product delete error:', err);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    const token = await fetchCsrfToken();
    if (token) {
      await fetchProducts(true); // Skip cache on manual refresh
    }
    setRefreshing(false);
  };
  
  // Toggle product preview
  const togglePreview = (product: Product | null = null) => {
    if (product) {
      setPreviewProduct(product);
    }
    setShowPreview(!showPreview);
  };
  
  // Empty state component
  const EmptyProductState = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <svg className="w-40 h-40 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"></circle>
      </svg>
      <h3 className="mt-4 text-xl font-semibold text-gray-700">No Products Available</h3>
      <p className="mt-2 text-gray-500 text-center max-w-md">
        Your shop is empty. Add your first product using the form above to get started.
      </p>
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        Add Your First Product
      </button>
    </div>
  );
  
  // Product preview modal
  const ProductPreviewModal = () => {
    if (!previewProduct) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Product Preview</h3>
            <button 
              onClick={() => setShowPreview(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                {previewProduct.image_url ? (
                  <img 
                    src={previewProduct.image_url} 
                    alt={previewProduct.name}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{previewProduct.name}</h2>
                <p className="text-emerald-600 text-xl font-semibold mb-4">RWF {previewProduct.price?.toFixed(2)}</p>
                
                {previewProduct.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-gray-700">{previewProduct.description}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Affiliate Link</h4>
                  <a 
                    href={previewProduct.affiliate_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {previewProduct.affiliate_link}
                  </a>
                </div>
                
                <div className="mt-6">
                  <a 
                    href={previewProduct.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Visit Product Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Loading skeleton for products
  const ProductSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-300"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Shop Management</h2>
            <p className="text-emerald-100 mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`bg-white text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors flex items-center ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {refreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Error notification */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError('')}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Product form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {editingProductId ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <form onSubmit={handleCreateOrUpdateProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="affiliate_link" className="block text-sm font-medium text-gray-700 mb-1">Affiliate Link</label>
                <input
                  id="affiliate_link"
                  type="url"
                  name="affiliate_link"
                  value={formData.affiliate_link || ''}
                  onChange={handleInputChange}
                  placeholder="https://"
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  id="image_url"
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://"
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={5}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="space-x-2">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                {editingProductId ? 'Update Product' : 'Create Product'}
              </button>
              
              {editingProductId && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({});
                    setEditingProductId(null);
                    setPreviewProduct(null);
                  }}
                  className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {(editingProductId || formData.image_url) && (
              <button
                type="button"
                onClick={() => togglePreview(editingProductId ? undefined : formData as Product)}
                className="text-emerald-600 hover:text-emerald-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Products display */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Product Catalog</h3>
        
        {loading ? (
          <ProductSkeleton />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.product_id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div 
                  className="h-48 bg-gray-200 relative cursor-pointer"
                  onClick={() => togglePreview(product)}
                >
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePreview(product);
                      }}
                      className="text-gray-600 hover:text-emerald-600"
                      title="Preview"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h4>
                  <p className="text-emerald-600 font-medium mb-2">RWF {product.price.toFixed(2)}</p>
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="space-x-1">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.product_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <a 
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Link
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyProductState />
        )}
      </div>
      
      {/* Preview modal */}
      {showPreview && <ProductPreviewModal />}
    </div>
  );
};

export default ShopManagement;