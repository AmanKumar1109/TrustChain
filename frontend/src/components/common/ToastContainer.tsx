import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { toast, ToastMessage } from '../../services/toast';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        let borderClass = 'border-black/10 bg-white text-black shadow-xl';
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

        if (t.type === 'success') {
          borderClass = 'border-emerald-500/20 bg-emerald-950 text-emerald-100 shadow-emerald-950/20 shadow-xl';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (t.type === 'error') {
          borderClass = 'border-rose-500/20 bg-rose-950 text-rose-100 shadow-rose-950/20 shadow-xl';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (t.type === 'warning') {
          borderClass = 'border-amber-500/20 bg-amber-950 text-amber-100 shadow-amber-950/20 shadow-xl';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else {
          borderClass = 'border-blue-500/20 bg-slate-900 text-slate-100 shadow-xl';
          icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-top-3 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
              {t.message}
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
