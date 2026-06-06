import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';
import {
  getExpiredProductItems,
  getExpiringInDaysProductItems,
  getProducts,
  isLowStockProduct,
} from '@/shared/storage/products';

const initialSummary = {
  expiringIn15Days: 0,
  expiringIn7Days: 0,
  expired: 0,
  lowStock: 0,
  totalProducts: 0,
  totalUnits: 0,
};

const reportCards = [
  { color: '#05b163', icon: 'cube-outline', key: 'totalProducts', title: 'Total de produtos' },
  { color: '#e53935', icon: 'alert-circle-outline', key: 'expired', title: 'Itens vencidos' },
  { color: '#f57c00', icon: 'time-outline', key: 'expiringIn7Days', title: 'Vencendo em 7 dias' },
  { color: '#f4b400', icon: 'calendar-outline', key: 'expiringIn15Days', title: 'Vencendo em 15 dias' },
  { color: '#1e88e5', icon: 'trending-down-outline', key: 'lowStock', title: 'Estoque baixo' },
  { color: '#6f42c1', icon: 'layers-outline', key: 'totalUnits', title: 'Unidades em estoque' },
] as const;

export default function ReportsRoute() {
  const [summary, setSummary] = useState(initialSummary);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSummary() {
        const products = await getProducts();

        if (isActive) {
          setSummary({
            expiringIn15Days: getExpiringInDaysProductItems(products, 15).length,
            expiringIn7Days: getExpiringInDaysProductItems(products, 7).length,
            expired: getExpiredProductItems(products).length,
            lowStock: products.filter(isLowStockProduct).length,
            totalProducts: products.length,
            totalUnits: products.reduce((total, product) => total + product.quantidade, 0),
          });
        }
      }

      loadSummary();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons color="#05b163" name="bar-chart-outline" size={28} />
          </View>
          <View>
            <Text style={styles.title}>Relatórios</Text>
            <Text style={styles.subtitle}>Resumo atual do estoque</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {reportCards.map((card) => (
            <View key={card.key} style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: `${card.color}18` }]}>
                <Ionicons color={card.color} name={card.icon} size={23} />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={[styles.cardValue, { color: card.color }]}>{summary[card.key]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomTab activeTab="Relatórios" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#f0f2f5',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
    minHeight: 148,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    width: '48%',
  },
  cardIcon: {
    alignItems: 'center',
    borderRadius: 13,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
    width: 40,
  },
  cardTitle: {
    color: '#202124',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    minHeight: 40,
  },
  cardValue: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },
  content: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
    marginTop: 16,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#e8f7ef',
    borderRadius: 15,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  subtitle: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 3,
  },
  title: {
    color: '#202124',
    fontSize: 26,
    fontWeight: '800',
  },
});
