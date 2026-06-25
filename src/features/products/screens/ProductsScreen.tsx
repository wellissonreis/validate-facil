import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExpiringProductRow, { type ExpiringProduct } from '@/features/expiring-products/components/ExpiringProductRow';
import ProductTableHeader from '@/features/expiring-products/components/ProductTableHeader';
import type { ProductsStackParamList } from '@/navigation/types';
import { formatProductDate, getProductDisplayDate, getProducts, getStockStatus } from '@/shared/storage/products';
import type { Product } from '@/shared/storage/products';

import styles from './style';

function ProductsHeader() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>
      <Text style={styles.title}>Produtos</Text>
      <Pressable
        accessibilityLabel="Cadastrar produto"
        onPress={() => navigation.navigate('QuickEntry')}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="add" size={26} />
      </Pressable>
    </View>
  );
}

function toRowProduct(product: Product): ExpiringProduct {
  const status = getStockStatus(product.quantidade, getProductDisplayDate(product));

  return {
    id: product.id,
    imageUri: product.imageUri,
    name: product.nome,
    quantity: product.quantidade,
    status: status === 'vencido' ? 'Vencido' : status === 'proximo' ? 'Atenção' : 'Ok',
    validUntil: formatProductDate(getProductDisplayDate(product)),
  };
}

export default function ProductsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
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
                onPress={() => navigation.navigate('QuickEntry')}
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
    </SafeAreaView>
  );
}
