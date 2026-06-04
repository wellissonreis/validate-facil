export type ExpiringProductStatus = 'Vencido' | 'Crítico' | 'Atenção' | 'Ok';

export type StatusBadgeProps = {
  status: ExpiringProductStatus;
};
