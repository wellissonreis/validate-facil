import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTS_KEY = '@validade-facil/products';

export type Product = {
  id: string;
  nome: string;
  quantidade: number;
  validade: string;
  lote?: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type NewProduct = {
  nome: string;
  quantidade: number;
  validade: string;
  lote?: string;
};

export type UpdateProduct = NewProduct;

export async function getProducts(): Promise<Product[]> {
  const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);

  if (!storedProducts) {
    return [];
  }

  try {
    const products = JSON.parse(storedProducts);
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

export async function addProduct(product: NewProduct): Promise<Product> {
  const now = new Date().toISOString();
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    criadoEm: now,
    atualizadoEm: now,
  };

  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify([newProduct, ...products]));

  return newProduct;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();

  return products.find((product) => product.id === id) ?? null;
}

export async function updateProduct(id: string, product: UpdateProduct): Promise<Product | null> {
  const products = await getProducts();
  const productIndex = products.findIndex((storedProduct) => storedProduct.id === id);

  if (productIndex < 0) {
    return null;
  }

  const updatedProduct: Product = {
    ...products[productIndex],
    ...product,
    atualizadoEm: new Date().toISOString(),
  };
  const nextProducts = [...products];

  nextProducts[productIndex] = updatedProduct;
  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));

  return updatedProduct;
}

export function parseProductDate(value: string): string | null {
  const trimmedValue = value.trim();
  const slashDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);

  const year = slashDate?.[3] ?? isoDate?.[1];
  const month = slashDate?.[2] ?? isoDate?.[2];
  const day = slashDate?.[1] ?? isoDate?.[3];

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const validDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return validDate ? `${year}-${month}-${day}` : null;
}

export function formatProductDate(value: string): string {
  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export function isExpiredProduct(product: Product): boolean {
  const expirationDate = getProductExpirationDate(product);
  const today = getToday();

  return expirationDate < today;
}

export function isProductExpiringWithinDays(product: Product, days: number): boolean {
  const expirationDate = getProductExpirationDate(product);
  const today = getToday();
  const limitDate = getToday();

  limitDate.setDate(limitDate.getDate() + days);

  return expirationDate >= today && expirationDate <= limitDate;
}

export function isLowStockProduct(product: Product): boolean {
  return product.quantidade <= 5;
}

function getProductExpirationDate(product: Product): Date {
  const [year, month, day] = product.validade.split('-').map(Number);

  const expirationDate = new Date(year, month - 1, day);
  expirationDate.setHours(0, 0, 0, 0);

  return expirationDate;
}

function getToday(): Date {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}
