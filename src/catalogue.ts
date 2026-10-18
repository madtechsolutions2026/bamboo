export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  pack: number;
  stock: number;
  type: string;
  badge?: string;
  description: string;
};

export const initialProducts: Product[] = [
  { id: 1, name: 'The Everyday Plate', category: 'Plates', price: 349, pack: 25, stock: 86, type: 'plate', badge: 'Bestseller', description: 'A round plate for everyday meals and celebrations. Natural bamboo-inspired finish. Sample size: 10 inches.' },
  { id: 2, name: 'The Little Bowl', category: 'Bowls', price: 279, pack: 25, stock: 64, type: 'bowl', description: 'A simple serving bowl for small bites, salads, and desserts. Sample capacity: 250 ml.' },
  { id: 3, name: 'The Gathering Cup', category: 'Cups', price: 299, pack: 25, stock: 12, type: 'cup', badge: 'For every gathering', description: 'A natural-looking cup for your next gathering. Sample capacity: 200 ml. Reference photography shows reusable bamboo cups; final disposable design and beverage suitability will follow the client catalogue.' },
  { id: 4, name: 'The Perfect Pair', category: 'Cutlery', price: 199, pack: 25, stock: 120, type: 'cutlery', description: 'A spoon and fork set for packed lunches, celebrations, and shared meals. Sample length: 16 cm.' },
  { id: 5, name: 'The Sharing Plate', category: 'Plates', price: 449, pack: 25, stock: 42, type: 'plate', description: 'A generous plate for serving and larger meals. Natural bamboo-inspired finish. Sample size: 12 inches.' },
  { id: 6, name: 'The Tasting Spoon', category: 'Cutlery', price: 149, pack: 50, stock: 96, type: 'spoon', badge: 'Small but essential', description: 'A small spoon for desserts and tastings. Sample length: 12 cm. A convenient pack of 50 pieces.' }
];

export const money = (value: number) => '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 2 });

export function productPhoto(product: Product): string {
  const photo = product.id === 5 ? 'sharing' : ['plate', 'bowl', 'cup', 'cutlery', 'spoon', 'sharing'].includes(product.type) ? product.type : 'plate';
  return `/photos/${photo}.webp`;
}

function stored(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(`bambu-${key}`) || 'null'); }
  catch { return null; }
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const positiveInteger = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const nonNegativeInteger = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const finiteAmount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1e10;
const string = (value: unknown, max = 2000): value is string => typeof value === 'string' && value.length <= max;

export function loadProducts(): Product[] {
  const value = stored('products');
  if (!Array.isArray(value)) return initialProducts;
  const seen = new Set<number>();
  const products = value.filter((p): p is Product => {
    if (!record(p) || !positiveInteger(p.id) || seen.has(p.id) || !string(p.name, 90) || !p.name.trim()
      || !string(p.category, 30) || !['Plates', 'Bowls', 'Cups', 'Cutlery'].includes(p.category)
      || !finiteAmount(p.price) || p.price < 1 || !positiveInteger(p.pack) || !nonNegativeInteger(p.stock)
      || !string(p.type, 30) || !['plate', 'bowl', 'cup', 'cutlery', 'spoon', 'sharing'].includes(p.type)
      || !string(p.description) || (p.badge !== undefined && !string(p.badge, 100))) return false;
    seen.add(p.id);
    return true;
  });
  return products.length ? products : initialProducts;
}

export function loadCart(products: Product[]): Record<number, number> {
  const value = stored('cart');
  if (!record(value)) return {};
  const cart: Record<number, number> = {};
  products.forEach(p => {
    const quantity = value[p.id];
    if (positiveInteger(quantity) && p.stock > 0) cart[p.id] = Math.min(p.stock, quantity);
  });
  return cart;
}

export type Order = { id: string; customer: string; email: string; address: string; total: number; status: string; date: string; items: { name: string; quantity: number }[] };
export type Expense = { id: number; name: string; category: string; amount: number; date: string };

export function loadOrders(): Order[] {
  const value = stored('orders');
  if (!Array.isArray(value)) return [];
  return value.filter((o): o is Order => record(o) && string(o.id, 100) && string(o.customer, 100) && string(o.email, 150)
    && string(o.address, 500) && finiteAmount(o.total) && string(o.date, 60) && Number.isFinite(Date.parse(o.date))
    && string(o.status, 30) && ['Processing', 'Packed', 'Shipped', 'Delivered'].includes(o.status)
    && Array.isArray(o.items) && o.items.length > 0 && o.items.every(i => record(i) && string(i.name, 100) && positiveInteger(i.quantity)));
}

export function loadExpenses(): Expense[] {
  const value = stored('expenses');
  if (!Array.isArray(value)) return [];
  return value.filter((e): e is Expense => record(e) && positiveInteger(e.id) && string(e.name, 100)
    && string(e.category, 100) && finiteAmount(e.amount) && string(e.date, 60) && Number.isFinite(Date.parse(e.date)));
}
