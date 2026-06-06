import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';
import { getProducts, isLowStockProduct, LOW_STOCK_MINIMUM } from '@/shared/storage/products';
import type { Product } from '@/shared/storage/products';

import styles, { primaryGreen } from './style';
import type { LowStockProduct } from './types';

function toLowStockProduct(product: Product): LowStockProduct {
  return {
    id: product.id,
    minimum: LOW_STOCK_MINIMUM,
    name: product.nome,
    quantity: product.quantidade,
    status: product.quantidade === 0 ? 'Crítico' : product.quantidade <= 2 ? 'Atenção' : 'Baixo',
  };
}

function LowStockHeader() {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.iconButton}>
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>
      <Text style={styles.title}>Estoque Baixo</Text>
      <Pressable accessibilityLabel="Filtrar produtos" style={styles.iconButton}>
        <Ionicons color="#202124" name="filter-outline" size={24} />
      </Pressable>
    </View>
  );
}

function LowStockTableHeader() {
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.heading, styles.productColumn]}>Produto</Text>
      <Text style={[styles.heading, styles.quantityColumn]}>Atual</Text>
      <Text style={[styles.heading, styles.minimumColumn]}>Mín.</Text>
      <Text style={[styles.heading, styles.statusColumn]}>Status</Text>
    </View>
  );
}

function LowStockRow({ product }: { product: LowStockProduct }) {
  const color = product.status === 'Crítico' ? '#d93025' : product.status === 'Atenção' ? '#f57c00' : '#1e88e5';

  return (
    <Pressable
      onPress={() => router.push(`/product-detail?id=${encodeURIComponent(product.id)}`)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.productColumn}>
        <View style={styles.iconBox}>
          <Ionicons color={primaryGreen} name="cube-outline" size={20} />
        </View>
        <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
      </View>
      <Text style={[styles.valueText, styles.quantityColumn]}>{product.quantity}</Text>
      <Text style={[styles.valueText, styles.minimumColumn]}>{product.minimum}</Text>
      <View style={styles.statusColumn}>
        <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: `${color}55` }]}>
          <Text style={[styles.badgeText, { color }]}>{product.status}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function LowStockScreen() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProducts() {
        const storedProducts = await getProducts();

        if (isActive) {
          setProducts(storedProducts.filter(isLowStockProduct).map(toLowStockProduct));
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
      <LowStockHeader />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum produto com estoque baixo</Text>
            <Text style={styles.emptyText}>Produtos com estoque baixo aparecerão aqui.</Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <Ionicons color="#1e88e5" name="trending-down-outline" size={28} />
              <View style={styles.summaryText}>
                <Text style={styles.summaryTitle}>{products.length} itens com estoque baixo</Text>
                <Text style={styles.summarySubtitle}>Produtos abaixo do estoque mínimo cadastrado</Text>
              </View>
            </View>
            <LowStockTableHeader />
          </>
        }
        renderItem={({ item }) => <LowStockRow product={item} />}
        showsVerticalScrollIndicator={false}
      />

      <BottomTab activeTab="Produtos" />
    </SafeAreaView>
  );
}
