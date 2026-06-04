import type { ExpiringProductStatus } from '../StatusBadge/types';

export type ExpiringProduct = {
  id: string;
  name: string;
  quantity: number;
  status: ExpiringProductStatus;
  validUntil: string;
};

export type ExpiringProductRowProps = {
  product: ExpiringProduct;
};
