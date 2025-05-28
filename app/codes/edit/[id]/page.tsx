'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Switch,
  Spinner
} from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
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
          router.push('/codes');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        router.push('/codes');
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
        router.push('/codes');
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
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!qrCodeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">QR Code not found</h2>
          <Link href="/codes">
            <Button color="primary">Back to QR Codes</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if user owns this QR code
  if (qrCodeData.createdBy !== user.id) {
    router.push('/codes');
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Access denied</h2>
          <Link href="/codes">
            <Button color="primary">Back to QR Codes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/codes">
              <Button variant="ghost" startContent={<ArrowLeft className="w-4 h-4" />}>
                Back to QR Codes
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
                  <h2 className="text-xl font-semibold">QR Code Settings</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Slug (URL identifier)</label>
                    <Input
                      value={slug}
                      onValueChange={setSlug}
                      placeholder="my-qr-code"
                      variant="bordered"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Target URL</label>
                    <Input
                      value={targetUrl}
                      onValueChange={setTargetUrl}
                      placeholder="https://example.com"
                      variant="bordered"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Switch
                      isSelected={enableTracking}
                      onValueChange={setEnableTracking}
                    />
                    <span className="text-sm font-medium">Enable tracking</span>
                  </div>
                  
                  {enableTracking && (
                    <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-md">
                      <p className="font-medium">Tracking enabled</p>
                      <p>QR code will redirect through: <code>https://linkme.ltd/{slug}</code></p>
                      <p>This allows you to track scans, locations, and user agents.</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}