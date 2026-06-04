import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

import styles, { primaryGreen } from './style';
import { product } from './types';
import type { LotStatus } from './types';

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
