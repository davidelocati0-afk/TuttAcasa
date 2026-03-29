import { useRef, useState } from 'react';
import Modal from '../ui/Modal';
import theme from '../../styles/theme';
import { useOcr } from '../../hooks/useOcr';

export default function ReceiptScanner({ open, onClose, onConfirm }) {
  const fileRef = useRef(null);
  const { processing, progress, results, setResults, error, processReceipt } = useOcr();
  const [step, setStep] = useState('capture');

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStep('processing');
    processReceipt(file).then(items => {
      if (items.length > 0) setStep('confirm');
      else setStep('capture');
    });
  }

  function toggleItem(idx) {
    setResults(prev => prev.map((item, i) => i === idx ? { ...item, selected: !item.selected } : item));
  }

  function handleConfirm() {
    const selected = results.filter(r => r.selected).map(r => r.name);
    onConfirm(selected);
    setStep('capture');
    onClose();
  }

  function handleClose() {
    setStep('capture');
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Scansiona scontrino">
      {step === 'capture' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '14px', color: theme.text.muted, marginBottom: '16px' }}>
            Scatta una foto dello scontrino o scegli un&apos;immagine
          </p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} style={{
            padding: '14px 28px', borderRadius: theme.radius.md,
            background: theme.gradient, color: '#fff', fontSize: '15px', fontWeight: '700',
            border: 'none', cursor: 'pointer', boxShadow: theme.shadow.md,
          }}>
            Scatta foto / Scegli immagine
          </button>
          {error && <p style={{ color: theme.danger, fontSize: '13px', marginTop: '12px' }}>{error}</p>}
          <p style={{ fontSize: '12px', color: theme.text.muted, marginTop: '16px', maxWidth: '280px', margin: '16px auto 0' }}>
            La lettura potrebbe non essere perfetta. Potrai modificare i risultati prima di confermare.
          </p>
        </div>
      )}

      {step === 'processing' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>{'🔍'}</div>
          <p style={{ fontSize: '15px', fontWeight: '600', color: theme.text.primary }}>Analisi in corso...</p>
          <div style={{
            width: '200px', height: '6px', borderRadius: '3px',
            background: theme.primary[100], margin: '16px auto', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: '3px', background: theme.gradient,
              width: `${progress}%`, transition: 'width 0.3s',
            }} />
          </div>
          <p style={{ fontSize: '13px', color: theme.text.muted }}>{progress}%</p>
        </div>
      )}

      {step === 'confirm' && (
        <div>
          <p style={{ fontSize: '14px', color: theme.text.muted, marginBottom: '12px' }}>
            Seleziona i prodotti da aggiungere alla dispensa:
          </p>
          <div style={{ maxHeight: '300px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {results.map((item, idx) => (
              <div key={idx} onClick={() => toggleItem(idx)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: theme.radius.md,
                background: item.selected ? theme.primary[50] : '#fff',
                border: `1.5px solid ${item.selected ? theme.primary[300] : theme.border.light}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '4px',
                  border: `2px solid ${item.selected ? theme.primary[500] : theme.border.medium}`,
                  background: item.selected ? theme.primary[500] : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {item.selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <span style={{ fontSize: '14px', color: theme.text.primary }}>{item.name}</span>
              </div>
            ))}
          </div>
          <button onClick={handleConfirm} style={{
            width: '100%', padding: '14px', borderRadius: theme.radius.md,
            background: theme.gradient, color: '#fff', fontSize: '16px', fontWeight: '700',
            border: 'none', cursor: 'pointer', marginTop: '16px', boxShadow: theme.shadow.md,
          }}>
            Aggiungi {results.filter(r => r.selected).length} prodotti
          </button>
        </div>
      )}
    </Modal>
  );
}
