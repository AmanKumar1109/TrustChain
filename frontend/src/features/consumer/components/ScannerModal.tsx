import React from 'react';
import { CameraQrScanner } from '../../../components/common/CameraQrScanner';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  if (!isOpen) return null;

  const handleScan = (code: string) => {
    onScanSuccess(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <CameraQrScanner
          onScan={handleScan}
          onClose={onClose}
          title="Scan Packaging QR"
          subtitle="Point camera at product label or QR code"
          showManualFallback={true}
        />
      </div>
    </div>
  );
};

export default ScannerModal;
