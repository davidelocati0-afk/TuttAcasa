import { useState, useCallback } from 'react';
import { RECEIPT_FILTER_WORDS } from '../utils/constants';

export function useOcr() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const processReceipt = useCallback(async (imageFile) => {
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResults([]);

    try {
      const Tesseract = (await import('tesseract.js')).default;
      const result = await Tesseract.recognize(imageFile, 'ita', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const lines = result.data.text
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 2);

      const filtered = lines.filter(line => {
        const upper = line.toUpperCase();
        if (RECEIPT_FILTER_WORDS.some(w => upper.includes(w))) return false;
        if (/^\d+[.,]\d{2}$/.test(line.trim())) return false;
        if (/^[\d\s.,€$]+$/.test(line.trim())) return false;
        return true;
      });

      const products = filtered.map(line => {
        let name = line
          .replace(/\s*\d+[.,]\d{2}\s*[€$]?\s*$/g, '')
          .replace(/^\d+\s*[xX*]\s*/g, '')
          .replace(/^\d{5,}\s*/g, '')
          .trim();
        if (name.length < 2) return null;
        return { name: name.substring(0, 100), selected: true };
      }).filter(Boolean);

      setResults(products);
      return products;
    } catch {
      setError('Errore durante la lettura dello scontrino');
      return [];
    } finally {
      setProcessing(false);
    }
  }, []);

  return { processing, progress, results, setResults, error, processReceipt };
}
