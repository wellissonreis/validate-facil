import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getProducts,
  isExpiredProduct,
  isLowStockProduct,
  isProductExpiringWithinDays,
} from '@/shared/storage/products';

import BottomTab from '../components/BottomTab';
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
    icon: 'cube-outline',
    key: 'total',
    title: 'Produtos cadastrados',
  },
  {
    color: '#e53935',
    icon: 'alert-circle-outline',
    key: 'expired',
    title: 'Produtos vencidos',
  },
  {
    color: '#f57c00',
    icon: 'time-outline',
    key: 'expiringIn7Days',
    title: 'Vencem em 7 dias',
  },
  {
    color: '#f4b400',
    icon: 'calendar-outline',
    key: 'expiringIn15Days',
    title: 'Vencem em 15 dias',
  },
  {
    color: '#1e88e5',
    icon: 'trending-down-outline',
    key: 'lowStock',
    title: 'Estoque baixo',
  },
] as const;

const shortcuts = [
  { icon: 'add-outline', label: 'Entrada Rápida' },
  { icon: 'hourglass-outline', label: 'Produtos Vencendo' },
  { icon: 'layers-outline', label: 'Estoque Baixo' },
  { icon: 'document-text-outline', label: 'Relatórios' },
] as const;

export default function HomeScreen() {
  const [summary, setSummary] = useState(initialSummary);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSummary() {
        const products = await getProducts();

        if (isActive) {
          setSummary({
            expiringIn15Days: products.filter((product) => isProductExpiringWithinDays(product, 15)).length,
            expiringIn7Days: products.filter((product) => isProductExpiringWithinDays(product, 7)).length,
            expired: products.filter(isExpiredProduct).length,
            lowStock: products.filter(isLowStockProduct).length,
            total: products.length,
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
    router.push('/quick-entry');
  }

  function openExpiringProducts() {
    router.push('/expiring-products');
  }

  function openLowStock() {
    router.push('/low-stock');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Olá, João!</Text>
          <Text style={styles.greetingSubtitle}>Aqui está o resumo do seu estoque hoje.</Text>
        </View>

        <Text style={styles.sectionTitle}>Resumo do dia</Text>
        <View style={styles.grid}>
          {summaryCards.map((card) => (
            <SummaryCard
              color={card.color}
              icon={card.icon}
              key={card.title}
              onPress={openExpiringProducts}
              title={card.title}
              value={summary[card.key]}
            />
          ))}
        </View>

        <Pressable
          onPress={openQuickEntry}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Ionicons color="#ffffff" name="add" size={23} />
          <Text style={styles.primaryButtonText}>Registrar entrada</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Atalhos rápidos</Text>
        <View style={styles.grid}>
          {shortcuts.map((shortcut) => (
            <QuickShortcutCard
              icon={shortcut.icon}
              key={shortcut.label}
              label={shortcut.label}
              onPress={
                shortcut.label === 'Entrada Rápida'
                  ? openQuickEntry
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

      <BottomTab />
    </SafeAreaView>
  );
}
