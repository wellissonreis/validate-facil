import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootTabParamList } from '@/navigation/types';
import { getProductSummary } from '@/shared/storage/products';

import HomeHeader from '../components/HomeHeader';
import QuickShortcutCard from '../components/QuickShortcutCard';
import SummaryCard from '../components/SummaryCard';
import styles from './style';

const initialSummary = {
  expiringIn15Days: 0,
  expiringIn7Days: 0,
  expired: 0,
  lowStock: 0,
  total: 0,
};

const summaryCards = [
  {
    color: '#05b163',
    route: { screen: 'Products' },
    icon: 'cube-outline',
    key: 'total',
    title: 'Produtos cadastrados',
  },
  {
    color: '#e53935',
    route: { params: { filter: 'expired' }, screen: 'ExpiringProducts' },
    icon: 'alert-circle-outline',
    key: 'expired',
    title: 'Produtos vencidos',
  },
  {
    color: '#f57c00',
    route: { params: { filter: '7days' }, screen: 'ExpiringProducts' },
    icon: 'time-outline',
    key: 'expiringIn7Days',
    title: 'Vencem em 7 dias',
  },
  {
    color: '#f4b400',
    route: { params: { filter: '15days' }, screen: 'ExpiringProducts' },
    icon: 'calendar-outline',
    key: 'expiringIn15Days',
    title: 'Vencem em 15 dias',
  },
  {
    color: '#1e88e5',
    route: { screen: 'LowStock' },
    icon: 'trending-down-outline',
    key: 'lowStock',
    title: 'Estoque baixo',
  },
] as const;

const shortcuts = [
  { icon: 'remove-circle-outline', label: 'Saída Rápida' },
  { icon: 'barcode-outline', label: 'Consultar Produto' },
  { icon: 'add-outline', label: 'Cadastrar Produto' },
  { icon: 'layers-outline', label: 'Posição do Estoque' },
  { icon: 'time-outline', label: 'Histórico' },
  { icon: 'git-compare-outline', label: 'Entrada x Saída' },
  { icon: 'hourglass-outline', label: 'Produtos Vencendo' },
  { icon: 'layers-outline', label: 'Estoque Baixo' },
] as const;

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [summary, setSummary] = useState(initialSummary);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSummary() {
        const productSummary = await getProductSummary();

        if (isActive) {
          setSummary({
            expiringIn15Days: productSummary.expiringIn15Days,
            expiringIn7Days: productSummary.expiringIn7Days,
            expired: productSummary.expired,
            lowStock: productSummary.lowStock,
            total: productSummary.totalProducts,
          });
        }
      }

      loadSummary();

      return () => {
        isActive = false;
      };
    }, []),
  );

  function openQuickEntry() {
    navigation.navigate('ProductsTab', { params: { returnTo: 'Home' }, screen: 'QuickEntry' });
  }

  function openStockOutput() {
    navigation.navigate('ProductsTab', { screen: 'StockOutput' });
  }

  function openProductConsultation() {
    navigation.navigate('ConsultationTab', { screen: 'ProductConsultation' });
  }

  function openExpiringProducts() {
    navigation.navigate('ProductsTab', { params: { filter: '7days' }, screen: 'ExpiringProducts' });
  }

  function openLowStock() {
    navigation.navigate('ProductsTab', { screen: 'LowStock' });
  }

  function openStockPosition() {
    navigation.navigate('ProductsTab', { screen: 'StockPosition' });
  }

  function openMovementHistory() {
    navigation.navigate('ProductsTab', { screen: 'MovementHistory' });
  }

  function openStockComparison() {
    navigation.navigate('ProductsTab', { screen: 'StockComparison' });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Olá, Wellisson!</Text>
          <Text style={styles.greetingSubtitle}>Aqui está o resumo do seu estoque hoje.</Text>
        </View>

        <Text style={styles.sectionTitle}>Resumo do dia</Text>
        <View style={styles.grid}>
          {summaryCards.map((card) => (
            <SummaryCard
              color={card.color}
              icon={card.icon}
              key={card.title}
              onPress={() => navigation.navigate('ProductsTab', card.route)}
              title={card.title}
              value={summary[card.key]}
            />
          ))}
        </View>

        <Pressable
          onPress={openProductConsultation}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Ionicons color="#ffffff" name="scan-outline" size={23} />
          <Text style={styles.primaryButtonText}>Escanear produto</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Atalhos rápidos</Text>
        <View style={styles.grid}>
          {shortcuts.map((shortcut) => (
            <QuickShortcutCard
              icon={shortcut.icon}
              key={shortcut.label}
              label={shortcut.label}
              onPress={
                shortcut.label === 'Saída Rápida'
                  ? openStockOutput
                  : shortcut.label === 'Consultar Produto'
                    ? openProductConsultation
                  : shortcut.label === 'Cadastrar Produto'
                    ? openQuickEntry
                  : shortcut.label === 'Posição do Estoque'
                    ? openStockPosition
                  : shortcut.label === 'Histórico'
                    ? openMovementHistory
                  : shortcut.label === 'Entrada x Saída'
                    ? openStockComparison
                  : shortcut.label === 'Produtos Vencendo'
                    ? openExpiringProducts
                    : shortcut.label === 'Estoque Baixo'
                      ? openLowStock
                    : undefined
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
