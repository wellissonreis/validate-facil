export type LowStockStatus = 'Atenção' | 'Baixo' | 'Crítico';

export type LowStockProduct = {
  id: string;
  minimum: number;
  name: string;
  quantity: number;
  status: LowStockStatus;
};

export const lowStockProducts: LowStockProduct[] = [
  { id: '1', minimum: 10, name: 'Iogurte Natural 170g', quantity: 6, status: 'Baixo' },
  { id: '2', minimum: 8, name: 'Queijo Mussarela Fatiado 150g', quantity: 4, status: 'Baixo' },
  { id: '3', minimum: 12, name: 'Presunto Cozido Fatiado 200g', quantity: 5, status: 'Crítico' },
  { id: '4', minimum: 14, name: 'Leite UHT Integral 1L', quantity: 8, status: 'Baixo' },
  { id: '5', minimum: 18, name: 'Pão de Forma Tradicional 500g', quantity: 10, status: 'Atenção' },
  { id: '6', minimum: 10, name: 'Manteiga com Sal 200g', quantity: 6, status: 'Baixo' },
];
