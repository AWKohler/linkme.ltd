'use client';

import { useState, useEffect } from 'react';
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

interface QRCodeData {
  id: string;
  slug: string;
  targetUrl: string;
  designJson: Record<string, unknown>;
  enableTracking: boolean;
  createdBy: string;
}

export default function EditQRCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [slug, setSlug] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [enableTracking, setEnableTracking] = useState(false);
  const [paramId, setParamId] = useState<string>('');

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setParamId(id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!paramId) return;
    
    const fetchQRCode = async () => {
      try {
        const response = await fetch(`/api/qrcodes/${paramId}`);
        if (response.ok) {
          const data = await response.json();
          setQrCodeData(data);
          setSlug(data.slug);
          setTargetUrl(data.targetUrl);
          setEnableTracking(data.enableTracking || false);
        } else {
          console.error('Failed to fetch QR code');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQRCode();
    }
  }, [user, paramId, router]);

  const handleSave = async (designData: Record<string, unknown>): Promise<void> => {
    if (!user || !qrCodeData) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/qrcodes/${paramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          targetUrl,
          designJson: designData,
          enableTracking,
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to update QR code');
      }
    } catch (error) {
      console.error('Error updating QR code:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  if (!qrCodeData) {
    return <div>QR Code not found</div>;
  }

  // Check if user owns this QR code
  if (qrCodeData.createdBy !== user.id) {
    router.push('/dashboard');
    return <div>Access denied</div>;
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
        <h1 className="text-3xl font-bold">Edit QR Code</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QRCodeGenerator 
            initialData={{
              text: enableTracking ? `https://linkme.ltd/${slug}` : targetUrl,
              slug,
              targetUrl,
              enableTracking,
              ...qrCodeData.designJson,
            }}
            onSave={handleSave}
            saving={saving}
            isEditing={true}
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
                  <p>QR code will redirect through: <code>https://linkme.ltd/{slug}</code></p>
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