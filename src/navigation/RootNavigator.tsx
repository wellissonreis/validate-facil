import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import LoginScreen from '@/features/auth/screens/LoginScreen';
import BottomTab from '@/features/home/components/BottomTab';
import HomeScreen from '@/features/home/screens/HomeScreen';
import ExpiringProductsScreen from '@/features/expiring-products/screens/ExpiringProductsScreen';
import MovementHistoryScreen from '@/features/inventory/screens/MovementHistoryScreen';
import StockComparisonScreen from '@/features/inventory/screens/StockComparisonScreen';
import StockPositionScreen from '@/features/inventory/screens/StockPositionScreen';
import LowStockScreen from '@/features/low-stock/screens/LowStockScreen';
import ProductConsultationScreen from '@/features/product-consultation/screens/ProductConsultationScreen';
import ProductDetailScreen from '@/features/product-detail/screens/ProductDetailScreen';
import ProductsScreen from '@/features/products/screens/ProductsScreen';
import QuickEntryScreen from '@/features/quick-entry/screens/QuickEntryScreen';
import StockOutputScreen from '@/features/stock-output/screens/StockOutputScreen';

import MoreRoute from '@/app/more';
import ReportsRoute from '@/app/reports';

import type {
  ConsultationStackParamList,
  HomeStackParamList,
  MoreStackParamList,
  ProductsStackParamList,
  ReportsStackParamList,
  RootStackParamList,
  RootTabParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootTabs = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();
const ConsultationStack = createNativeStackNavigator<ConsultationStackParamList>();
const ReportsStack = createNativeStackNavigator<ReportsStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

const stackScreenOptions = {
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: '#ffffff' },
  headerShown: false,
} as const;

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen component={HomeScreen} name="Home" />
    </HomeStack.Navigator>
  );
}

function ProductsStackNavigator() {
  return (
    <ProductsStack.Navigator screenOptions={stackScreenOptions}>
      <ProductsStack.Screen component={ProductsScreen} name="Products" />
      <ProductsStack.Screen component={ProductDetailScreen} name="ProductDetail" />
      <ProductsStack.Screen component={QuickEntryScreen} name="QuickEntry" />
      <ProductsStack.Screen component={ExpiringProductsScreen} name="ExpiringProducts" />
      <ProductsStack.Screen component={LowStockScreen} name="LowStock" />
      <ProductsStack.Screen component={MovementHistoryScreen} name="MovementHistory" />
      <ProductsStack.Screen component={StockOutputScreen} name="StockOutput" />
      <ProductsStack.Screen component={StockComparisonScreen} name="StockComparison" />
      <ProductsStack.Screen component={StockPositionScreen} name="StockPosition" />
    </ProductsStack.Navigator>
  );
}

function ConsultationStackNavigator() {
  return (
    <ConsultationStack.Navigator screenOptions={stackScreenOptions}>
      <ConsultationStack.Screen component={ProductConsultationScreen} name="ProductConsultation" />
    </ConsultationStack.Navigator>
  );
}

function ReportsStackNavigator() {
  return (
    <ReportsStack.Navigator screenOptions={stackScreenOptions}>
      <ReportsStack.Screen component={ReportsRoute} name="Reports" />
    </ReportsStack.Navigator>
  );
}

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator screenOptions={stackScreenOptions}>
      <MoreStack.Screen component={MoreRoute} name="More" />
    </MoreStack.Navigator>
  );
}

function RootTabsNavigator() {
  return (
    <RootTabs.Navigator
      initialRouteName="HomeTab"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTab {...props} />}
    >
      <RootTabs.Screen component={HomeStackNavigator} name="HomeTab" />
      <RootTabs.Screen component={ProductsStackNavigator} name="ProductsTab" />
      <RootTabs.Screen component={ConsultationStackNavigator} name="ConsultationTab" />
      <RootTabs.Screen component={ReportsStackNavigator} name="ReportsTab" />
      <RootTabs.Screen component={MoreStackNavigator} name="MoreTab" />
    </RootTabs.Navigator>
  );
}

export default function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      theme={{
        dark: colorScheme === 'dark',
        colors: {
          background: '#ffffff',
          border: '#eef2f4',
          card: '#ffffff',
          notification: '#05b163',
          primary: '#05b163',
          text: '#202124',
        },
        fonts: {
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          regular: { fontFamily: 'System', fontWeight: '400' },
        },
      }}
    >
      <RootStack.Navigator screenOptions={stackScreenOptions}>
        <RootStack.Screen component={LoginScreen} name="Login" />
        <RootStack.Screen component={RootTabsNavigator} name="MainTabs" />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
