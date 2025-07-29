import React from 'react';
import { QrCode } from 'lucide-react';

interface QRCodeViewerProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCodeViewer: React.FC<QRCodeViewerProps> = ({ 
  value, 
  size = 200, 
  className = '' 
}) => {
  // Mock QR code display - in a real app, you'd use a QR code library
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className="bg-white border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
          <p className="text-xs text-gray-500 break-all">{value}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
        Scan to verify certificate
      </p>
    </div>
  );
};

export default QRCodeViewer;