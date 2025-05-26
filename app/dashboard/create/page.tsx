'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function CreateQRCodePage() {
  const { user } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState('');
  const [targetUrl, setTargetUrl] = useState('https://example.com/');
  const [enableTracking, setEnableTracking] = useState(false);

  type QRDesignData = Record<string, unknown>;

  // const handleSave = async (designData: any) => {
  const handleSave = async (designData: QRDesignData): Promise<void> => {
    if (!user) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: slug || `qr-${Date.now()}`,
          targetUrl,
          designJson: designData,
          enableTracking,
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to save QR code');
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create QR Code</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QRCodeGenerator 
            initialData={{
              text: enableTracking ? `https://linkme.ltd/${slug || 'your-slug'}` : targetUrl,
              slug,
              targetUrl,
              enableTracking,
            }}
            onSave={handleSave}
            saving={saving}
          />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">Slug (URL identifier)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-qr-code"
                />
              </div>
              
              <div>
                <Label htmlFor="targetUrl">Target URL</Label>
                <Input
                  id="targetUrl"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableTracking"
                  checked={enableTracking}
                  onCheckedChange={setEnableTracking}
                />
                <Label htmlFor="enableTracking" className="cursor-pointer">
                  Enable tracking
                </Label>
              </div>
              
              {enableTracking && (
                <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-md">
                  <p className="font-medium">Tracking enabled</p>
                  <p>QR code will redirect through: <code>https://linkme.ltd/{slug || 'your-slug'}</code></p>
                  <p>This allows you to track scans, locations, and user agents.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}