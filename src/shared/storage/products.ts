import { isOnPremiseMode } from '@/shared/config/appMode';

import * as localProducts from './localProducts';
import * as onPremiseProducts from './onPremiseProducts';

export {
  formatDateInput,
  formatProductDate,
  formatStockStatus,
  getExpiredProductItems,
  getExpiringInDaysProductItems,
  getProductDisplayDate,
  getProductExpirationItems,
  getProductLots,
  getStockStatus,
  isExpiredProduct,
  isLowStockProduct,
  isNonPerishableValidity,
  isProductExpiringWithinDays,
  LOW_STOCK_MINIMUM,
  NON_PERISHABLE_VALIDITY,
  parseProductDate,
} from './localProducts';
export type {
  ExpiredProductItem,
  InitialStock,
  MovementType,
  NewProduct,
  Product,
  ProductLot,
  ProductSummary,
  StockAvailabilityStatus,
  StockComparison,
  StockComparisonFilters,
  StockMovement,
  StockOutput,
  StockPosition,
  StockPositionLot,
  UpdateProduct,
} from './localProducts';

const productsSource = isOnPremiseMode ? onPremiseProducts : localProducts;

export const getProducts = productsSource.getProducts;
export const getProductSummary = productsSource.getProductSummary;
export const addProduct = productsSource.addProduct;
export const addStockEntry = productsSource.addStockEntry;
export const getProductById = productsSource.getProductById;
export const getProductByBarcode = productsSource.getProductByBarcode;
export const updateProduct = productsSource.updateProduct;
export const updateProductImage = productsSource.updateProductImage;
export const removeStockOutput = productsSource.removeStockOutput;
export const removeProduct = productsSource.removeProduct;
export const removeExpiredItem = productsSource.removeExpiredItem;
export const updateExpiredItemDate = productsSource.updateExpiredItemDate;
export const getStockMovements = productsSource.getStockMovements;
export const getStockPositions = productsSource.getStockPositions;
export const getStockComparison = productsSource.getStockComparison;
