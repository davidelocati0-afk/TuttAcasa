const categoryMap = {
  // Dispensa - staples, dry goods, canned
  'pasta': 'Dispensa', 'spaghetti': 'Dispensa', 'penne': 'Dispensa', 'fusilli': 'Dispensa',
  'rigatoni': 'Dispensa', 'lasagne': 'Dispensa', 'tagliatelle': 'Dispensa', 'gnocchi': 'Dispensa',
  'riso': 'Dispensa', 'farina': 'Dispensa', 'zucchero': 'Dispensa', 'sale': 'Dispensa',
  'olio': 'Dispensa', 'aceto': 'Dispensa', 'tonno': 'Dispensa', 'pelati': 'Dispensa',
  'passata': 'Dispensa', 'pomodoro': 'Dispensa', 'legumi': 'Dispensa', 'ceci': 'Dispensa',
  'lenticchie': 'Dispensa', 'fagioli': 'Dispensa', 'piselli': 'Dispensa',
  'biscotti': 'Dispensa', 'crackers': 'Dispensa', 'grissini': 'Dispensa', 'fette biscottate': 'Dispensa',
  'pane': 'Dispensa', 'pancarre': 'Dispensa', 'cereali': 'Dispensa', 'muesli': 'Dispensa',
  'miele': 'Dispensa', 'marmellata': 'Dispensa', 'nutella': 'Dispensa', 'confettura': 'Dispensa',
  'caffe': 'Dispensa', 'caffè': 'Dispensa', 'te': 'Dispensa', 'tè': 'Dispensa', 'tisana': 'Dispensa',
  'cioccolato': 'Dispensa', 'cioccolatini': 'Dispensa', 'cacao': 'Dispensa',
  'dado': 'Dispensa', 'brodo': 'Dispensa', 'sugo': 'Dispensa', 'pesto': 'Dispensa',
  'spezie': 'Dispensa', 'pepe': 'Dispensa', 'origano': 'Dispensa', 'rosmarino': 'Dispensa',
  'conserve': 'Dispensa', 'sottoli': 'Dispensa', 'olive': 'Dispensa', 'capperi': 'Dispensa',
  'maionese': 'Dispensa', 'ketchup': 'Dispensa', 'senape': 'Dispensa',
  'acqua': 'Dispensa', 'birra': 'Dispensa', 'vino': 'Dispensa', 'bibite': 'Dispensa',
  'coca cola': 'Dispensa', 'succo': 'Dispensa', 'aranciata': 'Dispensa',
  'pangrattato': 'Dispensa', 'lievito': 'Dispensa', 'amido': 'Dispensa',
  'corn flakes': 'Dispensa', 'merendine': 'Dispensa', 'snack': 'Dispensa',
  'chips': 'Dispensa', 'patatine': 'Dispensa', 'pop corn': 'Dispensa',

  // Freschi - refrigerated, fresh produce, dairy, meat
  'latte': 'Freschi', 'yogurt': 'Freschi', 'burro': 'Freschi', 'margarina': 'Freschi',
  'formaggio': 'Freschi', 'mozzarella': 'Freschi', 'parmigiano': 'Freschi', 'grana': 'Freschi',
  'pecorino': 'Freschi', 'ricotta': 'Freschi', 'mascarpone': 'Freschi', 'stracchino': 'Freschi',
  'gorgonzola': 'Freschi', 'scamorza': 'Freschi', 'provola': 'Freschi', 'fontina': 'Freschi',
  'prosciutto': 'Freschi', 'salame': 'Freschi', 'bresaola': 'Freschi', 'speck': 'Freschi',
  'mortadella': 'Freschi', 'wurstel': 'Freschi', 'pancetta': 'Freschi', 'guanciale': 'Freschi',
  'uova': 'Freschi', 'uovo': 'Freschi',
  'pollo': 'Freschi', 'carne': 'Freschi', 'manzo': 'Freschi', 'maiale': 'Freschi',
  'vitello': 'Freschi', 'agnello': 'Freschi', 'tacchino': 'Freschi', 'coniglio': 'Freschi',
  'salsiccia': 'Freschi', 'hamburger': 'Freschi', 'macinato': 'Freschi',
  'pesce': 'Freschi', 'salmone': 'Freschi', 'tonno fresco': 'Freschi', 'merluzzo': 'Freschi',
  'gamberi': 'Freschi', 'calamari': 'Freschi', 'cozze': 'Freschi', 'vongole': 'Freschi',
  'insalata': 'Freschi', 'lattuga': 'Freschi', 'rucola': 'Freschi', 'spinaci': 'Freschi',
  'pomodori': 'Freschi', 'pomodorini': 'Freschi', 'zucchine': 'Freschi', 'melanzane': 'Freschi',
  'carote': 'Freschi', 'patate': 'Freschi', 'cipolle': 'Freschi', 'aglio': 'Freschi',
  'peperoni': 'Freschi', 'funghi': 'Freschi', 'broccoli': 'Freschi', 'cavolfiore': 'Freschi',
  'cavolo': 'Freschi', 'finocchio': 'Freschi', 'sedano': 'Freschi', 'carciofi': 'Freschi',
  'frutta': 'Freschi', 'mele': 'Freschi', 'banane': 'Freschi', 'arance': 'Freschi',
  'pere': 'Freschi', 'fragole': 'Freschi', 'uva': 'Freschi', 'limoni': 'Freschi',
  'kiwi': 'Freschi', 'pesche': 'Freschi', 'albicocche': 'Freschi', 'ciliegie': 'Freschi',
  'melone': 'Freschi', 'anguria': 'Freschi', 'ananas': 'Freschi', 'avocado': 'Freschi',
  'panna': 'Freschi', 'basilico': 'Freschi', 'prezzemolo': 'Freschi',
  'tofu': 'Freschi', 'hummus': 'Freschi',

  // Surgelati - frozen
  'gelato': 'Surgelati', 'pizza surgelata': 'Surgelati', 'pizza congelata': 'Surgelati',
  'verdure surgelate': 'Surgelati', 'spinaci surgelati': 'Surgelati',
  'bastoncini': 'Surgelati', 'bastoncini pesce': 'Surgelati', 'fish sticks': 'Surgelati',
  'ghiaccio': 'Surgelati', 'cubetti ghiaccio': 'Surgelati',
  'surgelati': 'Surgelati', 'congelato': 'Surgelati', 'congelati': 'Surgelati',
  'patate fritte': 'Surgelati', 'crocchette': 'Surgelati',
  'minestrone surgelato': 'Surgelati', 'zuppe surgelate': 'Surgelati',

  // Consumabili - household supplies
  'detersivo': 'Consumabili', 'sapone': 'Consumabili', 'shampoo': 'Consumabili',
  'balsamo': 'Consumabili', 'bagnoschiuma': 'Consumabili', 'docciaschiuma': 'Consumabili',
  'carta igienica': 'Consumabili', 'scottex': 'Consumabili', 'rotoloni': 'Consumabili',
  'tovaglioli': 'Consumabili', 'fazzoletti': 'Consumabili',
  'spugna': 'Consumabili', 'spugne': 'Consumabili', 'stracci': 'Consumabili',
  'sacchetti': 'Consumabili', 'buste': 'Consumabili', 'sacchi': 'Consumabili',
  'pellicola': 'Consumabili', 'alluminio': 'Consumabili', 'carta forno': 'Consumabili',
  'ammorbidente': 'Consumabili', 'candeggina': 'Consumabili', 'sgrassatore': 'Consumabili',
  'dentifricio': 'Consumabili', 'spazzolino': 'Consumabili', 'collutorio': 'Consumabili',
  'pannolini': 'Consumabili', 'salviette': 'Consumabili', 'cotton fioc': 'Consumabili',
  'pile': 'Consumabili', 'batterie': 'Consumabili', 'lampadine': 'Consumabili',
  'crema': 'Consumabili', 'crema mani': 'Consumabili', 'crema solare': 'Consumabili',
  'deodorante': 'Consumabili', 'rasoio': 'Consumabili', 'schiuma barba': 'Consumabili',
  'cibo gatto': 'Consumabili', 'cibo cane': 'Consumabili', 'lettiera': 'Consumabili',
};

export function detectCategory(productName) {
  if (!productName) return null;
  const lower = productName.toLowerCase().trim();

  // Exact match
  if (categoryMap[lower]) return categoryMap[lower];

  // Substring match: check if any key is contained in the product name
  for (const [key, cat] of Object.entries(categoryMap)) {
    if (lower.includes(key) || key.includes(lower)) return cat;
  }

  return null;
}

export function resolveCategoryId(categoryName, categories) {
  if (!categoryName || !categories?.length) return categories?.[0]?.id || null;
  const found = categories.find(c => c.name === categoryName);
  return found?.id || categories[0]?.id || null;
}
