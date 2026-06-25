import type { ExpiringProductStatus } from '../StatusBadge/types';

export type ExpiringProduct = {
  id: string;
  imageUri?: string;
  lotId?: string;
  name: string;
  productId?: string;
  quantity: number;
  status: ExpiringProductStatus;
  subtitle?: string;
  validUntil: string;
};

export type ExpiringProductRowProps = {
  onRemove?: (product: ExpiringProduct) => void;
  onUpdateDate?: (product: ExpiringProduct) => void;
  product: ExpiringProduct;
};
