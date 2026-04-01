import { useState, useCallback } from 'react';
import Header from '../components/layout/Header';
import Fab from '../components/layout/Fab';
import SearchBar from '../components/products/SearchBar';
import CategoryFilter from '../components/products/CategoryFilter';
import ProductCard from '../components/products/ProductCard';
import ProductForm from '../components/products/ProductForm';
import BarcodeScanner from '../components/scanner/BarcodeScanner';
import ReceiptScanner from '../components/scanner/ReceiptScanner';
import EmptyState from '../components/ui/EmptyState';
import { useProducts } from '../hooks/useProducts';
import { useBarcode } from '../hooks/useBarcode';
import { useHousehold } from '../contexts/HouseholdContext';
import { daysUntil } from '../utils/dates';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

export default function Pantry() {
  const { products, loading, addProduct, updateProduct, deleteProduct, decrementQuantity, sendToShoppingList } = useProducts();
  const { categories } = useHousehold();
  const { lookupBarcode } = useBarcode();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [barcodeCallback, setBarcodeCallback] = useState(null);

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'all' && p.category_id !== catFilter) return false;
    return true;
  }).sort((a, b) => {
    const da = daysUntil(a.expiry_date);
    const db = daysUntil(b.expiry_date);
    if (da !== null && da <= 2 && (db === null || db > 2)) return -1;
    if (db !== null && db <= 2 && (da === null || da > 2)) return 1;
    return a.name.localeCompare(b.name, 'it');
  });

  async function handleSubmit(data) {
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, data);
        toast.success('Prodotto aggiornato');
      } else {
        await addProduct(data);
        toast.success('Prodotto aggiunto');
      }
    } catch (err) {
      toast.error(err.message || 'Errore');
    }
    setEditProduct(null);
  }

  async function handleDecrement(product) {
    try {
      await decrementQuantity(product);
      if (product.quantity <= 1) {
        toast.success(`${product.name} aggiunto alla lista spesa`);
      }
    } catch (err) {
      toast.error('Errore');
    }
  }

  async function handleSendToCart(product) {
    try {
      await sendToShoppingList(product);
      toast.success(`${product.name} aggiunto alla spesa`);
    } catch (err) {
      toast.error('Errore');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      toast.success('Prodotto eliminato');
    } catch (err) {
      toast.error('Errore');
    }
  }

  const handleScanBarcode = useCallback((cb) => {
    setBarcodeCallback(() => cb);
    setScannerOpen(true);
  }, []);

  async function handleBarcodeScan(barcode) {
    const info = await lookupBarcode(barcode);
    if (barcodeCallback) barcodeCallback(info);
    if (info) toast.success(`Trovato: ${info.name}`);
    else toast('Prodotto non trovato, inserisci manualmente');
    setBarcodeCallback(null);
  }

  async function handleReceiptConfirm(productNames) {
    let count = 0;
    for (const name of productNames) {
      try {
        await addProduct({ name, category_id: categories[0]?.id, quantity: 1, unit: 'pz' });
        count++;
      } catch { /* skip */ }
    }
    if (count > 0) toast.success(`${count} prodotti aggiunti`);
  }

  return (
    <div className="page-enter safe-bottom">
      <Header
        title="Dispensa"
        subtitle={`${products.length} prodotti`}
        right={
          <button onClick={() => setReceiptOpen(true)} style={{
            padding: '8px 12px', borderRadius: '10px',
            background: theme.primary[100], color: theme.primary[600],
            fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer',
          }}>
            {'📸'} Scontrino
          </button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Cerca prodotti..." />
      <CategoryFilter categories={categories} selected={catFilter} onSelect={setCatFilter} />

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' }}>
        {loading ? (
          <EmptyState icon="loading" title="Caricamento..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon="pantry" title="Dispensa vuota" subtitle="Aggiungi il tuo primo prodotto con il tasto +" />
        ) : (
          filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onDecrement={handleDecrement}
              onSendToCart={handleSendToCart}
              onEdit={p => { setEditProduct(p); setFormOpen(true); }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <Fab onClick={() => { setEditProduct(null); setFormOpen(true); }} />

      <ProductForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditProduct(null); }}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editProduct}
        onScanBarcode={handleScanBarcode}
      />

      <BarcodeScanner open={scannerOpen} onClose={() => setScannerOpen(false)} onScan={handleBarcodeScan} />
      <ReceiptScanner open={receiptOpen} onClose={() => setReceiptOpen(false)} onConfirm={handleReceiptConfirm} />
    </div>
  );
}
