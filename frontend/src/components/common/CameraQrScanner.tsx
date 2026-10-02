import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, Search, AlertCircle, RefreshCw, Flashlight, X, Check } from 'lucide-react';

export interface CameraQrScannerProps {
  onScan: (code: string) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  showManualFallback?: boolean;
}

/**
 * Extracts a product unit code from a raw scan string,
 * automatically handling full URLs (e.g. https://domain/verify/TC-8924-GENUINE or ?code=...)
 */
export function extractCodeFromQr(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const codeParam = url.searchParams.get('code') || url.searchParams.get('unitCode');
      if (codeParam) return codeParam.trim();

      const segments = url.pathname.split('/').filter(Boolean);
      const targetIdx = segments.findIndex((s) => ['verify', 'claim', 'product', 'unit'].includes(s.toLowerCase()));
      if (targetIdx !== -1 && segments[targetIdx + 1]) {
        return decodeURIComponent(segments[targetIdx + 1]).trim();
      }
      if (segments.length > 0) {
        return decodeURIComponent(segments[segments.length - 1]).trim();
      }
    }
  } catch {
    // If URL parsing fails, proceed with raw string
  }
  return trimmed;
}

export const CameraQrScanner: React.FC<CameraQrScannerProps> = ({
  onScan,
  onClose,
  title = 'Scan Product QR Code',
  subtitle = 'Position the packaging QR code within the frame to verify authenticity',
  showManualFallback = true,
}) => {
  const containerIdRef = useRef<string>(`qr-reader-${Math.random().toString(36).substring(2, 9)}`);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  // Initialize and start camera scanner
  useEffect(() => {
    let isCancelled = false;

    async function startScanner() {
      if (mode !== 'camera') return;
      setIsInitializing(true);
      setCameraError(null);

      // Brief delay to ensure DOM element is mounted
      await new Promise((r) => setTimeout(r, 150));
      if (isCancelled) return;

      const elementId = containerIdRef.current;
      const element = document.getElementById(elementId);
      if (!element) {
        setCameraError('Scanner container was not found.');
        setIsInitializing(false);
        return;
      }

      try {
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(elementId, {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.DATA_MATRIX,
            ],
            verbose: false,
          });
        }

        const scanner = html5QrCodeRef.current;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isCancelled || hasScanned) return;
            const cleanCode = extractCodeFromQr(decodedText);
            if (cleanCode) {
              setHasScanned(true);
              // Stop camera and dispatch scan
              scanner
                .stop()
                .catch(() => {})
                .finally(() => {
                  onScan(cleanCode);
                });
            }
          },
          () => {
            // Frame error (no QR detected yet) - silent
          }
        );

        if (!isCancelled) {
          setIsInitializing(false);
        }
      } catch (err: any) {
        if (isCancelled) return;
        console.warn('[Camera Scanner Warning] Camera start failed:', err);
        const errString = err?.message || String(err);
        if (errString.includes('NotAllowedError') || errString.includes('Permission')) {
          setCameraError('Camera access was denied. Please allow camera permissions in your browser or enter the code manually.');
        } else if (errString.includes('NotFoundError') || errString.includes('DevicesNotFoundError')) {
          setCameraError('No camera found on this device. Please use manual code entry.');
        } else {
          setCameraError('Unable to access camera feed. Please enter the product code manually.');
        }
        setIsInitializing(false);
      }
    }

    startScanner();

    return () => {
      isCancelled = true;
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        if (scanner.isScanning) {
          scanner
            .stop()
            .then(() => scanner.clear())
            .catch(() => {});
        }
      }
    };
  }, [mode]);

  // Toggle torch/flashlight if supported
  const toggleTorch = async () => {
    try {
      const scanner = html5QrCodeRef.current;
      if (scanner && scanner.isScanning) {
        // html5-qrcode torch API
        await (scanner as any).applyVideoConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      }
    } catch {
      // Torch not supported on current device
      setTorchOn(!torchOn);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualCode.trim();
    if (!clean) return;
    onScan(clean);
  };

  return (
    <div className="relative w-full max-w-lg bg-black text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      {/* Header bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white">{title}</h3>
            <p className="text-[11px] text-white/60 line-clamp-1">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {mode === 'camera' && !cameraError && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`p-2 rounded-xl text-xs transition-colors ${
                torchOn ? 'bg-amber-400 text-black font-semibold' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Toggle Flashlight"
            >
              <Flashlight className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close scanner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Scanner Body */}
      <div className="p-4 sm:p-6 space-y-4">
        {mode === 'camera' && !cameraError ? (
          <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center">
            {/* The html5-qrcode video container */}
            <div id={containerIdRef.current} className="w-full h-full object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />

            {/* Target reticle overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56 rounded-2xl border-2 border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                {/* Laser animation beam */}
                <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34D399] top-1/2 -translate-y-1/2 animate-bounce" />

                {/* Corner crosshairs */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br" />
              </div>
            </div>

            {isInitializing && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 text-white/80 p-4 text-center">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                <span className="text-xs font-medium">Connecting Camera...</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Camera Error or Manual Fallback State */}
        {(cameraError || mode === 'manual') && (
          <div className="space-y-4 py-2">
            {cameraError && (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 leading-relaxed">{cameraError}</div>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                Enter Serial / Verification Code
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. TC-8924-GENUINE"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="w-full py-3 bg-emerald-500 text-black text-xs font-semibold uppercase tracking-wider rounded-2xl hover:bg-emerald-400 disabled:opacity-40 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Verify Product Code</span>
                <Check className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Pre-filled Codes */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-medium text-white/50 block">Quick Demo Codes:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onScan('TC-8924-GENUINE')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono hover:bg-emerald-500/30 transition-colors"
                >
                  TC-8924-GENUINE
                </button>
                <button
                  type="button"
                  onClick={() => onScan('TC-3310-SUSPICIOUS')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono hover:bg-amber-500/30 transition-colors"
                >
                  TC-3310-SUSPICIOUS
                </button>
                <button
                  type="button"
                  onClick={() => onScan('TC-0000-FAKE')}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-mono hover:bg-rose-500/30 transition-colors"
                >
                  TC-0000-FAKE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Switch mode controls */}
        {showManualFallback && (
          <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
            {mode === 'camera' && !cameraError ? (
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Switch to Manual Code Entry</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCameraError(null);
                  setMode('camera');
                }}
                className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Retry Camera Scan</span>
              </button>
            )}

            <span className="text-[10px] text-white/40">Secure Optical Scanner</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraQrScanner;
