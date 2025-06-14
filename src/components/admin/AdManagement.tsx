
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Ad {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  status: 'active' | 'paused' | 'scheduled';
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
}

const AdManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ads] = useState<Ad[]>([
    {
      id: '1',
      title: 'Premium Banking Services',
      subtitle: 'Secure money transfers for students',
      ctaText: 'Learn More',
      ctaLink: '#',
      imageUrl: '/placeholder.svg',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      impressions: 15420,
      clicks: 892
    },
    {
      id: '2',
      title: 'Student Discounts Available',
      subtitle: 'Save on transaction fees',
      ctaText: 'Get Discount',
      ctaLink: '#',
      imageUrl: '/placeholder.svg',
      status: 'paused',
      startDate: '2024-06-10',
      endDate: '2024-07-10',
      impressions: 8250,
      clicks: 456
    }
  ]);

  const [newAd, setNewAd] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    imageUrl: '/placeholder.svg'
  });

  const handleCreateAd = () => {
    console.log('Creating new ad:', newAd);
    setIsCreateModalOpen(false);
    setNewAd({
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      imageUrl: '/placeholder.svg'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ad Management</span>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Ad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Ad</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Ad title"
                      value={newAd.title}
                      onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subtitle</label>
                    <Input
                      placeholder="Ad subtitle"
                      value={newAd.subtitle}
                      onChange={(e) => setNewAd({ ...newAd, subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CTA Text</label>
                    <Input
                      placeholder="Call to action text"
                      value={newAd.ctaText}
                      onChange={(e) => setNewAd({ ...newAd, ctaText: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CTA Link</label>
                    <Input
                      placeholder="https://example.com"
                      value={newAd.ctaLink}
                      onChange={(e) => setNewAd({ ...newAd, ctaLink: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateAd} className="w-full">
                    Create Ad
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {ads.map((ad) => (
              <Card key={ad.id} className="border border-emerald-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-emerald-800">{ad.title}</h3>
                          <p className="text-muted-foreground">{ad.subtitle}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>CTA: {ad.ctaText}</span>
                            <span>•</span>
                            <span>{ad.impressions.toLocaleString()} impressions</span>
                            <span>•</span>
                            <span>{ad.clicks.toLocaleString()} clicks</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ad.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : ad.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ad.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{ad.startDate} - {ad.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            {ad.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdManagement;