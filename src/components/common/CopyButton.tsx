import { useState, useCallback, useRef, useEffect, type FC } from 'react';
import { Copy, Check } from 'lucide-react';
import { CLIPBOARD_RESET_MS } from '@/constants/limits';

export interface CopyButtonProps {
  readonly textToCopy: string;
  readonly label?: string | undefined;
  readonly copiedLabel?: string | undefined;
  readonly className?: string | undefined;
}

function useClipboardCopy(textToCopy: string) {
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, CLIPBOARD_RESET_MS);
    } catch {
      setCopied(false);
    }
  }, [textToCopy]);

  return { copied, handleCopy };
}

export const CopyButton: FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
}) => {
  const { copied, handleCopy } = useClipboardCopy(textToCopy);

  return (
    <button
      type="button"
      onClick={() => { void handleCopy(); }}
      aria-label={copied ? copiedLabel : label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white text-sentinel-secondary hover:text-sentinel-ink hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors ${className}`}
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-600" aria-hidden="true" />
          <span className="text-emerald-700">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy size={13} aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
