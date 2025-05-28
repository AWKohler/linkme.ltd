'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Spinner
} from '@heroui/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { MapPin, TrendingUp, Smartphone, Globe } from 'lucide-react';
import WorldMap from '@/components/WorldMap';
import DashboardLayout from '@/components/DashboardLayout';

interface QRCode {
  id: string;
  slug: string;
  targetUrl: string;
  enableTracking: boolean;
}

interface DeviceAnalytics {
  android: number;
  ios: number;
  other: number;
}

interface LocationItem {
  name: string;
  count: number;
  country?: string;
  region?: string;
}

interface LocationAnalytics {
  countries: LocationItem[];
  regions: LocationItem[];
  cities: LocationItem[];
}

interface MapDataPoint {
  country: string;
  city: string;
  region: string;
  count: number;
  coordinates?: [number, number];
}

interface ScanAnalytics {
  totalScans: number;
  deviceBreakdown: DeviceAnalytics;
  locationBreakdown: LocationAnalytics;
  mapData: MapDataPoint[];
}

const DEVICE_COLORS = {
  android: '#34D399',
  ios: '#60A5FA', 
  other: '#F59E0B'
};

export default function AnalyticsPage() {
  const { user } = useUser();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [selectedQRCodes, setSelectedQRCodes] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<ScanAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchQRCodes = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/qrcodes');
        if (response.ok) {
          const data = await response.json();
          const trackingEnabledQRCodes = data.filter((qr: QRCode) => qr.enableTracking);
          setQrCodes(trackingEnabledQRCodes);
          
          const allIds = trackingEnabledQRCodes.map((qr: QRCode) => qr.id);
          setSelectedQRCodes(allIds);
        }
      } catch (error) {
        console.error('Error fetching QR codes:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchQRCodes();
  }, [user]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (selectedQRCodes.length === 0) {
        setAnalytics(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qrCodeIds: selectedQRCodes
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialLoading) {
      fetchAnalytics();
    }
  }, [selectedQRCodes, initialLoading]);

  const handleQRCodeToggle = (qrCodeId: string, checked: boolean) => {
    setSelectedQRCodes(prev => 
      checked
        ? [...prev, qrCodeId]
        : prev.filter(id => id !== qrCodeId)
    );
  };

  const selectAll = () => {
    setSelectedQRCodes(qrCodes.map(qr => qr.id));
  };

  const deselectAll = () => {
    setSelectedQRCodes([]);
  };

  if (!user || initialLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const deviceChartData = analytics ? [
    { name: 'Android', value: analytics.deviceBreakdown.android, color: DEVICE_COLORS.android },
    { name: 'iOS', value: analytics.deviceBreakdown.ios, color: DEVICE_COLORS.ios },
    { name: 'Other', value: analytics.deviceBreakdown.other, color: DEVICE_COLORS.other },
  ] : [];
  
  const hasDeviceData = deviceChartData.some(item => item.value > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>

        {qrCodes.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">No trackable QR codes found</h3>
                <p className="text-gray-600 mb-4">
                  Create QR codes with tracking enabled to see analytics here.
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Select QR Codes to Analyze
                </h2>
              </CardHeader>
              <CardBody>
                <div className="flex gap-4 mb-4">
                  <Button variant="bordered" onPress={selectAll} size="sm">
                    Select All
                  </Button>
                  <Button variant="bordered" onPress={deselectAll} size="sm">
                    Deselect All
                  </Button>
                  <span className="text-sm text-gray-600 self-center">
                    {selectedQRCodes.length} of {qrCodes.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qrCodes.map((qrCode) => (
                    <div key={qrCode.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        isSelected={selectedQRCodes.includes(qrCode.id)}
                        onValueChange={(checked) => handleQRCodeToggle(qrCode.id, checked)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{qrCode.slug}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {qrCode.targetUrl}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {loading && (
              <div className="text-center py-8">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600">Loading analytics...</p>
              </div>
            )}

            {analytics && !loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Scans</p>
                          <p className="text-2xl font-bold">{analytics.totalScans.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Countries</p>
                          <p className="text-2xl font-bold">{analytics.locationBreakdown.countries.length}</p>
                        </div>
                        <Globe className="h-8 w-8 text-green-500" />
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Cities</p>
                          <p className="text-2xl font-bold">{analytics.locationBreakdown.cities.length}</p>
                        </div>
                        <MapPin className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Mobile Scans</p>
                          <p className="text-2xl font-bold">
                            {((analytics.deviceBreakdown.android + analytics.deviceBreakdown.ios) / analytics.totalScans * 100).toFixed(1)}%
                          </p>
                        </div>
                        <Smartphone className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Scan Locations Worldwide
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <WorldMap data={analytics.mapData} />
                  </CardBody>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Device Types</h2>
                    </CardHeader>
                    <CardBody>
                      {hasDeviceData ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={deviceChartData.filter(item => item.value > 0)}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                            >
                              {deviceChartData.filter(item => item.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                          <div className="text-center">
                            <p className="text-lg font-medium">No device data available</p>
                            <p className="text-sm">Device information is collected from QR code scans</p>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Top Countries</h2>
                    </CardHeader>
                    <CardBody>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.locationBreakdown.countries.slice(0, 10)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardBody>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Top Cities</h2>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {analytics.locationBreakdown.cities.slice(0, 20).map((city, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                            <div>
                              <div className="font-medium">{city.name}</div>
                              <div className="text-sm text-gray-600">
                                {city.region}, {city.country}
                              </div>
                            </div>
                            <div className="font-bold">{city.count}</div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Top Regions</h2>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {analytics.locationBreakdown.regions.slice(0, 20).map((region, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                            <div>
                              <div className="font-medium">{region.name}</div>
                              <div className="text-sm text-gray-600">{region.country}</div>
                            </div>
                            <div className="font-bold">{region.count}</div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">All Countries</h2>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {analytics.locationBreakdown.countries.map((country, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                            <div className="font-medium">{country.name}</div>
                            <div className="font-bold">{country.count}</div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </>
            )}

            {selectedQRCodes.length === 0 && !loading && (
              <Card>
                <CardBody>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No QR codes selected</h3>
                    <p className="text-gray-600">
                      Select one or more QR codes above to view their analytics.
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}