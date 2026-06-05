import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';
import {
  formatDateInput,
  formatProductDate,
  getExpiredProductItems,
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

function toExpiredProduct(item: ExpiredProductItem): ExpiringProduct {
  return {
    id: item.id,
    lotId: item.lotId,
    name: item.name,
    productId: item.productId,
    quantity: item.quantity,
    status: 'Vencido',
    subtitle: item.lot ? `Lote: ${item.lot}` : 'Sem lote',
    validUntil: formatProductDate(item.validUntil),
  };
}

export default function ExpiringProductsScreen() {
  const [editingProduct, setEditingProduct] = useState<ExpiringProduct | null>(null);
  const [newExpirationDate, setNewExpirationDate] = useState('');
  const [products, setProducts] = useState<ExpiringProduct[]>([]);

  const loadProducts = useCallback(async () => {
    const storedProducts = await getProducts();

    setProducts(getExpiredProductItems(storedProducts).map(toExpiredProduct));
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadActiveProducts() {
        const storedProducts = await getProducts();

        if (isActive) {
          setProducts(getExpiredProductItems(storedProducts).map(toExpiredProduct));
        }
      }

      loadActiveProducts();

      return () => {
        isActive = false;
      };
    }, []),
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
    const target = product.lotId ? 'este lote vencido' : 'este produto vencido';

    Alert.alert('Remover vencido', `Deseja remover ${target}?`, [
      { style: 'cancel', text: 'Cancelar' },
      {
        onPress: async () => {
          try {
            await removeExpiredItem(product.productId ?? product.id, product.lotId);
            await loadProducts();
            Alert.alert('Item removido', 'O item vencido foi removido.');
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
      <ExpiringProductsHeader />

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
            <Text style={styles.emptyTitle}>Nenhum produto vencido</Text>
            <Text style={styles.emptyText}>Produtos ou lotes vencidos cadastrados aparecerão aqui.</Text>
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

      <BottomTab activeTab="Produtos" />
    </SafeAreaView>
  );
}
