import AsyncStorage from '@react-native-async-storage/async-storage';

const LEGACY_PRODUCTS_KEY = '@validade-facil/products';
const INVENTORY_KEY = '@validade-facil/inventory-v2';
const INVENTORY_SCHEMA_VERSION = 2;

export const LOW_STOCK_MINIMUM = 5;
export const NON_PERISHABLE_VALIDITY = 'non-perishable';

export type MovementType = 'entrada' | 'saida' | 'ajuste' | 'remocao_vencimento' | 'correcao_manual';

export type Product = {
  id: string;
  codigoBarras?: string;
  nome: string;
  quantidade: number;
  validade: string;
  lote?: string;
  lotes?: ProductLot[];
  imageUri?: string;
  criadoEm: string;
  atualizadoEm: string;
  arquivadoEm?: string;
};

export type ProductLot = {
  id: string;
  codigo: string;
  quantidade: number;
  validade: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type StockMovement = {
  id: string;
  createdAt: string;
  productId: string;
  productName: string;
  lotId?: string;
  lotCode?: string;
  lotValidity?: string;
  quantity: number;
  quantityDelta: number;
  type: MovementType;
  reason: string;
  balanceAfterProduct: number;
  balanceAfterLot?: number;
};

export type StockPositionLot = {
  lotId: string;
  lotCode: string;
  productId: string;
  productName: string;
  quantity: number;
  validUntil: string;
  status: StockAvailabilityStatus;
};

export type StockPosition = {
  productId: string;
  productName: string;
  barcode?: string;
  imageUri?: string;
  quantity: number;
  validUntil: string;
  status: StockAvailabilityStatus;
  lots: StockPositionLot[];
};

export type StockComparison = {
  currentBalance: number;
  entries: number;
  exits: number;
  finalBalance: number;
  divergence: number;
  movements: StockMovement[];
};

export type ProductSummary = {
  expiringIn15Days: number;
  expiringIn7Days: number;
  expired: number;
  lowStock: number;
  totalProducts: number;
  totalUnits: number;
};

export type StockComparisonFilters = {
  productId?: string;
  lotId?: string;
  startDate?: string;
  endDate?: string;
};

export type NewProduct = {
  codigoBarras: string;
  nome: string;
  quantidade: number;
  validade: string;
  lote?: string;
  imageUri?: string;
};

export type UpdateProduct = Pick<NewProduct, 'codigoBarras' | 'nome'> &
  Partial<Pick<NewProduct, 'quantidade' | 'validade' | 'lote' | 'imageUri'>>;

export type InitialStock = {
  quantidade: number;
  validade: string;
  lote?: string;
};

export type StockOutput = {
  quantidade: number;
  lotId?: string;
  motivo?: string;
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

export type StockAvailabilityStatus = 'vencido' | 'proximo' | 'disponivel' | 'sem_estoque';

type ProductRecord = {
  id: string;
  codigoBarras: string;
  nome: string;
  validade: string;
  lote?: string;
  imageUri?: string;
  criadoEm: string;
  atualizadoEm: string;
  arquivadoEm?: string;
};

type LotRecord = {
  id: string;
  productId: string;
  codigo: string;
  validade: string;
  criadoEm: string;
  atualizadoEm: string;
  arquivadoEm?: string;
};

type InventoryState = {
  schemaVersion: 2;
  productsById: Record<string, ProductRecord>;
  lotsById: Record<string, LotRecord>;
  movements: StockMovement[];
  updatedAt: string;
};

type StockProjection = {
  byProductId: Record<string, number>;
  byLotId: Record<string, number>;
};

export async function getProducts(): Promise<Product[]> {
  const state = await getInventoryState();

  return materializeProducts(state);
}

export async function getProductSummary(): Promise<ProductSummary> {
  const state = await getInventoryState();
  const projection = buildProjection(state);
  const activeProducts = Object.values(state.productsById).filter((product) => !product.arquivadoEm);
  const activeLots = Object.values(state.lotsById).filter((lot) => !lot.arquivadoEm);
  const lotQuantityByProductId = activeLots.reduce<Record<string, number>>((totals, lot) => {
    totals[lot.productId] = (totals[lot.productId] ?? 0) + (projection.byLotId[lot.id] ?? 0);
    return totals;
  }, {});
  const expirationItems = [
    ...activeLots
      .map((lot) => ({ quantity: projection.byLotId[lot.id] ?? 0, validUntil: lot.validade }))
      .filter((item) => item.quantity > 0),
    ...activeProducts
      .map((product) => ({
        quantity: Math.max((projection.byProductId[product.id] ?? 0) - (lotQuantityByProductId[product.id] ?? 0), 0),
        validUntil: product.validade,
      }))
      .filter((item) => item.quantity > 0),
  ];

  return {
    expiringIn15Days: expirationItems.filter((item) => isDateWithinDays(item.validUntil, 15)).length,
    expiringIn7Days: expirationItems.filter((item) => isDateWithinDays(item.validUntil, 7)).length,
    expired: expirationItems.filter((item) => isDateExpired(item.validUntil)).length,
    lowStock: activeProducts.filter((product) => (projection.byProductId[product.id] ?? 0) <= LOW_STOCK_MINIMUM).length,
    totalProducts: activeProducts.length,
    totalUnits: activeProducts.reduce((total, product) => total + (projection.byProductId[product.id] ?? 0), 0),
  };
}

export async function addProduct(product: NewProduct): Promise<Product> {
  const now = new Date().toISOString();
  const state = await getInventoryState();
  const trimmedLot = product.lote?.trim();
  const productId = createId();
  const lotId = trimmedLot ? createId() : undefined;

  state.productsById[productId] = {
    id: productId,
    codigoBarras: product.codigoBarras.trim(),
    nome: product.nome.trim(),
    validade: product.validade,
    lote: trimmedLot || undefined,
    imageUri: product.imageUri,
    criadoEm: now,
    atualizadoEm: now,
  };

  if (lotId && trimmedLot) {
    state.lotsById[lotId] = {
      id: lotId,
      productId,
      codigo: trimmedLot,
      validade: product.validade,
      criadoEm: now,
      atualizadoEm: now,
    };
  }

  appendMovement(state, {
    createdAt: now,
    lotId,
    productId,
    quantity: product.quantidade,
    reason: 'Estoque inicial do cadastro',
    type: 'entrada',
  });

  await saveInventoryState(state);

  return materializeProduct(state, productId) as Product;
}

export async function addStockEntry(productId: string, entry: InitialStock & { motivo?: string }): Promise<Product | null> {
  const state = await getInventoryState();
  const product = state.productsById[productId];

  if (!product || product.arquivadoEm) {
    return null;
  }

  const now = new Date().toISOString();
  const trimmedLot = entry.lote?.trim();
  const lot = trimmedLot ? ensureLotForProduct(state, productId, trimmedLot, entry.validade, now) : undefined;

  product.validade = entry.validade;
  product.lote = trimmedLot || product.lote;
  product.atualizadoEm = now;

  appendMovement(state, {
    createdAt: now,
    lotId: lot?.id,
    productId,
    quantity: entry.quantidade,
    reason: entry.motivo ?? 'Entrada rápida de estoque',
    type: 'entrada',
  });

  await saveInventoryState(state);

  return materializeProduct(state, productId);
}

export async function getProductById(id: string): Promise<Product | null> {
  const state = await getInventoryState();

  return materializeProduct(state, id);
}

export async function getProductByBarcode(codigoBarras: string): Promise<Product | null> {
  const normalizedBarcode = codigoBarras.trim();
  const products = await getProducts();

  return products.find((product) => product.codigoBarras === normalizedBarcode) ?? null;
}

export async function updateProduct(id: string, product: UpdateProduct): Promise<Product | null> {
  const state = await getInventoryState();
  const storedProduct = state.productsById[id];

  if (!storedProduct || storedProduct.arquivadoEm) {
    return null;
  }

  const now = new Date().toISOString();
  const projection = buildProjection(state);
  const currentQuantity = projection.byProductId[id] ?? 0;
  const activeLots = getActiveLotsForProduct(state, id);
  const hasLots = activeLots.length > 0;
  const trimmedLot = product.lote?.trim();

  storedProduct.codigoBarras = product.codigoBarras.trim();
  storedProduct.nome = product.nome.trim();
  storedProduct.imageUri = product.imageUri ?? storedProduct.imageUri;
  storedProduct.validade = product.validade ?? storedProduct.validade;
  storedProduct.atualizadoEm = now;

  if (!hasLots) {
    storedProduct.lote = 'lote' in product ? trimmedLot || undefined : storedProduct.lote;

    if (storedProduct.lote) {
      const lot = ensureLotForProduct(state, id, storedProduct.lote, storedProduct.validade, now);
      const lotQuantity = projection.byLotId[lot.id] ?? 0;

      if (currentQuantity > 0 && lotQuantity <= 0) {
        appendMovement(state, {
          createdAt: now,
          productId: id,
          quantity: currentQuantity,
          reason: 'Correção manual para retirar saldo sem lote',
          type: 'correcao_manual',
          quantityDelta: -currentQuantity,
        });
        appendMovement(state, {
          createdAt: now,
          lotId: lot.id,
          productId: id,
          quantity: currentQuantity,
          reason: 'Correção manual para vincular saldo ao lote',
          type: 'correcao_manual',
        });
      }
    }

    if (typeof product.quantidade === 'number' && Number.isFinite(product.quantidade)) {
      const delta = product.quantidade - currentQuantity;

      if (delta !== 0) {
        appendMovement(state, {
          createdAt: now,
          productId: id,
          quantity: Math.abs(delta),
          reason: 'Correção manual de saldo pelo cadastro do produto',
          type: 'correcao_manual',
          lotId: storedProduct.lote ? getActiveLotsForProduct(state, id)[0]?.id : undefined,
          quantityDelta: delta,
        });
      }
    }
  } else if (product.validade) {
    activeLots.forEach((lot) => {
      if (lot.codigo === storedProduct.lote || activeLots.length === 1) {
        lot.validade = product.validade as string;
        lot.atualizadoEm = now;
      }
    });
  }

  await saveInventoryState(state);

  return materializeProduct(state, id);
}

export async function updateProductImage(productId: string, imageUri?: string): Promise<Product | null> {
  const state = await getInventoryState();
  const product = state.productsById[productId];

  if (!product || product.arquivadoEm) {
    return null;
  }

  product.imageUri = imageUri;
  product.atualizadoEm = new Date().toISOString();
  await saveInventoryState(state);

  return materializeProduct(state, productId);
}

export async function removeStockOutput(productId: string, output: StockOutput): Promise<Product | null> {
  const state = await getInventoryState();
  const product = state.productsById[productId];

  if (!product || product.arquivadoEm) {
    return null;
  }

  const projection = buildProjection(state);
  const available = projection.byProductId[productId] ?? 0;

  if (output.quantidade > available) {
    throw new Error('INSUFFICIENT_STOCK');
  }

  const now = new Date().toISOString();
  const reason = output.motivo ?? 'Saída rápida de estoque';

  if (output.lotId) {
    const lotBalance = projection.byLotId[output.lotId] ?? 0;

    if (output.quantidade > lotBalance) {
      throw new Error('INSUFFICIENT_LOT_STOCK');
    }

    appendMovement(state, {
      createdAt: now,
      lotId: output.lotId,
      productId,
      quantity: output.quantidade,
      reason,
      type: 'saida',
    });
  } else {
    const lots = getActiveLotsForProduct(state, productId)
      .map((lot) => ({ ...lot, quantity: projection.byLotId[lot.id] ?? 0 }))
      .filter((lot) => lot.quantity > 0)
      .sort((firstLot, secondLot) => firstLot.validade.localeCompare(secondLot.validade));

    if (lots.length === 0) {
      appendMovement(state, {
        createdAt: now,
        productId,
        quantity: output.quantidade,
        reason,
        type: 'saida',
      });
    } else {
      let remainingOutput = output.quantidade;

      for (const lot of lots) {
        if (remainingOutput <= 0) {
          break;
        }

        const removedQuantity = Math.min(lot.quantity, remainingOutput);
        remainingOutput -= removedQuantity;
        appendMovement(state, {
          createdAt: now,
          lotId: lot.id,
          productId,
          quantity: removedQuantity,
          reason,
          type: 'saida',
        });
      }

      if (remainingOutput > 0) {
        appendMovement(state, {
          createdAt: now,
          productId,
          quantity: remainingOutput,
          reason,
          type: 'saida',
        });
      }
    }
  }

  product.atualizadoEm = now;
  await saveInventoryState(state);

  return materializeProduct(state, productId);
}

export async function removeProduct(id: string): Promise<void> {
  const state = await getInventoryState();
  const product = state.productsById[id];

  if (!product || product.arquivadoEm) {
    return;
  }

  const now = new Date().toISOString();

  product.arquivadoEm = now;
  product.atualizadoEm = now;
  getActiveLotsForProduct(state, id).forEach((lot) => {
    lot.arquivadoEm = now;
    lot.atualizadoEm = now;
  });

  await saveInventoryState(state);
}

export async function removeExpiredItem(productId: string, lotId?: string): Promise<void> {
  const state = await getInventoryState();
  const product = state.productsById[productId];

  if (!product || product.arquivadoEm) {
    return;
  }

  const now = new Date().toISOString();
  const projection = buildProjection(state);

  if (lotId) {
    const quantity = projection.byLotId[lotId] ?? 0;

    if (quantity > 0) {
      appendMovement(state, {
        createdAt: now,
        lotId,
        productId,
        quantity,
        reason: 'Remoção de lote vencido',
        type: 'remocao_vencimento',
      });
    }

    const lot = state.lotsById[lotId];

    if (lot) {
      lot.arquivadoEm = now;
      lot.atualizadoEm = now;
    }
  } else {
    const directQuantity = getDirectProductQuantityFromProjection(state, productId, projection);

    if (directQuantity > 0) {
      appendMovement(state, {
        createdAt: now,
        productId,
        quantity: directQuantity,
        reason: 'Remoção de produto vencido sem lote',
        type: 'remocao_vencimento',
      });
    }
  }

  product.atualizadoEm = now;
  await saveInventoryState(state);
}

export async function updateExpiredItemDate(productId: string, validade: string, lotId?: string): Promise<void> {
  const state = await getInventoryState();
  const product = state.productsById[productId];

  if (!product || product.arquivadoEm) {
    return;
  }

  const now = new Date().toISOString();

  if (lotId) {
    const lot = state.lotsById[lotId];

    if (lot && !lot.arquivadoEm) {
      lot.validade = validade;
      lot.atualizadoEm = now;
    }
  } else {
    product.validade = validade;
  }

  product.atualizadoEm = now;
  await saveInventoryState(state);
}

export async function getStockMovements(productId?: string): Promise<StockMovement[]> {
  const state = await getInventoryState();
  const movements = productId
    ? state.movements.filter((movement) => movement.productId === productId)
    : state.movements;

  return [...movements].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export async function getStockPositions(): Promise<StockPosition[]> {
  const state = await getInventoryState();
  const products = materializeProducts(state);

  return products.map((product) => {
    const lots = getProductLots(product).map((lot) => ({
      lotId: lot.id,
      lotCode: lot.codigo,
      productId: product.id,
      productName: product.nome,
      quantity: lot.quantidade,
      validUntil: lot.validade,
      status: getStockStatus(lot.quantidade, lot.validade),
    }));

    return {
      productId: product.id,
      productName: product.nome,
      barcode: product.codigoBarras,
      imageUri: product.imageUri,
      quantity: product.quantidade,
      validUntil: getProductDisplayDate(product),
      status: getStockStatus(product.quantidade, getProductDisplayDate(product)),
      lots,
    };
  });
}

export async function getStockComparison(filters: StockComparisonFilters = {}): Promise<StockComparison> {
  const state = await getInventoryState();
  const projection = buildProjection(state);
  const allMovements = [...state.movements].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  const movements = allMovements.filter((movement) => {
    if (filters.productId && movement.productId !== filters.productId) {
      return false;
    }

    if (filters.lotId && movement.lotId !== filters.lotId) {
      return false;
    }

    if (filters.startDate && movement.createdAt.slice(0, 10) < filters.startDate) {
      return false;
    }

    if (filters.endDate && movement.createdAt.slice(0, 10) > filters.endDate) {
      return false;
    }

    return true;
  });
  const entries = movements
    .filter((movement) => movement.quantityDelta > 0)
    .reduce((total, movement) => total + movement.quantityDelta, 0);
  const exits = movements
    .filter((movement) => movement.quantityDelta < 0)
    .reduce((total, movement) => total + Math.abs(movement.quantityDelta), 0);
  const finalBalance = entries - exits;
  const currentBalance = getCurrentBalanceForComparison(filters, projection);

  return {
    currentBalance,
    entries,
    exits,
    finalBalance,
    divergence: currentBalance - finalBalance,
    movements,
  };
}

export function getExpiredProductItems(products: Product[]): ExpiredProductItem[] {
  return products.flatMap((product) =>
    getProductExpirationItems(product).filter((item) => isDateExpired(item.validUntil) && item.quantity > 0),
  );
}

export function getExpiringInDaysProductItems(products: Product[], days: number): ExpiredProductItem[] {
  const today = getToday();
  const limitDate = getToday();

  limitDate.setDate(limitDate.getDate() + days);

  return products.flatMap((product) =>
    getProductExpirationItems(product).filter((item) => {
      const expirationDate = getDateWithoutTime(item.validUntil);

      return item.quantity > 0 && expirationDate !== null && expirationDate >= today && expirationDate <= limitDate;
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
  return product.lotes ?? [];
}

export function getProductDisplayDate(product: Product): string {
  const dates = getProductExpirationItems(product)
    .filter((item) => item.quantity > 0)
    .map((item) => item.validUntil)
    .sort();

  return dates[0] ?? product.validade;
}

export function isNonPerishableValidity(value: string): boolean {
  return value === NON_PERISHABLE_VALIDITY;
}

export function getStockStatus(quantity: number, validity: string): StockAvailabilityStatus {
  if (quantity <= 0) {
    return 'sem_estoque';
  }

  if (isDateExpired(validity)) {
    return 'vencido';
  }

  const expirationDate = getDateWithoutTime(validity);

  if (!expirationDate) {
    return 'disponivel';
  }

  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - getToday().getTime()) / 86400000);

  return daysUntilExpiration <= 7 ? 'proximo' : 'disponivel';
}

export function formatStockStatus(status: StockAvailabilityStatus): string {
  const labels: Record<StockAvailabilityStatus, string> = {
    disponivel: 'Disponível',
    proximo: 'Próximo',
    sem_estoque: 'Sem estoque',
    vencido: 'Vencido',
  };

  return labels[status];
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
  if (isNonPerishableValidity(value)) {
    return 'Não perecível';
  }

  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export function isExpiredProduct(product: Product): boolean {
  return getProductExpirationItems(product).some((item) => item.quantity > 0 && isDateExpired(item.validUntil));
}

export function isProductExpiringWithinDays(product: Product, days: number): boolean {
  return getExpiringInDaysProductItems([product], days).length > 0;
}

export function isLowStockProduct(product: Product): boolean {
  return product.quantidade <= LOW_STOCK_MINIMUM;
}

async function getInventoryState(): Promise<InventoryState> {
  const storedInventory = await AsyncStorage.getItem(INVENTORY_KEY);

  if (storedInventory) {
    try {
      const parsedInventory = JSON.parse(storedInventory);

      if (isInventoryState(parsedInventory)) {
        return parsedInventory;
      }
    } catch {
      return createEmptyInventoryState();
    }
  }

  const migratedState = await migrateLegacyProducts();

  await saveInventoryState(migratedState);

  return migratedState;
}

async function saveInventoryState(state: InventoryState): Promise<void> {
  state.updatedAt = new Date().toISOString();

  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(state));
}

async function migrateLegacyProducts(): Promise<InventoryState> {
  const state = createEmptyInventoryState();
  const storedProducts = await AsyncStorage.getItem(LEGACY_PRODUCTS_KEY);

  if (!storedProducts) {
    return state;
  }

  try {
    const legacyProducts = JSON.parse(storedProducts);

    if (!Array.isArray(legacyProducts)) {
      return state;
    }

    legacyProducts.forEach((legacyProduct) => migrateLegacyProduct(state, legacyProduct as Product));
  } catch {
    return state;
  }

  return state;
}

function migrateLegacyProduct(state: InventoryState, legacyProduct: Product): void {
  const now = legacyProduct.criadoEm ?? new Date().toISOString();
  const productId = legacyProduct.id ?? createId();
  const normalizedLots = normalizeLegacyLots(legacyProduct);

  state.productsById[productId] = {
    id: productId,
    codigoBarras: legacyProduct.codigoBarras ?? '',
    nome: legacyProduct.nome,
    validade: legacyProduct.validade,
    lote: legacyProduct.lote,
    imageUri: legacyProduct.imageUri,
    criadoEm: now,
    atualizadoEm: legacyProduct.atualizadoEm ?? now,
  };

  if (normalizedLots.length === 0) {
    appendMovement(state, {
      createdAt: now,
      productId,
      quantity: Number(legacyProduct.quantidade) || 0,
      reason: 'Migração do estoque salvo no produto',
      type: 'entrada',
    });
    return;
  }

  normalizedLots.forEach((lot) => {
    state.lotsById[lot.id] = {
      id: lot.id,
      productId,
      codigo: lot.codigo,
      validade: lot.validade,
      criadoEm: lot.criadoEm,
      atualizadoEm: lot.atualizadoEm,
    };
    appendMovement(state, {
      createdAt: lot.criadoEm,
      lotId: lot.id,
      productId,
      quantity: Number(lot.quantidade) || 0,
      reason: 'Migração do estoque salvo no lote',
      type: 'entrada',
    });
  });

  const lotQuantity = normalizedLots.reduce((total, lot) => total + lot.quantidade, 0);
  const directQuantity = Math.max((Number(legacyProduct.quantidade) || 0) - lotQuantity, 0);

  if (directQuantity > 0) {
    appendMovement(state, {
      createdAt: now,
      productId,
      quantity: directQuantity,
      reason: 'Migração do saldo sem lote',
      type: 'entrada',
    });
  }
}

function normalizeLegacyLots(product: Product): ProductLot[] {
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

function isInventoryState(value: unknown): value is InventoryState {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    (value as InventoryState).schemaVersion === INVENTORY_SCHEMA_VERSION &&
    typeof (value as InventoryState).productsById === 'object' &&
    typeof (value as InventoryState).lotsById === 'object' &&
    Array.isArray((value as InventoryState).movements)
  );
}

function createEmptyInventoryState(): InventoryState {
  return {
    schemaVersion: INVENTORY_SCHEMA_VERSION,
    productsById: {},
    lotsById: {},
    movements: [],
    updatedAt: new Date().toISOString(),
  };
}

function appendMovement(
  state: InventoryState,
  movement: Omit<
    StockMovement,
    'id' | 'productName' | 'lotCode' | 'lotValidity' | 'balanceAfterProduct' | 'balanceAfterLot' | 'quantityDelta'
  > & {
    quantityDelta?: number;
  },
): void {
  const product = state.productsById[movement.productId];
  const lot = movement.lotId ? state.lotsById[movement.lotId] : undefined;
  const projection = buildProjection(state);
  const computedDelta =
    movement.quantityDelta ??
    (movement.type === 'entrada' || movement.type === 'ajuste' ? movement.quantity : -movement.quantity);
  const balanceAfterProduct = (projection.byProductId[movement.productId] ?? 0) + computedDelta;
  const balanceAfterLot = movement.lotId ? (projection.byLotId[movement.lotId] ?? 0) + computedDelta : undefined;

  if (balanceAfterProduct < 0 || (typeof balanceAfterLot === 'number' && balanceAfterLot < 0)) {
    throw new Error('NEGATIVE_STOCK_NOT_ALLOWED');
  }

  state.movements.push({
    ...movement,
    id: createId(),
    productName: product?.nome ?? 'Produto removido',
    lotCode: lot?.codigo,
    lotValidity: lot?.validade,
    quantityDelta: computedDelta,
    balanceAfterProduct,
    balanceAfterLot,
  });
}

function buildProjection(state: InventoryState): StockProjection {
  return state.movements.reduce<StockProjection>(
    (projection, movement) => {
      projection.byProductId[movement.productId] = (projection.byProductId[movement.productId] ?? 0) + movement.quantityDelta;

      if (movement.lotId) {
        projection.byLotId[movement.lotId] = (projection.byLotId[movement.lotId] ?? 0) + movement.quantityDelta;
      }

      return projection;
    },
    { byLotId: {}, byProductId: {} },
  );
}

function getCurrentBalanceForComparison(filters: StockComparisonFilters, projection: StockProjection): number {
  if (filters.lotId) {
    return projection.byLotId[filters.lotId] ?? 0;
  }

  if (filters.productId) {
    return projection.byProductId[filters.productId] ?? 0;
  }

  return Object.values(projection.byProductId).reduce((total, quantity) => total + quantity, 0);
}

function materializeProducts(state: InventoryState): Product[] {
  return Object.values(state.productsById)
    .filter((product) => !product.arquivadoEm)
    .sort((first, second) => second.criadoEm.localeCompare(first.criadoEm))
    .map((product) => materializeProduct(state, product.id))
    .filter((product): product is Product => Boolean(product));
}

function materializeProduct(state: InventoryState, productId: string): Product | null {
  const product = state.productsById[productId];

  if (!product || product.arquivadoEm) {
    return null;
  }

  const projection = buildProjection(state);
  const lots = getActiveLotsForProduct(state, productId)
    .map((lot) => ({
      id: lot.id,
      codigo: lot.codigo,
      quantidade: projection.byLotId[lot.id] ?? 0,
      validade: lot.validade,
      criadoEm: lot.criadoEm,
      atualizadoEm: lot.atualizadoEm,
    }))
    .filter((lot) => lot.quantidade > 0);

  return {
    id: product.id,
    codigoBarras: product.codigoBarras,
    nome: product.nome,
    quantidade: projection.byProductId[productId] ?? 0,
    validade: product.validade,
    lote: lots.at(-1)?.codigo ?? product.lote,
    lotes: lots,
    imageUri: product.imageUri,
    criadoEm: product.criadoEm,
    atualizadoEm: product.atualizadoEm,
    arquivadoEm: product.arquivadoEm,
  };
}

function getActiveLotsForProduct(state: InventoryState, productId: string): LotRecord[] {
  return Object.values(state.lotsById).filter((lot) => lot.productId === productId && !lot.arquivadoEm);
}

function ensureLotForProduct(
  state: InventoryState,
  productId: string,
  codigo: string,
  validade: string,
  now: string,
): LotRecord {
  const existingLot = getActiveLotsForProduct(state, productId).find((lot) => lot.codigo === codigo);

  if (existingLot) {
    existingLot.validade = validade;
    existingLot.atualizadoEm = now;
    return existingLot;
  }

  const lot: LotRecord = {
    id: createId(),
    productId,
    codigo,
    validade,
    criadoEm: now,
    atualizadoEm: now,
  };

  state.lotsById[lot.id] = lot;

  return lot;
}

function getDirectProductQuantity(product: Product, lots: ProductLot[]): number {
  const lotQuantity = lots.reduce((total, lot) => total + lot.quantidade, 0);

  return Math.max(product.quantidade - lotQuantity, 0);
}

function getDirectProductQuantityFromProjection(
  state: InventoryState,
  productId: string,
  projection: StockProjection,
): number {
  const lotQuantity = getActiveLotsForProduct(state, productId).reduce(
    (total, lot) => total + (projection.byLotId[lot.id] ?? 0),
    0,
  );

  return Math.max((projection.byProductId[productId] ?? 0) - lotQuantity, 0);
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isDateExpired(value: string | null | undefined): boolean {
  const expirationDate = getDateWithoutTime(value);

  return expirationDate !== null && expirationDate < getToday();
}

function isDateWithinDays(value: string | null | undefined, days: number): boolean {
  const expirationDate = getDateWithoutTime(value);

  if (!expirationDate) {
    return false;
  }

  const today = getToday();
  const limitDate = getToday();
  limitDate.setDate(limitDate.getDate() + days);

  return expirationDate >= today && expirationDate <= limitDate;
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
