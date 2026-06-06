import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTS_KEY = '@validade-facil/products';

export const LOW_STOCK_MINIMUM = 5;

export type Product = {
  id: string;
  codigoBarras?: string;
  nome: string;
  quantidade: number;
  validade: string;
  lote?: string;
  lotes?: ProductLot[];
  criadoEm: string;
  atualizadoEm: string;
};

export type ProductLot = {
  id: string;
  codigo: string;
  quantidade: number;
  validade: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type NewProduct = {
  codigoBarras: string;
  nome: string;
  quantidade: number;
  validade: string;
  lote?: string;
};

export type UpdateProduct = Pick<NewProduct, 'codigoBarras' | 'nome'> &
  Partial<Pick<NewProduct, 'quantidade' | 'validade' | 'lote'>>;

export type StockEntry = {
  quantidade: number;
  validade: string;
  lote?: string;
};

export type ExpiredProductItem = {
  id: string;
  productId: string;
  lotId?: string;
  name: string;
  lot?: string;
  quantity: number;
  validUntil: string;
};

export async function getProducts(): Promise<Product[]> {
  const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);

  if (!storedProducts) {
    return [];
  }

  try {
    const products = JSON.parse(storedProducts);
    return Array.isArray(products) ? products.map(normalizeProduct) : [];
  } catch {
    return [];
  }
}

export async function addProduct(product: NewProduct): Promise<Product> {
  const now = new Date().toISOString();
  const products = await getProducts();
  const trimmedLot = product.lote?.trim();
  const lotes = trimmedLot
    ? [
        {
          id: createId(),
          codigo: trimmedLot,
          quantidade: product.quantidade,
          validade: product.validade,
          criadoEm: now,
          atualizadoEm: now,
        },
      ]
    : [];
  const newProduct: Product = {
    ...product,
    codigoBarras: product.codigoBarras.trim(),
    lote: trimmedLot || undefined,
    lotes,
    id: createId(),
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

export async function getProductByBarcode(codigoBarras: string): Promise<Product | null> {
  const normalizedBarcode = codigoBarras.trim();
  const products = await getProducts();

  return products.find((product) => product.codigoBarras === normalizedBarcode) ?? null;
}

export async function updateProduct(id: string, product: UpdateProduct): Promise<Product | null> {
  const products = await getProducts();
  const productIndex = products.findIndex((storedProduct) => storedProduct.id === id);

  if (productIndex < 0) {
    return null;
  }

  const now = new Date().toISOString();
  const storedProduct = products[productIndex];
  const storedLots = getProductLots(storedProduct);
  const hasLots = storedLots.length > 0;
  const trimmedLot = product.lote?.trim();
  const nextQuantity = hasLots ? storedProduct.quantidade : (product.quantidade ?? storedProduct.quantidade);
  const nextValidity = product.validade ?? storedProduct.validade;
  const nextLot = hasLots
    ? storedProduct.lote
    : 'lote' in product
      ? trimmedLot || undefined
      : storedProduct.lote;
  const updatedProduct: Product = {
    ...storedProduct,
    ...product,
    codigoBarras: product.codigoBarras.trim(),
    quantidade: nextQuantity,
    validade: nextValidity,
    lote: nextLot,
    lotes: hasLots
      ? storedLots
      : nextLot
      ? [
          {
            id: createId(),
            codigo: nextLot,
            quantidade: nextQuantity,
            validade: nextValidity,
            criadoEm: now,
            atualizadoEm: now,
          },
        ]
      : [],
    atualizadoEm: now,
  };
  const nextProducts = [...products];

  nextProducts[productIndex] = updatedProduct;
  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));

  return updatedProduct;
}

export async function addStockEntry(productId: string, entry: StockEntry): Promise<Product | null> {
  const products = await getProducts();
  const productIndex = products.findIndex((storedProduct) => storedProduct.id === productId);

  if (productIndex < 0) {
    return null;
  }

  const now = new Date().toISOString();
  const product = products[productIndex];
  const lotCode = entry.lote?.trim();
  const nextLots = [...getProductLots(product)];
  let nextLot = product.lote;

  if (lotCode) {
    const lotIndex = nextLots.findIndex((lot) => lot.codigo === lotCode);

    if (lotIndex >= 0) {
      nextLots[lotIndex] = {
        ...nextLots[lotIndex],
        quantidade: nextLots[lotIndex].quantidade + entry.quantidade,
        validade: entry.validade,
        atualizadoEm: now,
      };
    } else {
      nextLots.push({
        id: createId(),
        codigo: lotCode,
        quantidade: entry.quantidade,
        validade: entry.validade,
        criadoEm: now,
        atualizadoEm: now,
      });
    }

    nextLot = lotCode;
  }

  const updatedProduct: Product = {
    ...product,
    quantidade: product.quantidade + entry.quantidade,
    validade: lotCode ? product.validade : entry.validade,
    lote: nextLot,
    lotes: nextLots,
    atualizadoEm: now,
  };
  const nextProducts = [...products];

  nextProducts[productIndex] = updatedProduct;
  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));

  return updatedProduct;
}

export async function removeProduct(id: string): Promise<void> {
  const products = await getProducts();

  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products.filter((product) => product.id !== id)));
}

export async function removeExpiredItem(productId: string, lotId?: string): Promise<void> {
  if (!lotId) {
    const products = await getProducts();
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex < 0) {
      return;
    }

    const product = products[productIndex];
    const lots = getProductLots(product);

    if (lots.length === 0) {
      await removeProduct(productId);
      return;
    }

    const directQuantity = getDirectProductQuantity(product, lots);
    const nextProducts = [...products];

    nextProducts[productIndex] = {
      ...product,
      quantidade: Math.max(product.quantidade - directQuantity, 0),
      atualizadoEm: new Date().toISOString(),
    };

    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));
    return;
  }

  const products = await getProducts();
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex < 0) {
    return;
  }

  const product = products[productIndex];
  const removedLot = getProductLots(product).find((lot) => lot.id === lotId);
  const nextLots = getProductLots(product).filter((lot) => lot.id !== lotId);
  const nextQuantity = Math.max(product.quantidade - (removedLot?.quantidade ?? 0), 0);
  const nextProducts = [...products];

  if (nextLots.length === 0 && nextQuantity <= 0) {
    nextProducts.splice(productIndex, 1);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));
    return;
  }

  nextProducts[productIndex] = {
    ...product,
    quantidade: nextQuantity,
    lote: nextLots.at(-1)?.codigo,
    lotes: nextLots,
    atualizadoEm: new Date().toISOString(),
  };

  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));
}

export async function updateExpiredItemDate(productId: string, validade: string, lotId?: string): Promise<void> {
  const products = await getProducts();
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex < 0) {
    return;
  }

  const now = new Date().toISOString();
  const product = products[productIndex];
  const nextProducts = [...products];

  if (lotId) {
    nextProducts[productIndex] = {
      ...product,
      lotes: getProductLots(product).map((lot) =>
        lot.id === lotId ? { ...lot, validade, atualizadoEm: now } : lot,
      ),
      atualizadoEm: now,
    };
  } else {
    nextProducts[productIndex] = {
      ...product,
      validade,
      atualizadoEm: now,
    };
  }

  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));
}

export function getExpiredProductItems(products: Product[]): ExpiredProductItem[] {
  return products.flatMap((product) =>
    getProductExpirationItems(product).filter((item) => isDateExpired(item.validUntil)),
  );
}

export function getExpiringInDaysProductItems(products: Product[], days: number): ExpiredProductItem[] {
  const today = getToday();
  const limitDate = getToday();

  limitDate.setDate(limitDate.getDate() + days);

  return products.flatMap((product) =>
    getProductExpirationItems(product).filter((item) => {
      const expirationDate = getDateWithoutTime(item.validUntil);

      return expirationDate !== null && expirationDate >= today && expirationDate <= limitDate;
    }),
  );
}

export function getProductExpirationItems(product: Product): ExpiredProductItem[] {
  const lots = getProductLots(product);
  const directQuantity = getDirectProductQuantity(product, lots);

  if (lots.length > 0) {
    const lotItems = lots.map((lot) => ({
      id: `${product.id}:${lot.id}`,
      productId: product.id,
      lotId: lot.id,
      name: product.nome,
      lot: lot.codigo,
      quantity: lot.quantidade,
      validUntil: lot.validade,
    }));

    if (directQuantity <= 0) {
      return lotItems;
    }

    return [
      ...lotItems,
      {
        id: product.id,
        productId: product.id,
        name: product.nome,
        quantity: directQuantity,
        validUntil: product.validade,
      },
    ];
  }

  return [
    {
      id: product.id,
      productId: product.id,
      name: product.nome,
      lot: product.lote,
      quantity: product.quantidade,
      validUntil: product.validade,
    },
  ];
}

export function getProductLots(product: Product): ProductLot[] {
  if (product.lotes && product.lotes.length > 0) {
    return product.lotes;
  }

  if (!product.lote) {
    return [];
  }

  return [
    {
      id: `${product.id}-legacy-lot`,
      codigo: product.lote,
      quantidade: product.quantidade,
      validade: product.validade,
      criadoEm: product.criadoEm,
      atualizadoEm: product.atualizadoEm,
    },
  ];
}

export function getProductDisplayDate(product: Product): string {
  const dates = getProductExpirationItems(product).map((item) => item.validUntil).sort();

  return dates[0] ?? product.validade;
}

function getDirectProductQuantity(product: Product, lots: ProductLot[]): number {
  const lotQuantity = lots.reduce((total, lot) => total + lot.quantidade, 0);

  return Math.max(product.quantidade - lotQuantity, 0);
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

export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function formatProductDate(value: string): string {
  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export function isExpiredProduct(product: Product): boolean {
  return getProductExpirationItems(product).some((item) => isDateExpired(item.validUntil));
}

export function isProductExpiringWithinDays(product: Product, days: number): boolean {
  return getExpiringInDaysProductItems([product], days).length > 0;
}

export function isLowStockProduct(product: Product): boolean {
  return product.quantidade <= LOW_STOCK_MINIMUM;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeProduct(product: Product): Product {
  const lotes = product.lotes?.length ? product.lotes : getProductLots(product);

  return {
    ...product,
    codigoBarras: product.codigoBarras ?? '',
    lotes,
  };
}

function isDateExpired(value: string | null | undefined): boolean {
  const expirationDate = getDateWithoutTime(value);

  return expirationDate !== null && expirationDate < getToday();
}

function getDateWithoutTime(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!isoDate) {
    return null;
  }

  const [, year, month, day] = isoDate;
  const expirationDate = new Date(Number(year), Number(month) - 1, Number(day));
  const isValidDate =
    expirationDate.getFullYear() === Number(year) &&
    expirationDate.getMonth() === Number(month) - 1 &&
    expirationDate.getDate() === Number(day);

  if (!isValidDate) {
    return null;
  }

  expirationDate.setHours(0, 0, 0, 0);

  return expirationDate;
}

function getToday(): Date {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}
