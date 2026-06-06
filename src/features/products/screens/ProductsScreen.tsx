import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExpiringProductRow, { type ExpiringProduct } from '@/features/expiring-products/components/ExpiringProductRow';
import ProductTableHeader from '@/features/expiring-products/components/ProductTableHeader';
import BottomTab from '@/features/home/components/BottomTab';
import { formatProductDate, getProductDisplayDate, getProducts, isExpiredProduct } from '@/shared/storage/products';
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
    validUntil: formatProductDate(getProductDisplayDate(product)),
  };
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProducts() {
        const storedProducts = await getProducts();

        if (isActive) {
          setProducts(storedProducts);
        }
      }

      loadProducts();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter(
        (product) =>
          product.nome.toLocaleLowerCase().includes(normalizedSearch) ||
          product.codigoBarras?.toLocaleLowerCase().includes(normalizedSearch),
      )
    : products;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProductsHeader />

      <TextInput
        accessibilityLabel="Buscar produtos"
        onChangeText={setSearch}
        placeholder="Buscar por nome ou código de barras"
        style={styles.searchInput}
        value={search}
      />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {products.length > 0 ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </Text>
            <Text style={styles.emptyText}>
              {products.length > 0
                ? 'Tente buscar por outro nome ou código.'
                : 'Cadastre o primeiro produto para iniciar o controle.'}
            </Text>
            {products.length === 0 ? (
              <Pressable
                onPress={() => router.push('/quick-entry')}
                style={({ pressed }) => [styles.emptyButton, pressed && styles.emptyButtonPressed]}
              >
                <Ionicons color="#ffffff" name="add" size={20} />
                <Text style={styles.emptyButtonText}>Cadastrar produto</Text>
              </Pressable>
            ) : null}
          </View>
        }
        ListHeaderComponent={
          filteredProducts.length > 0 ? (
            <View style={styles.table}>
              <ProductTableHeader />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.table}>
            <ExpiringProductRow product={toRowProduct(item)} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <BottomTab activeTab="Produtos" />
    </SafeAreaView>
  );
}
