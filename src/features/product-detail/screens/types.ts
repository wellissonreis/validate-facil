export type LotStatus = 'Atenção' | 'Crítico' | 'Ok';

export type ProductDetail = {
  barcode: string;
  brand: string;
  history: {
    date: string;
    lot: string;
    quantity: number;
  }[];
  lots: {
    expirationDate: string;
    quantity: number;
    status: LotStatus;
  }[];
  name: string;
  stock: number;
  unit: string;
};

export const product: ProductDetail = {
  barcode: '7896058201234',
  brand: 'Itambé',
  history: [
    { date: '10/05/2025', lot: '250510-01', quantity: 12 },
    { date: '05/05/2025', lot: '250505-01', quantity: 20 },
    { date: '01/06/2025', lot: '250501-01', quantity: 16 },
  ],
  lots: [
    { expirationDate: '25/05/2025', quantity: 12, status: 'Crítico' },
    { expirationDate: '05/06/2025', quantity: 20, status: 'Atenção' },
    { expirationDate: '20/06/2025', quantity: 16, status: 'Ok' },
  ],
  name: 'Leite UHT Integral 1L',
  stock: 48,
  unit: 'un',
};
