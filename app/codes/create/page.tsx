'use client';

import { useState } from 'react';
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
        router.push('/codes');
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
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Spinner size="lg" />
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
                  <p>QR code will redirect through: <code>https://linkme.ltd/{slug || 'your-slug'}</code></p>
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