import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

import styles, { primaryGreen } from './style';
import { lowStockProducts } from './types';
import type { LowStockProduct } from './types';

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
      onPress={() => router.push('/product-detail')}
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <LowStockHeader />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={lowStockProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <Ionicons color="#1e88e5" name="trending-down-outline" size={28} />
              <View style={styles.summaryText}>
                <Text style={styles.summaryTitle}>19 itens com estoque baixo</Text>
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
