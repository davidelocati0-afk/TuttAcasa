import { useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import theme from '../../styles/theme';

export default function BarcodeScanner({ open, onClose, onScan }) {
  const scannerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    let scanner = null;
    const init = async () => {
      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        scanner = new Html5QrcodeScanner('barcode-reader', {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        }, false);

        instanceRef.current = scanner;

        scanner.render(
          (decodedText) => {
            onScan(decodedText);
            scanner.clear().catch(() => {});
            onClose();
          },
          (err) => {
            // scan error, ignore
          }
        );
      } catch (err) {
        console.error('Scanner init error:', err);
      }
    };

    const timeout = setTimeout(init, 100);

    return () => {
      clearTimeout(timeout);
      if (instanceRef.current) {
        instanceRef.current.clear().catch(() => {});
        instanceRef.current = null;
      }
    };
  }, [open, onScan, onClose]);

  return (
    <Modal open={open} onClose={() => {
      if (instanceRef.current) {
        instanceRef.current.clear().catch(() => {});
        instanceRef.current = null;
      }
      onClose();
    }} title="Scansiona barcode">
      <div id="barcode-reader" ref={scannerRef} style={{ width: '100%' }} />
      <p style={{ fontSize: '13px', color: theme.text.muted, textAlign: 'center', marginTop: '12px' }}>
        Inquadra il codice a barre del prodotto
      </p>
    </Modal>
  );
}
