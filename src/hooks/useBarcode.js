import { useState, useCallback } from 'react';

export function useBarcode() {
  const [scanning, setScanning] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookupBarcode = useCallback(async (barcode) => {
    setLoading(true);
    setError(null);
    setProductInfo(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const info = {
          name: p.product_name_it || p.product_name || '',
          image_url: p.image_url || p.image_front_url || '',
          brand: p.brands || '',
          barcode,
        };
        setProductInfo(info);
        return info;
      } else {
        setError('Prodotto non trovato nel database');
        return null;
      }
    } catch {
      setError('Impossibile cercare il prodotto. Inserisci manualmente.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { scanning, setScanning, productInfo, setProductInfo, error, loading, lookupBarcode };
}
