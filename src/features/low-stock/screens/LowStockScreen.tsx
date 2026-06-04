import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

const primaryGreen = '#05b163';

const lowStockProducts = [
  { id: '1', minimum: 10, name: 'Iogurte Natural 170g', quantity: 6, status: 'Baixo' },
  { id: '2', minimum: 8, name: 'Queijo Mussarela Fatiado 150g', quantity: 4, status: 'Baixo' },
  { id: '3', minimum: 12, name: 'Presunto Cozido Fatiado 200g', quantity: 5, status: 'Crítico' },
  { id: '4', minimum: 14, name: 'Leite UHT Integral 1L', quantity: 8, status: 'Baixo' },
  { id: '5', minimum: 18, name: 'Pão de Forma Tradicional 500g', quantity: 10, status: 'Atenção' },
  { id: '6', minimum: 10, name: 'Manteiga com Sal 200g', quantity: 6, status: 'Baixo' },
];

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

function LowStockRow({ product }: { product: (typeof lowStockProducts)[number] }) {
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

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 68,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#edf0f2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  heading: {
    color: '#5f6368',
    fontSize: 12,
    fontWeight: '800',
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#eef8f3',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  listContent: {
    backgroundColor: '#ffffff',
    paddingBottom: 18,
    paddingHorizontal: 10,
  },
  minimumColumn: {
    flex: 0.62,
    textAlign: 'center',
  },
  productColumn: {
    alignItems: 'center',
    columnGap: 9,
    flex: 1.75,
    flexDirection: 'row',
  },
  productName: {
    color: '#30343a',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  quantityColumn: {
    flex: 0.64,
    textAlign: 'center',
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#edf0f2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 66,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rowPressed: {
    backgroundColor: '#f5fbf8',
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  statusColumn: {
    alignItems: 'center',
    flex: 0.95,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: '#f5fbff',
    borderColor: '#d8ecff',
    borderRadius: 16,
    borderWidth: 1,
    columnGap: 12,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 18,
    padding: 16,
  },
  summarySubtitle: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 3,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '800',
  },
  tableHeader: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e8eaed',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  title: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
  },
  valueText: {
    color: '#3c4043',
    fontSize: 12,
    fontWeight: '700',
  },
});
