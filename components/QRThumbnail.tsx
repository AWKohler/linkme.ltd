'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRThumbnailProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
}

export default function QRThumbnail({ 
  value, 
  size = 40, 
  bgColor = '#ffffff', 
  fgColor = '#000000' 
}: QRThumbnailProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 1,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [value, size, bgColor, fgColor]);

  if (!qrDataUrl) {
    return (
      <div 
        className="bg-gray-200 animate-pulse rounded"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img 
      src={qrDataUrl} 
      alt="QR Code" 
      width={size} 
      height={size}
      className="rounded"
    />
  );
}