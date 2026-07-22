import { ApiError, apiRequest, resolveApiUrl } from '@/shared/api/client';

import type {
  InitialStock,
  NewProduct,
  ProductLot,
  Product,
  ProductSummary,
  StockComparison,
  StockComparisonFilters,
  StockMovement,
  StockOutput,
  StockPosition,
  UpdateProduct,
} from './localProducts';
import { NON_PERISHABLE_VALIDITY } from './localProducts';

const API_NON_PERISHABLE_VALIDITY = '9999-12-31';

type ImageUploadResponse = {
  imageUri: string;
  product: Product;
};

export async function getProducts(): Promise<Product[]> {
  return normalizeProducts(await apiRequest<Product[]>('/products', { method: 'GET' }));
}

export async function getProductSummary(): Promise<ProductSummary> {
  return apiRequest<ProductSummary>('/products/summary', { method: 'GET' });
}

export async function addProduct(product: NewProduct): Promise<Product> {
  return normalizeRequiredProduct(
    await apiRequest<Product>('/products', {
      body: serializeProductPayload(product),
      method: 'POST',
    }),
  );
}

export async function addStockEntry(productId: string, entry: InitialStock & { motivo?: string }): Promise<Product | null> {
  return nullableProduct(
    apiRequest<Product>(`/products/${productId}/stock-entries`, {
      body: serializeProductPayload(entry),
      method: 'POST',
    }),
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  return nullableProduct(apiRequest<Product>(`/products/${id}`, { method: 'GET' }));
}

export async function getProductByBarcode(codigoBarras: string): Promise<Product | null> {
  const products = await apiRequest<Product[]>('/products', {
    method: 'GET',
    query: { barcode: codigoBarras.trim() },
  });

  return normalizeProduct(products[0]) ?? null;
}

export async function updateProduct(id: string, product: UpdateProduct): Promise<Product | null> {
  return nullableProduct(
    apiRequest<Product>(`/products/${id}`, {
      body: serializeProductPayload(product),
      method: 'PATCH',
    }),
  );
}

export async function updateProductImage(productId: string, imageUri?: string): Promise<Product | null> {
  if (!imageUri) {
    return nullableProduct(
      apiRequest<Product>(`/products/${productId}`, {
        body: { imageUri: '' },
        method: 'PATCH',
      }),
    );
  }

  if (/^file:|^content:|^data:/i.test(imageUri)) {
    const formData = new FormData();
    formData.append('image', {
      name: `${productId}.jpg`,
      type: 'image/jpeg',
      uri: imageUri,
    } as unknown as Blob);

    return nullableProduct(
      apiRequest<ImageUploadResponse>(`/products/${productId}/image`, {
        body: formData,
        method: 'POST',
      }).then((response) => response.product),
    );
  }

  return nullableProduct(
    apiRequest<Product>(`/products/${productId}`, {
      body: { imageUri },
      method: 'PATCH',
    }),
  );
}

export async function removeStockOutput(productId: string, output: StockOutput): Promise<Product | null> {
  try {
    return await nullableProduct(
      apiRequest<Product>(`/products/${productId}/stock-outputs`, {
        body: output,
        method: 'POST',
      }),
    );
  } catch (error) {
    if (error instanceof ApiError && error.code === 'insufficient_stock') {
      throw new Error(output.lotId ? 'INSUFFICIENT_LOT_STOCK' : 'INSUFFICIENT_STOCK');
    }

    throw error;
  }
}

export async function removeProduct(id: string): Promise<void> {
  await apiRequest<void>(`/products/${id}`, { method: 'DELETE' });
}

export async function removeExpiredItem(productId: string, lotId?: string): Promise<void> {
  await apiRequest<void>(`/products/${productId}/discard-expired`, {
    body: { lotId },
    method: 'POST',
  });
}

export async function updateExpiredItemDate(productId: string, validade: string, lotId?: string): Promise<void> {
  if (lotId) {
    await apiRequest<void>(`/lots/${lotId}`, {
      body: { validade },
      method: 'PATCH',
    });
    return;
  }

  const product = await getProductById(productId);

  if (!product) {
    return;
  }

  await updateProduct(productId, {
    codigoBarras: product.codigoBarras ?? '',
    nome: product.nome,
    validade,
  });
}

export async function getStockMovements(productId?: string): Promise<StockMovement[]> {
  const movements = await apiRequest<StockMovement[]>('/stock/movements', {
    method: 'GET',
    query: { productId },
  });

  return movements.map((movement) => ({
    ...movement,
    lotValidity: normalizeValidity(movement.lotValidity),
  }));
}

export async function getStockPositions(): Promise<StockPosition[]> {
  const positions = await apiRequest<StockPosition[]>('/stock/positions', { method: 'GET' });

  return positions.map((position) => ({
    ...position,
    lots: position.lots.map((lot) => ({
      ...lot,
      validUntil: normalizeValidity(lot.validUntil),
    })),
    validUntil: normalizeValidity(position.validUntil),
  }));
}

export async function getStockComparison(filters: StockComparisonFilters = {}): Promise<StockComparison> {
  const comparison = await apiRequest<StockComparison>('/stock/comparison', {
    method: 'GET',
    query: filters,
  });

  return {
    ...comparison,
    movements: comparison.movements.map((movement) => ({
      ...movement,
      lotValidity: normalizeValidity(movement.lotValidity),
    })),
  };
}

async function nullableProduct(request: Promise<Product>): Promise<Product | null> {
  try {
    return normalizeProduct(await request);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

function normalizeProducts(products: Product[]): Product[] {
  return products.map((product) => normalizeRequiredProduct(product));
}

function normalizeRequiredProduct(product: Product): Product {
  return normalizeProduct(product) as Product;
}

function normalizeProduct(product: Product | undefined): Product | null {
  if (!product) {
    return null;
  }

  return {
    ...product,
    imageUri: product.imageUri ? resolveApiUrl(product.imageUri) : undefined,
    lotes: (product.lotes ?? []).map(normalizeLot),
    validade: normalizeValidity(product.validade),
  };
}

function normalizeLot(lot: ProductLot): ProductLot {
  return {
    ...lot,
    validade: normalizeValidity(lot.validade),
  };
}

function normalizeValidity(validity: string): string;
function normalizeValidity(validity: string | undefined): string | undefined;
function normalizeValidity(validity: string | undefined): string | undefined {
  return validity === API_NON_PERISHABLE_VALIDITY ? NON_PERISHABLE_VALIDITY : validity;
}

function serializeProductPayload<T extends { validade?: string }>(payload: T): T {
  return {
    ...payload,
    validade: payload.validade === NON_PERISHABLE_VALIDITY ? API_NON_PERISHABLE_VALIDITY : payload.validade,
  };
}
