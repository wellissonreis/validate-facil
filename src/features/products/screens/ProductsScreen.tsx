import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExpiringProductRow, { type ExpiringProduct } from '@/features/expiring-products/components/ExpiringProductRow';
import ProductTableHeader from '@/features/expiring-products/components/ProductTableHeader';
import BottomTab from '@/features/home/components/BottomTab';
import { formatProductDate, getProducts, isExpiredProduct } from '@/shared/storage/products';
import type { Product } from '@/shared/storage/products';

import styles from './style';

function ProductsHeader() {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.iconButton}>
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>
      <Text style={styles.title}>Produtos</Text>
      <Pressable
        accessibilityLabel="Cadastrar produto"
        onPress={() => router.push('/quick-entry')}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="add" size={26} />
      </Pressable>
    </View>
  );
}

function toRowProduct(product: Product): ExpiringProduct {
  return {
    id: product.id,
    name: product.nome,
    quantity: product.quantidade,
    status: isExpiredProduct(product) ? 'Vencido' : 'Ok',
    validUntil: formatProductDate(product.validade),
  };
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<ExpiringProduct[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProducts() {
        const storedProducts = await getProducts();

        if (isActive) {
          setProducts(storedProducts.map(toRowProduct));
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
      <ProductsHeader />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
            <Text style={styles.emptyText}>Cadastre o primeiro produto para iniciar o controle.</Text>
            <Pressable
              onPress={() => router.push('/quick-entry')}
              style={({ pressed }) => [styles.emptyButton, pressed && styles.emptyButtonPressed]}
            >
              <Ionicons color="#ffffff" name="add" size={20} />
              <Text style={styles.emptyButtonText}>Cadastrar produto</Text>
            </Pressable>
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
