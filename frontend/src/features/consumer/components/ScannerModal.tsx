import React, { useState } from 'react';
import { X, Flashlight, Camera, QrCode, Search, CheckCircle2 } from 'lucide-react';

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
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScanSuccess('TC-8924-GENUINE');
      onClose();
    }, 1400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onScanSuccess(manualCode.trim().toUpperCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white animate-in fade-in duration-200">
      {/* Top Bar with Flashlight & Close */}
      <div className="p-6 flex items-center justify-between z-20">
        <button
          type="button"
          onClick={() => setFlashlightOn(!flashlightOn)}
          className={`p-3 rounded-full backdrop-blur-md transition-colors ${
            flashlightOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          aria-label="Toggle Flashlight"
        >
          <Flashlight className="w-5 h-5" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
          Point at packaging QR
        </span>

        <button
          type="button"
          onClick={onClose}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
          aria-label="Close Scanner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Scan Frame Viewport */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8">
        <div
          onClick={handleSimulateScan}
          className="relative w-72 h-72 rounded-3xl border-2 border-white/40 flex items-center justify-center cursor-pointer group shadow-2xl"
        >
          {/* Laser scanning beam */}
          <div className="absolute left-4 right-4 h-0.5 bg-emerald-400 shadow-[0_0_15px_#34D399] animate-bounce top-1/2 -translate-y-1/2" />

          {/* Flashlight ambient illumination simulation */}
          {flashlightOn && (
            <div className="absolute inset-0 bg-amber-400/20 rounded-3xl blur-xl pointer-events-none" />
          )}

          <div className="text-center space-y-2 p-4">
            <Camera className="w-8 h-8 mx-auto text-white/60 group-hover:text-emerald-400 transition-colors" />
            <span className="text-xs font-medium text-white/80 block">
              {isScanning ? 'Verifying Polygon Signature...' : 'Tap frame to scan sample box'}
            </span>
          </div>
        </div>

        <p className="text-xs text-white/60 mt-6 text-center max-w-xs">
          Center the square QR code on the medication box, gadget pack, or luxury tag.
        </p>
      </div>

      {/* Bottom Bar: Manual Code Input Option */}
      <div className="p-6 bg-black/60 backdrop-blur-md z-20 space-y-3">
        {!showManualInput ? (
          <button
            type="button"
            onClick={() => setShowManualInput(true)}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-md transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Enter Code Manually</span>
          </button>
        ) : (
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. TC-8924-GENUINE"
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 text-white placeholder:text-white/40 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 uppercase"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-500 text-black text-xs font-medium rounded-2xl hover:bg-emerald-400 transition-colors"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScannerModal;
