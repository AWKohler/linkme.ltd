'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Spinner
} from '@heroui/react';
import { Plus, Edit, ExternalLink, QrCode } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import QRThumbnail from '@/components/QRThumbnail';

interface QRCodeData {
  id: string;
  slug: string;
  targetUrl: string;
  enableTracking: boolean;
  createdAt: string;
  bgColor?: string;
  fgColor?: string;
}

export default function CodesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [userQRCodes, setUserQRCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchQRCodes = async () => {
      try {
        const response = await fetch('/api/qrcodes');
        if (response.ok) {
          const data = await response.json();
          setUserQRCodes(data);
        }
      } catch (error) {
        console.error('Error fetching QR codes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [user, router]);

  if (!user || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">QR Codes</h1>
          <Link href="/codes/create">
            <Button color="primary" startContent={<Plus className="w-4 h-4" />}>
              Create New QR Code
            </Button>
          </Link>
        </div>

        {userQRCodes.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-16">
                <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No QR codes yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first QR code to get started. You can track scans, customize designs, and manage all your codes from here.
                </p>
                <Link href="/codes/create">
                  <Button color="primary" size="lg" startContent={<Plus className="w-5 h-5" />}>
                    Create QR Code
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Your QR Codes ({userQRCodes.length})</h2>
            </CardHeader>
            <CardBody className="p-0">
              <Table aria-label="QR Codes table" removeWrapper>
                <TableHeader>
                  <TableColumn key="qrcode" width={80}>QR CODE</TableColumn>
                  <TableColumn key="slug">SLUG</TableColumn>
                  <TableColumn key="targetUrl">TARGET URL</TableColumn>
                  <TableColumn key="status">STATUS</TableColumn>
                  <TableColumn key="created">CREATED</TableColumn>
                  <TableColumn key="actions" width={120}>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={userQRCodes}>
                  {(qrCode) => (
                    <TableRow key={qrCode.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white p-1">
                          <QRThumbnail
                            value={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://linkme.ltd'}/${qrCode.slug}`}
                            size={40}
                            bgColor={qrCode.bgColor || '#ffffff'}
                            fgColor={qrCode.fgColor || '#000000'}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{qrCode.slug}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-gray-600">
                          {qrCode.targetUrl}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={qrCode.enableTracking ? "success" : "default"}
                          variant="flat"
                          size="sm"
                        >
                          {qrCode.enableTracking ? "Tracking" : "Static"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(qrCode.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/codes/edit/${qrCode.id}`}>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-600"
                            as="a"
                            href={qrCode.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}

        {userQRCodes.length > 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Need more QR codes?</h3>
                <p className="text-gray-600 mb-4">
                  Create additional QR codes for different campaigns, products, or use cases.
                </p>
                <Link href="/codes/create">
                  <Button color="primary" startContent={<Plus className="w-4 h-4" />}>
                    Create Another QR Code
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}