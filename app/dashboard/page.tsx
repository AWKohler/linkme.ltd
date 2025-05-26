import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { qrcodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, ExternalLink } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const userQRCodes = await db
    .select()
    .from(qrcodes)
    .where(eq(qrcodes.createdBy, userId))
    .orderBy(qrcodes.createdAt);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">QR Code Dashboard</h1>
        <Link href="/dashboard/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New QR Code
          </Button>
        </Link>
      </div>

      {userQRCodes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No QR codes yet</h3>
              <p className="text-gray-600 mb-4">Create your first QR code to get started</p>
              <Link href="/dashboard/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create QR Code
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userQRCodes.map((qrCode) => (
            <Card key={qrCode.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{qrCode.slug}</span>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/edit/${qrCode.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <a 
                      href={qrCode.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit
                      </Button>
                    </a>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Target URL:</span>
                    <p className="truncate text-gray-600">{qrCode.targetUrl}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-gray-600">
                      {new Date(qrCode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}