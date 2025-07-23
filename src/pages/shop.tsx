import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface Product {
  product_id: string;
  name: string;
  price: number;
  affiliate_link: string;
  description?: string;
  image_url?: string;
  category?: string;
  rating?: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());

  // API base URL
  const API_BASE_URL = "https://api.kaascan.com";

  // Enhanced CSRF token fetching with fallback mechanism
  const fetchCsrfToken = useCallback(
    async (retries = 3, delay = 1000): Promise<string | null> => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/admin/get-csrf-token`,
            {
              withCredentials: true,
              timeout: 5000,
            },
          );

          if (response.data && response.data.csrf_token) {
            setCsrfToken(response.data.csrf_token);
            // Store token in sessionStorage as backup
            sessionStorage.setItem("shopCsrfToken", response.data.csrf_token);
            sessionStorage.setItem("shopTokenTimestamp", Date.now().toString());
            return response.data.csrf_token;
          } else {
            throw new Error("Invalid CSRF token response");
          }
        } catch (err: any) {
          console.error(
            `CSRF token error (attempt ${attempt}/${retries}):`,
            err,
          );

          if (attempt === retries) {
            // Try to use cached token if available and not too old
            const cachedToken = sessionStorage.getItem("shopCsrfToken");
            const tokenTimestamp = sessionStorage.getItem("shopTokenTimestamp");
            if (
              cachedToken &&
              tokenTimestamp &&
              Date.now() - parseInt(tokenTimestamp) < 300000
            ) {
              // Use cached token if less than 5 minutes old
              setCsrfToken(cachedToken);
              return cachedToken;
            }

            setError("Failed to authenticate. Please try refreshing the page.");
            return null;
          }
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }
      return null;
    },
    [API_BASE_URL],
  );

  // Enhanced product fetching with better error handling and fallback to cached data
  const fetchProducts = useCallback(async () => {
    if (!csrfToken) return;

    try {
      setLoading(true);

      // Use cached products if available while fetching new data
      const cachedProducts = sessionStorage.getItem("shopProducts");
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
        setProducts(parsedProducts);
        setFilteredProducts(parsedProducts);
        // Still show loading indicator but user can interact with cached data
        setLoading(false);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await axios.get(`${API_BASE_URL}/admin/products/shop`, {
        headers: { "X-CSRF-Token": csrfToken },
        withCredentials: true,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.data) {
        // Add mock categories and ratings for demo purposes
        const productsWithCategories = response.data.map(
          (product: Product) => ({
            ...product,
            category:
              product.category ||
              ["Electronics", "Books", "Clothing", "School Supplies"][
                Math.floor(Math.random() * 4)
              ],

            rating: product.rating || (Math.floor(Math.random() * 50) + 1) / 10,
          }),
        );

        setProducts(productsWithCategories);
        setFilteredProducts(productsWithCategories);
        setError("");

        // Cache the products
        sessionStorage.setItem(
          "shopProducts",
          JSON.stringify(productsWithCategories),
        );
        sessionStorage.setItem("productsTimestamp", Date.now().toString());
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err: any) {
      let errorMsg = "Failed to fetch products";

      if (err.name === "AbortError") {
        errorMsg = "Request timed out. Server may be unavailable.";
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      }

      // Only show error if we don't have cached data
      if (!sessionStorage.getItem("shopProducts")) {
        setError(errorMsg);
      }
      console.error("Products fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [csrfToken, API_BASE_URL]);

  // Initial CSRF token fetch
  useEffect(() => {
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  // Fetch products when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchProducts();
    }
  }, [csrfToken, fetchProducts]);

  // Filter products based on search query and category
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query)),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // Get unique categories from products
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category || "Uncategorized")),
  ];

  // Toggle favorite status
  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  // Toggle cart status
  const toggleCart = (productId: string) => {
    const newCartItems = new Set(cartItems);
    if (newCartItems.has(productId)) {
      newCartItems.delete(productId);
    } else {
      newCartItems.add(productId);
    }
    setCartItems(newCartItems);
  };

  // Product skeleton loader
  const ProductSkeleton = () => (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
      data-oid="8tfufq0"
    >
      <Skeleton className="w-full h-48" data-oid="ztkw2vr" />
      <div className="p-4" data-oid="gw-o6cz">
        <Skeleton className="h-6 w-3/4 mb-2" data-oid="bue:ym9" />
        <Skeleton className="h-4 w-full mb-2" data-oid="sp-m_1s" />
        <Skeleton className="h-4 w-2/3 mb-4" data-oid="spjt64a" />
        <Skeleton className="h-6 w-1/4 mb-2" data-oid=".ukt_6w" />
        <Skeleton className="h-10 w-full rounded" data-oid="esvjdkg" />
      </div>
    </div>
  );

  // Beautiful loader component
  const Loader = () => (
    <div
      className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
      data-oid="ca_k_rx"
    >
      <div className="relative" data-oid="tdsv06f">
        <div
          className="h-24 w-24 rounded-full border-t-4 border-b-4 border-brand animate-spin"
          data-oid="gh-sm7m"
        ></div>
        {/* <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-brand animate-spin absolute top-4 left-4"></div> */}
        <div
          className="h-8 w-8 rounded-full border-t-4 border-b-4 border-brand animate-spin absolute top-8 left-8"
          data-oid="45q84kp"
        ></div>
      </div>
      <p className="text-green-700 font-medium mt-4 ml-4" data-oid="2n6j22d">
        Loading products...
      </p>
    </div>
  );

  // Error display
  if (error) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        data-oid="ldqnr0g"
      >
        <div
          className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border-l-4 border-red-500"
          data-oid="33clb8d"
        >
          <h2
            className="text-2xl font-bold text-gray-800 mb-4"
            data-oid="6hi4eup"
          >
            Error
          </h2>
          <p className="text-red-600 mb-4" data-oid="rm4emyq">
            {error}
          </p>
          <Button
            onClick={() =>
              fetchCsrfToken().then((token) => token && fetchProducts())
            }
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            data-oid="zasnpkc"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
      data-oid="pk0m.h2"
    >
      {/* Full-page loader */}
      {loading && <Loader data-oid=".s3_lu." />}

      {/* Hero section */}
      <div className="bg-brand text-white py-16" data-oid="jkbexci">
        <div className="container mx-auto px-4" data-oid="lfwuetc">
          <div className="max-w-3xl mx-auto text-center" data-oid="4mdt3mi">
            <ShoppingBag
              className="h-16 w-16 mx-auto mb-6 opacity-90"
              data-oid="j72b28p"
            />

            <h1 className="text-4xl font-bold mb-4" data-oid="fuezdg5">
              School Shop
            </h1>
            <p
              className="text-xl text-yellow-400 opacity-90 mb-8"
              data-oid="rt9heza"
            >
              Find the best products for your school needs
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto" data-oid=":2eiw6k">
              <Search
                className="absolute left-3 top-3 h-5 w-5 text-gray-100"
                data-oid="c-df:_i"
              />

              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 rounded-full focus:ring-2 focus:ring-white/50 focus:border-transparent w-full"
                data-oid="jb2iv7c"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto p-4 md:p-6 lg:p-8" data-oid="in8lpre">
        {/* Category filters */}
        <div
          className="mb-8 flex items-center overflow-x-auto pb-2"
          data-oid="wjp5-41"
        >
          <Filter
            className="h-5 w-5 text-brand mr-2 flex-shrink-0"
            data-oid="r1r46q1"
          />

          <span
            className="text-brand mr-4 font-medium flex-shrink-0"
            data-oid="vqu:73p"
          >
            Filter by:
          </span>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`mr-2 cursor-pointer px-3 py-1 ${selectedCategory === category ? "bg-brand hover:bg-green-700" : "hover:bg-green-50"}`}
              onClick={() => setSelectedCategory(category)}
              data-oid="_p9uml7"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 && !loading ? (
          <EmptyProductState data-oid="g94nlyl" />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            data-oid="y:92.6-"
          >
            {loading
              ? // Skeleton loaders
                Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <ProductSkeleton key={index} data-oid="iiq:cn7" />
                  ))
              : // Actual products
                filteredProducts.map((product) => (
                  <Card
                    key={product.product_id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    data-oid=".za5tvn"
                  >
                    <div className="relative" data-oid="__5oh.n">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          data-oid="co7ho_q"
                        />
                      ) : (
                        <div
                          className="w-full h-48 bg-gray-100 flex items-center justify-center"
                          data-oid="3t97nq."
                        >
                          <ShoppingBag
                            className="h-12 w-12 text-gray-300"
                            data-oid="njk6e12"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => toggleFavorite(product.product_id)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                        data-oid=".sr71oi"
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.has(product.product_id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                          data-oid="6nw_.f4"
                        />
                      </button>
                    </div>

                    <CardHeader className="pb-2" data-oid="gixvmqt">
                      <div
                        className="flex justify-between items-start"
                        data-oid="we-w:eb"
                      >
                        <h3
                          className="text-lg font-bold text-gray-800 line-clamp-2"
                          data-oid=":egmd9x"
                        >
                          {product.name}
                        </h3>
                        {product.rating && (
                          <div
                            className="flex items-center bg-brand text-white px-2 py-1 rounded"
                            data-oid="dgr3-1r"
                          >
                            <Star
                              className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1"
                              data-oid="lsxxwtl"
                            />

                            <span
                              className="text-xs font-medium"
                              data-oid="lc4bi67"
                            >
                              {product.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      {product.category && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs bg-gray-50"
                          data-oid="czpsf5a"
                        >
                          {product.category}
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent data-oid="ofkn76d">
                      <p
                        className="text-gray-600 text-sm line-clamp-2 mb-2"
                        data-oid="ar6y--s"
                      >
                        {product.description || "No description available"}
                      </p>
                      <p
                        className="text-brand font-bold text-lg"
                        data-oid="ln:fi3f"
                      >
                        RWF {product.price.toFixed(2)}
                      </p>
                    </CardContent>

                    <CardFooter className="flex gap-2" data-oid="n3nudv.">
                      <Button
                        className="flex-1 bg-brand hover:bg-brand text-white"
                        asChild
                        data-oid=":_rp5.p"
                      >
                        <a
                          href={product.affiliate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-oid="jl0igs-"
                        >
                          Buy Now
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className={`${cartItems.has(product.product_id) ? "bg-green-50 border-brand" : ""}`}
                        onClick={() => toggleCart(product.product_id)}
                        data-oid="u9zyzeo"
                      >
                        <ShoppingCart
                          className={`h-4 w-4 ${cartItems.has(product.product_id) ? "text-green-600" : ""}`}
                          data-oid="8svnwrr"
                        />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        )}

        {/* Cart indicator */}
        {cartItems.size > 0 && (
          <div className="fixed bottom-6 right-6" data-oid="lvn8m8s">
            <Button
              className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center relative"
              data-oid="9nqeb.t"
            >
              <ShoppingCart className="h-6 w-6 text-white" data-oid="by:a7my" />
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                data-oid="agout.g"
              >
                {cartItems.size}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

// Add this component for when no products are found but we're not in an error state
const EmptyProductState = () => (
  <div className="text-center py-16" data-oid="b7tqju.">
    <div
      className="bg-green-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4"
      data-oid="2-myx:q"
    >
      <ShoppingBag className="h-12 w-12 text-green-500" data-oid="2k11wwb" />
    </div>
    <h3 className="text-2xl font-bold text-gray-700 mb-2" data-oid="n62sdg0">
      No products found
    </h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto" data-oid="-i8ng5p">
      We couldn't find any products matching your criteria. Try adjusting your
      search or check back later.
    </p>
    <div className="flex justify-center gap-4" data-oid="za9rfgj">
      <Button
        onClick={() => {
          setSearchQuery("");
          setSelectedCategory("all");
        }}
        className="bg-green-600 hover:bg-green-700 text-white"
        data-oid="..jgt:7"
      >
        Clear Filters
      </Button>
      <Button
        variant="outline"
        onClick={() => fetchProducts()}
        className="border-brand text-green-700 hover:bg-green-50"
        data-oid="fchq15f"
      >
        Refresh Products
      </Button>
    </div>
  </div>
);
