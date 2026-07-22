import { useCallback, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ExpirationFilter, ProductsStackParamList } from '@/navigation/types';
import {
  formatDateInput,
  formatProductDate,
  getExpiredProductItems,
  getExpiringInDaysProductItems,
  getProducts,
  parseProductDate,
  removeExpiredItem,
  updateExpiredItemDate,
} from '@/shared/storage/products';
import type { ExpiredProductItem } from '@/shared/storage/products';

import ExpiringProductRow, { type ExpiringProduct } from '../components/ExpiringProductRow';
import ExpiringProductsHeader from '../components/ExpiringProductsHeader';
import ProductTableHeader from '../components/ProductTableHeader';
import styles from './style';

const filterConfig = {
  expired: {
    emptyText: 'Produtos ou lotes vencidos cadastrados aparecerão aqui.',
    emptyTitle: 'Nenhum produto vencido',
    status: 'Vencido',
    title: 'Produtos Vencidos',
  },
  '7days': {
    emptyText: 'Produtos ou lotes que vencem em até 7 dias aparecerão aqui.',
    emptyTitle: 'Nenhum produto vencendo em 7 dias',
    status: 'Crítico',
    title: 'Vencem em 7 dias',
  },
  '15days': {
    emptyText: 'Produtos ou lotes que vencem em até 15 dias aparecerão aqui.',
    emptyTitle: 'Nenhum produto vencendo em 15 dias',
    status: 'Atenção',
    title: 'Vencem em 15 dias',
  },
} as const;

function getExpirationItems(products: Awaited<ReturnType<typeof getProducts>>, filter: ExpirationFilter) {
  if (filter === '7days') {
    return getExpiringInDaysProductItems(products, 7);
  }

  if (filter === '15days') {
    return getExpiringInDaysProductItems(products, 15);
  }

  return getExpiredProductItems(products);
}

function toExpiredProduct(item: ExpiredProductItem, filter: ExpirationFilter): ExpiringProduct {
  return {
    id: item.id,
    lotId: item.lotId,
    name: item.name,
    productId: item.productId,
    quantity: item.quantity,
    status: filterConfig[filter].status,
    subtitle: item.lot ? `Lote: ${item.lot}` : 'Sem lote',
    validUntil: formatProductDate(item.validUntil),
  };
}

export default function ExpiringProductsScreen() {
  const route = useRoute<RouteProp<ProductsStackParamList, 'ExpiringProducts'>>();
  const params = route.params;
  const filter: ExpirationFilter =
    params?.filter === '7days' || params?.filter === '15days' || params?.filter === 'expired'
      ? params.filter
      : 'expired';
  const config = filterConfig[filter];
  const [editingProduct, setEditingProduct] = useState<ExpiringProduct | null>(null);
  const [newExpirationDate, setNewExpirationDate] = useState('');
  const [products, setProducts] = useState<ExpiringProduct[]>([]);

  const loadProducts = useCallback(async () => {
    const storedProducts = await getProducts();
    const productsById = new Map(storedProducts.map((product) => [product.id, product]));

    setProducts(
      getExpirationItems(storedProducts, filter).map((item) => ({
        ...toExpiredProduct(item, filter),
        imageUri: productsById.get(item.productId)?.imageUri,
      })),
    );
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadActiveProducts() {
        const storedProducts = await getProducts();

        if (isActive) {
          const productsById = new Map(storedProducts.map((product) => [product.id, product]));

          setProducts(
            getExpirationItems(storedProducts, filter).map((item) => ({
              ...toExpiredProduct(item, filter),
              imageUri: productsById.get(item.productId)?.imageUri,
            })),
          );
        }
      }

      loadActiveProducts();

      return () => {
        isActive = false;
        setProducts([]);
      };
    }, [filter]),
  );

  function handleUpdateDate(product: ExpiringProduct) {
    setEditingProduct(product);
    setNewExpirationDate('');
  }

  async function handleConfirmUpdateDate() {
    const parsedDate = parseProductDate(newExpirationDate);

    if (!editingProduct) {
      return;
    }

    if (!parsedDate) {
      Alert.alert('Validade inválida', 'Informe a validade no formato DD/MM/AAAA.');
      return;
    }

    try {
      await updateExpiredItemDate(editingProduct.productId ?? editingProduct.id, parsedDate, editingProduct.lotId);
      setEditingProduct(null);
      setNewExpirationDate('');
      await loadProducts();
      Alert.alert('Validade atualizada', 'A nova validade foi salva com sucesso.');
    } catch {
      Alert.alert('Erro ao atualizar', 'Não foi possível atualizar a validade agora.');
    }
  }

  function handleRemove(product: ExpiringProduct) {
    const target = product.lotId ? 'este lote' : 'este produto';

    Alert.alert('Remover item', `Deseja remover ${target}?`, [
      { style: 'cancel', text: 'Cancelar' },
      {
        onPress: async () => {
          try {
            await removeExpiredItem(product.productId ?? product.id, product.lotId);
            await loadProducts();
            Alert.alert('Item removido', 'O item foi removido.');
          } catch {
            Alert.alert('Erro ao remover', 'Não foi possível remover o item agora.');
          }
        },
        style: 'destructive',
        text: 'Remover',
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpiringProductsHeader title={config.title} />

      {editingProduct ? (
        <View style={styles.updateCard}>
          <Text style={styles.updateTitle}>Atualizar validade</Text>
          <Text style={styles.updateText}>
            {editingProduct.name} {editingProduct.subtitle ? `- ${editingProduct.subtitle}` : ''}
          </Text>
          <View style={styles.updateRow}>
            <TextInput
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              onChangeText={(value) => setNewExpirationDate(formatDateInput(value))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9aa0a6"
              style={styles.updateInput}
              value={newExpirationDate}
            />
            <Pressable
              onPress={handleConfirmUpdateDate}
              style={({ pressed }) => [styles.updateButton, pressed && styles.updateButtonPressed]}
            >
              <Text style={styles.updateButtonText}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{config.emptyTitle}</Text>
            <Text style={styles.emptyText}>{config.emptyText}</Text>
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
            <ExpiringProductRow onRemove={handleRemove} onUpdateDate={handleUpdateDate} product={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
