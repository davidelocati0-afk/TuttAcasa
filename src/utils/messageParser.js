import { addDays, parse, format, isValid } from 'date-fns';
import { detectCategory } from './productCategoryMap';

const INTENT_PATTERNS = {
  add_pantry: /\b(comprat[oaie]|pres[oaie]|aggiunt[oaie]|mess[oaie]|acquistat[oaie]|ho preso|ho comprato|ho acquistato|ho messo|ho aggiunto)\b/i,
  remove_pantry: /\b(finit[oaie]|esaurit[oaie]|consumat[oaie]|terminat[oaie]|non c'è più|non abbiamo più|è finit[oaie]|sono finit[oaie]|finendo)\b/i,
  add_shopping: /\b(comprare|da comprare|servono?|manca(?:no)?|bisogno di|ci serve|ci servono|dobbiamo comprare|devo comprare|lista spesa|lista della spesa)\b/i,
  add_bill: /\b(bolletta|pagamento|rata|abbonamento|affitto|fattura|da pagare|scadenza pagamento|utenza|canone)\b/i,
};

const UNIT_MAP = {
  'pz': 'pz', 'pezzi': 'pz', 'pezzo': 'pz', 'pacco': 'pz', 'pacchi': 'pz',
  'confezione': 'pz', 'confezioni': 'pz', 'bottiglia': 'pz', 'bottiglie': 'pz',
  'scatola': 'pz', 'scatole': 'pz', 'barattolo': 'pz', 'barattoli': 'pz',
  'kg': 'kg', 'chilo': 'kg', 'chili': 'kg', 'chilogrammi': 'kg',
  'g': 'g', 'grammi': 'g', 'grammo': 'g',
  'etti': 'g', 'etto': 'g',
  'l': 'l', 'litro': 'l', 'litri': 'l',
  'ml': 'ml', 'millilitri': 'ml',
};

const MONTH_MAP = {
  'gennaio': 1, 'febbraio': 2, 'marzo': 3, 'aprile': 4, 'maggio': 5, 'giugno': 6,
  'luglio': 7, 'agosto': 8, 'settembre': 9, 'ottobre': 10, 'novembre': 11, 'dicembre': 12,
  'gen': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'mag': 5, 'giu': 6,
  'lug': 7, 'ago': 8, 'set': 9, 'ott': 10, 'nov': 11, 'dic': 12,
};

const STOPWORDS = /\b(di|del|dello|della|dei|degli|delle|il|lo|la|i|gli|le|un|uno|una|al|allo|alla|per|con|su|in|da|che|ho|ha|sono|abbiamo|anche|poi|e|o|ma)\b/gi;

function detectIntent(text) {
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(text)) return intent;
  }
  return null;
}

function extractQuantityUnit(text) {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml|pz|pezzi?|pezzo|litri?|litro|gramm[oi]|chil[oi]|etti?|confezioni?|bottigli[ae]|pacch[oi]|scatol[ae]|barattol[oi]|millilitri|chilogrammi)?/i);
  if (!match) return { quantity: 1, unit: 'pz', matched: '' };

  let qty = parseFloat(match[1].replace(',', '.'));
  let rawUnit = (match[2] || 'pz').toLowerCase();
  let unit = UNIT_MAP[rawUnit] || 'pz';

  // Handle etti → grams conversion
  if (rawUnit === 'etti' || rawUnit === 'etto') {
    qty = qty * 100;
    unit = 'g';
  }

  return { quantity: Math.round(qty) || 1, unit, matched: match[0] };
}

function extractExpiryDate(text) {
  const now = new Date();

  // "scade tra X giorni"
  const daysMatch = text.match(/scad\w*\s+tra\s+(\d+)\s*(giorn[oi]|settiman[ae]|mes[ei])/i);
  if (daysMatch) {
    const n = parseInt(daysMatch[1]);
    const unit = daysMatch[2].toLowerCase();
    let days = n;
    if (unit.startsWith('settiman')) days = n * 7;
    else if (unit.startsWith('mes')) days = n * 30;
    const date = addDays(now, days);
    return { date: format(date, 'yyyy-MM-dd'), matched: daysMatch[0] };
  }

  // "scade domani"
  if (/scad\w*\s+domani/i.test(text)) {
    const date = addDays(now, 1);
    return { date: format(date, 'yyyy-MM-dd'), matched: text.match(/scad\w*\s+domani/i)[0] };
  }

  // "scade il 15 aprile" or "scadenza 15 aprile 2025"
  const dateMatch = text.match(/scad\w*\s+(?:il\s+)?(\d{1,2})\s+(\w+)(?:\s+(\d{4}))?/i);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const monthName = dateMatch[2].toLowerCase();
    const month = MONTH_MAP[monthName];
    if (month) {
      let year = dateMatch[3] ? parseInt(dateMatch[3]) : now.getFullYear();
      const candidate = new Date(year, month - 1, day);
      if (candidate < now && !dateMatch[3]) year++;
      const date = new Date(year, month - 1, day);
      if (isValid(date)) return { date: format(date, 'yyyy-MM-dd'), matched: dateMatch[0] };
    }
  }

  // "scade 15/04" or "scade 15/04/2025"
  const slashMatch = text.match(/scad\w*\s+(?:il\s+)?(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i);
  if (slashMatch) {
    const day = parseInt(slashMatch[1]);
    const month = parseInt(slashMatch[2]);
    let year = slashMatch[3] ? parseInt(slashMatch[3]) : now.getFullYear();
    if (year < 100) year += 2000;
    const date = new Date(year, month - 1, day);
    if (isValid(date)) return { date: format(date, 'yyyy-MM-dd'), matched: slashMatch[0] };
  }

  return null;
}

function extractAmount(text) {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:€|euro)/i);
  if (!match) return null;
  return { amount: parseFloat(match[1].replace(',', '.')), matched: match[0] };
}

function cleanProductName(text, toRemove) {
  let cleaned = text;
  for (const str of toRemove) {
    if (str) cleaned = cleaned.replace(str, '');
  }
  // Remove intent words
  for (const pattern of Object.values(INTENT_PATTERNS)) {
    cleaned = cleaned.replace(pattern, '');
  }
  // Remove stopwords
  cleaned = cleaned.replace(STOPWORDS, ' ');
  // Clean up
  cleaned = cleaned.replace(/[,;.!?]+/g, ' ').replace(/\s+/g, ' ').trim();
  // Capitalize first letter
  if (cleaned) cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return cleaned;
}

function splitMessage(text) {
  // Split on commas, " e ", newlines — but keep intent context
  return text
    .split(/[,\n]+|\s+e\s+/gi)
    .map(s => s.trim())
    .filter(s => s.length > 1);
}

export function parseMessage(text) {
  if (!text?.trim()) return [];

  const normalized = text.trim();
  const globalIntent = detectIntent(normalized);
  const segments = splitMessage(normalized);

  // If only one segment, process the whole message
  if (segments.length <= 1) {
    return [parseSingleSegment(normalized, globalIntent)].filter(a => a.product);
  }

  // Multiple segments: first segment often contains the intent
  return segments.map((seg, i) => {
    const localIntent = detectIntent(seg);
    const intent = localIntent || globalIntent || 'add_pantry';
    return parseSingleSegment(seg, intent);
  }).filter(a => a.product);
}

function parseSingleSegment(text, intent) {
  const finalIntent = intent || detectIntent(text) || 'add_pantry';
  const { quantity, unit, matched: qtyMatched } = extractQuantityUnit(text);
  const expiryResult = extractExpiryDate(text);
  const amountResult = finalIntent === 'add_bill' ? extractAmount(text) : null;

  const product = cleanProductName(text, [
    qtyMatched,
    expiryResult?.matched,
    amountResult?.matched,
  ]);

  const category = detectCategory(product);

  return {
    id: Math.random().toString(36).slice(2, 9),
    intent: finalIntent,
    product,
    quantity,
    unit,
    expiry_date: expiryResult?.date || null,
    category,
    amount: amountResult?.amount || null,
    original: text,
    confidence: product ? (intent ? 1.0 : 0.7) : 0.3,
  };
}
