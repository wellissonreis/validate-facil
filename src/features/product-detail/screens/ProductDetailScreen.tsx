import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

const primaryGreen = '#05b163';

const product = {
  barcode: '7896058201234',
  brand: 'Itambé',
  history: [
    { date: '10/05/2025', lot: '250510-01', quantity: 12 },
    { date: '05/05/2025', lot: '250505-01', quantity: 20 },
    { date: '01/06/2025', lot: '250501-01', quantity: 16 },
  ],
  lots: [
    { expirationDate: '25/05/2025', quantity: 12, status: 'Crítico' },
    { expirationDate: '05/06/2025', quantity: 20, status: 'Atenção' },
    { expirationDate: '20/06/2025', quantity: 16, status: 'Ok' },
  ],
  name: 'Leite UHT Integral 1L',
  stock: 48,
  unit: 'un',
};

type LotStatus = (typeof product.lots)[number]['status'];

function ProductDetailHeader() {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.headerButton}>
        <Ionicons color="#202124" name="chevron-back" size={27} />
      </Pressable>
      <Text style={styles.headerTitle}>Detalhe do Produto</Text>
      <Pressable accessibilityLabel="Opções do produto" style={styles.headerButton}>
        <Ionicons color="#202124" name="ellipsis-horizontal" size={26} />
      </Pressable>
    </View>
  );
}

function ProductSummary() {
  return (
    <View style={styles.summary}>
      <View style={styles.productImageCard}>
        <MaterialCommunityIcons color={primaryGreen} name="bottle-soda-classic-outline" size={50} />
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productBrand}>Marca: {product.brand}</Text>
      </View>
    </View>
  );
}

function InfoCard() {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardLabel}>Código de barras</Text>
        <Text style={styles.cardValue}>{product.barcode}</Text>
      </View>
      <Ionicons color="#6f747b" name="barcode-outline" size={31} />
    </View>
  );
}

function StockCard() {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardLabel}>Estoque atual</Text>
        <View style={styles.stockValueRow}>
          <Text style={styles.stockValue}>{product.stock}</Text>
          <Text style={styles.stockUnit}>{product.unit}</Text>
        </View>
      </View>
      <View style={styles.greenIconBox}>
        <Ionicons color={primaryGreen} name="cube-outline" size={28} />
      </View>
    </View>
  );
}

function StatusDot({ status }: { status: LotStatus }) {
  const color = status === 'Crítico' ? '#d93025' : status === 'Atenção' ? '#f57c00' : primaryGreen;

  return <View style={[styles.statusDot, { backgroundColor: color }]} />;
}

function ProductLotsCard() {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lotes cadastrados</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.greenText}>3 lotes</Text>
          <Ionicons color="#7a7f85" name="chevron-forward" size={19} />
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.subTitle}>Datas de validade</Text>

      {product.lots.map((lot) => (
        <View key={lot.expirationDate} style={styles.lotRow}>
          <Text style={styles.rowDate}>{lot.expirationDate}</Text>
          <Text style={styles.rowQuantity}>{lot.quantity} {product.unit}</Text>
          <View style={styles.statusCell}>
            <StatusDot status={lot.status} />
            <Text style={styles.rowStatus}>{lot.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ProductHistoryCard() {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Histórico de entradas</Text>
        <Text style={styles.greenText}>Ver tudo</Text>
      </View>
      <View style={styles.divider} />

      {product.history.map((entry, index) => (
        <View
          key={entry.lot}
          style={[styles.historyRow, index < product.history.length - 1 && styles.historyRowBorder]}
        >
          <Text style={styles.rowDate}>{entry.date}</Text>
          <Text style={styles.rowQuantity}>{entry.quantity} {product.unit}</Text>
          <Text style={styles.lotText}>Lote: {entry.lot}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProductDetailScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ProductDetailHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProductSummary />
        <InfoCard />
        <StockCard />
        <ProductLotsCard />
        <ProductHistoryCard />
      </ScrollView>

      <BottomTab activeTab="Produtos" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eef0f3',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 17,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  cardLabel: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '700',
  },
  cardValue: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 7,
  },
  content: {
    backgroundColor: '#f7f9fa',
    padding: 18,
    rowGap: 14,
  },
  divider: {
    backgroundColor: '#edf0f2',
    height: 1,
    marginHorizontal: -18,
    marginTop: 14,
  },
  greenIconBox: {
    alignItems: 'center',
    backgroundColor: '#eef8f3',
    borderRadius: 15,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  greenText: {
    color: primaryGreen,
    fontSize: 13,
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
  headerButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerMeta: {
    alignItems: 'center',
    columnGap: 3,
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
  },
  historyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 14,
  },
  historyRowBorder: {
    borderBottomColor: '#edf0f2',
    borderBottomWidth: 1,
  },
  lotRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 13,
  },
  lotText: {
    color: '#5f6368',
    flex: 1.15,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  productBrand: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 7,
  },
  productImageCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eef0f3',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    height: 92,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    width: 92,
  },
  productName: {
    color: '#202124',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 25,
  },
  rowDate: {
    color: '#30343a',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  rowQuantity: {
    color: '#5f6368',
    flex: 0.62,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  rowStatus: {
    color: '#30343a',
    fontSize: 13,
    fontWeight: '700',
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderColor: '#eef0f3',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '800',
  },
  statusCell: {
    alignItems: 'center',
    columnGap: 7,
    flex: 0.82,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  stockUnit: {
    color: '#5f6368',
    fontSize: 16,
    fontWeight: '800',
  },
  stockValue: {
    color: primaryGreen,
    fontSize: 38,
    fontWeight: '800',
  },
  stockValueRow: {
    alignItems: 'baseline',
    columnGap: 7,
    flexDirection: 'row',
    marginTop: 3,
  },
  subTitle: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 14,
  },
  summary: {
    alignItems: 'center',
    columnGap: 16,
    flexDirection: 'row',
    paddingBottom: 2,
  },
  summaryText: {
    flex: 1,
  },
});
