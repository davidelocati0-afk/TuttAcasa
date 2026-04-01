export const DEFAULT_CATEGORIES = [
  { name: 'Dispensa', icon: '🏪', color: '#A855F7', sort_order: 0 },
  { name: 'Freschi', icon: '🥬', color: '#EC4899', sort_order: 1 },
  { name: 'Surgelati', icon: '❄️', color: '#8B5CF6', sort_order: 2 },
  { name: 'Consumabili', icon: '🧴', color: '#D946EF', sort_order: 3 },
];

export const UNITS = [
  { value: 'pz', label: 'pz' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'l', label: 'l' },
  { value: 'ml', label: 'ml' },
];

export const RECURRING_OPTIONS = [
  { value: 'none', label: 'Nessuna' },
  { value: 'monthly', label: 'Mensile' },
  { value: 'bimonthly', label: 'Bimestrale' },
  { value: 'quarterly', label: 'Trimestrale' },
  { value: 'yearly', label: 'Annuale' },
];

export const RECURRING_LABELS = {
  none: '',
  monthly: 'Mensile',
  bimonthly: 'Bimestrale',
  quarterly: 'Trimestrale',
  yearly: 'Annuale',
};

export const RECEIPT_FILTER_WORDS = [
  'TOTALE', 'SUBTOTALE', 'IVA', 'CONTANTE', 'CARTA', 'RESTO',
  'SCONTRINO', 'CASSA', 'DATA', 'ORA', 'GRAZIE', 'ARRIVEDERCI',
  'FISCALE', 'EURO', 'EUR', 'POS', 'BANCOMAT', 'CREDITO',
  'PAGAMENTO', 'CAMBIO', 'OPERATORE', 'TRANSAZIONE',
];
