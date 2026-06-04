export type PeriodOption = 7 | 15 | 30;

export type PeriodFilterProps = {
  selectedPeriod: PeriodOption;
  onSelectPeriod: (period: PeriodOption) => void;
};
