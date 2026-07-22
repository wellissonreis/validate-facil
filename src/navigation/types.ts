import type { NavigatorScreenParams } from '@react-navigation/native';

export type ExpirationFilter = 'expired' | '7days' | '15days';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  ProductsTab: NavigatorScreenParams<ProductsStackParamList> | undefined;
  ConsultationTab: NavigatorScreenParams<ConsultationStackParamList> | undefined;
  ReportsTab: NavigatorScreenParams<ReportsStackParamList> | undefined;
  MoreTab: NavigatorScreenParams<MoreStackParamList> | undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type ProductFlowReturnTarget = 'Consultation' | 'Home' | 'Products';

export type ProductsStackParamList = {
  Products: undefined;
  ProductDetail: { id: string };
  QuickEntry: { returnTo?: ProductFlowReturnTarget } | undefined;
  ExpiringProducts: { filter?: ExpirationFilter } | undefined;
  LowStock: undefined;
  MovementHistory: undefined;
  StockOutput: undefined;
  StockComparison: undefined;
  StockPosition: undefined;
};

export type ConsultationStackParamList = {
  ProductConsultation: undefined;
};

export type ReportsStackParamList = {
  Reports: undefined;
};

export type MoreStackParamList = {
  More: undefined;
};
