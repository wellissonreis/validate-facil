import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';
import { formatProductDate, getProducts, isExpiredProduct } from '@/shared/storage/products';
import type { Product } from '@/shared/storage/products';

import ExpiringProductRow, { type ExpiringProduct } from '../components/ExpiringProductRow';
import ExpiringProductsHeader from '../components/ExpiringProductsHeader';
import ProductTableHeader from '../components/ProductTableHeader';
import styles from './style';

function toExpiredProduct(product: Product): ExpiringProduct {
  return {
    id: product.id,
    name: product.nome,
    quantity: product.quantidade,
    status: 'Vencido',
    validUntil: formatProductDate(product.validade),
  };
}

export default function ExpiringProductsScreen() {
  const [products, setProducts] = useState<ExpiringProduct[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProducts() {
        const storedProducts = await getProducts();

        if (isActive) {
          setProducts(storedProducts.filter(isExpiredProduct).map(toExpiredProduct));
        }
      }

      loadProducts();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpiringProductsHeader />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum produto vencido</Text>
            <Text style={styles.emptyText}>Produtos vencidos cadastrados aparecerão aqui.</Text>
          </View>
        }
        ListHeaderComponent={
          products.length > 0 ? (
            <View style={styles.table}>
              <ProductTableHeader />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.table}>
            <ExpiringProductRow product={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <BottomTab activeTab="Produtos" />
    </SafeAreaView>
  );
}
