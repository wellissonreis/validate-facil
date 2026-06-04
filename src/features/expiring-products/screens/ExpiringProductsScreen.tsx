import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

import ExpiringProductRow, { ExpiringProduct } from '../components/ExpiringProductRow';
import ExpiringProductsHeader from '../components/ExpiringProductsHeader';
import PeriodFilter, { PeriodOption } from '../components/PeriodFilter';
import ProductTableHeader from '../components/ProductTableHeader';

const products: ExpiringProduct[] = [
  {
    id: '1',
    name: 'Iogurte Natural 170g',
    quantity: 6,
    status: 'Vencido',
    validUntil: '17/05/2025',
  },
  {
    id: '2',
    name: 'Queijo Mussarela Fatiado 150g',
    quantity: 4,
    status: 'Vencido',
    validUntil: '18/05/2025',
  },
  {
    id: '3',
    name: 'Presunto Cozido Fatiado 200g',
    quantity: 5,
    status: 'Crítico',
    validUntil: '19/05/2025',
  },
  {
    id: '4',
    name: 'Leite UHT Integral 1L',
    quantity: 8,
    status: 'Crítico',
    validUntil: '20/05/2025',
  },
  {
    id: '5',
    name: 'Pão de Forma Tradicional 500g',
    quantity: 10,
    status: 'Atenção',
    validUntil: '22/05/2025',
  },
  {
    id: '6',
    name: 'Manteiga com Sal 200g',
    quantity: 6,
    status: 'Atenção',
    validUntil: '24/05/2025',
  },
  {
    id: '7',
    name: 'Requeijão Cremoso 200g',
    quantity: 7,
    status: 'Ok',
    validUntil: '27/05/2025',
  },
  {
    id: '8',
    name: 'Suco de Laranja 1L',
    quantity: 12,
    status: 'Ok',
    validUntil: '30/05/2025',
  },
];

export default function ExpiringProductsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(7);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpiringProductsHeader />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <PeriodFilter
              onSelectPeriod={setSelectedPeriod}
              selectedPeriod={selectedPeriod}
            />
            <View style={styles.table}>
              <ProductTableHeader />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.table}>
            <ExpiringProductRow product={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <BottomTab activeTab="Entrada" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    backgroundColor: '#ffffff',
    paddingBottom: 18,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  table: {
    marginHorizontal: 10,
  },
});
