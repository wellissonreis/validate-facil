import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ProductsStackParamList } from '@/navigation/types';
import {
  formatDateInput,
  getProducts,
  getProductLots,
  getStockComparison,
  parseProductDate,
  type Product,
  type StockComparison,
  type StockMovement,
} from '@/shared/storage/products';

import styles, { primaryGreen } from './sharedStyles';

function ComparisonHeader() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>
      <Text style={styles.headerTitle}>Entrada x Saída</Text>
      <View style={styles.headerButton} />
    </View>
  );
}

function MovementLine({ movement }: { movement: StockMovement }) {
  const color = movement.quantityDelta >= 0 ? primaryGreen : '#d93025';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{movement.productName}</Text>
          <Text style={styles.meta}>{movement.lotCode ? `Lote ${movement.lotCode}` : 'Sem lote'}</Text>
          <Text style={styles.meta}>{movement.createdAt.slice(0, 10).split('-').reverse().join('/')}</Text>
        </View>
        <Text style={[styles.summaryValue, { color }]}>
          {movement.quantityDelta > 0 ? '+' : ''}
          {movement.quantityDelta}
        </Text>
      </View>
    </View>
  );
}

export default function StockComparisonScreen() {
  const [comparison, setComparison] = useState<StockComparison>({
    currentBalance: 0,
    divergence: 0,
    entries: 0,
    exits: 0,
    finalBalance: 0,
    movements: [],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [productFilter, setProductFilter] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  const [lotFilter, setLotFilter] = useState('');
  const [selectedLotId, setSelectedLotId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const parsedStartDate = parseProductDate(startDate);
  const parsedEndDate = parseProductDate(endDate);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadData() {
        const [nextProducts, nextComparison] = await Promise.all([
          getProducts(),
          getStockComparison({
            endDate: parsedEndDate ?? undefined,
            lotId: selectedLotId,
            productId: selectedProductId,
            startDate: parsedStartDate ?? undefined,
          }),
        ]);

        if (isActive) {
          setProducts(nextProducts);
          setComparison(nextComparison);
        }
      }

      loadData();

      return () => {
        isActive = false;
        setProducts([]);
      };
    }, [parsedEndDate, parsedStartDate, selectedLotId, selectedProductId]),
  );

  const filteredMovements = useMemo(() => {
    const productSearch = productFilter.trim().toLocaleLowerCase();
    const lotSearch = lotFilter.trim().toLocaleLowerCase();

    return comparison.movements.filter((movement) => {
      if (productSearch && !movement.productName.toLocaleLowerCase().includes(productSearch)) {
        return false;
      }

      if (lotSearch && !movement.lotCode?.toLocaleLowerCase().includes(lotSearch)) {
        return false;
      }

      return true;
    });
  }, [comparison.movements, lotFilter, productFilter]);
  const selectedProduct = selectedProductId ? products.find((product) => product.id === selectedProductId) : undefined;
  const selectedProductLots = selectedProduct ? getProductLots(selectedProduct) : [];

  function handleSelectProduct(productId?: string) {
    setSelectedProductId(productId);
    setSelectedLotId(undefined);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ComparisonHeader />
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.summaryGrid}>
              <View style={styles.field}>
                <Text style={styles.label}>Produto</Text>
                <TextInput
                  onChangeText={setProductFilter}
                  placeholder="Nome do produto"
                  placeholderTextColor="#9aa0a6"
                  style={styles.input}
                  value={productFilter}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Lote</Text>
                <TextInput
                  onChangeText={setLotFilter}
                  placeholder="Código do lote"
                  placeholderTextColor="#9aa0a6"
                  style={styles.input}
                  value={lotFilter}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Início</Text>
                <TextInput
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                  onChangeText={(value) => setStartDate(formatDateInput(value))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#9aa0a6"
                  style={styles.input}
                  value={startDate}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Fim</Text>
                <TextInput
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                  onChangeText={(value) => setEndDate(formatDateInput(value))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#9aa0a6"
                  style={styles.input}
                  value={endDate}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Produto selecionado</Text>
              <View style={{ gap: 8 }}>
                <Pressable
                  onPress={() => handleSelectProduct(undefined)}
                  style={({ pressed }) => [styles.choiceButton, !selectedProductId && styles.choiceButtonSelected, pressed && styles.choiceButtonPressed]}
                >
                  <Text style={styles.choiceText}>Todos os produtos</Text>
                </Pressable>
                {products.map((product) => (
                  <Pressable
                    key={product.id}
                    onPress={() => handleSelectProduct(product.id)}
                    style={({ pressed }) => [
                      styles.choiceButton,
                      selectedProductId === product.id && styles.choiceButtonSelected,
                      pressed && styles.choiceButtonPressed,
                    ]}
                  >
                    <Text style={styles.choiceText}>{product.nome}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {selectedProductLots.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.label}>Lote selecionado</Text>
                <View style={{ gap: 8 }}>
                  <Pressable
                    onPress={() => setSelectedLotId(undefined)}
                    style={({ pressed }) => [styles.choiceButton, !selectedLotId && styles.choiceButtonSelected, pressed && styles.choiceButtonPressed]}
                  >
                    <Text style={styles.choiceText}>Todos os lotes</Text>
                  </Pressable>
                  {selectedProductLots.map((lot) => (
                    <Pressable
                      key={lot.id}
                      onPress={() => setSelectedLotId(lot.id)}
                      style={({ pressed }) => [
                        styles.choiceButton,
                        selectedLotId === lot.id && styles.choiceButtonSelected,
                        pressed && styles.choiceButtonPressed,
                      ]}
                    >
                      <Text style={styles.choiceText}>{lot.codigo}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.summaryGrid}>
              <View style={styles.card}>
                <Text style={styles.label}>Entradas</Text>
                <Text style={styles.summaryValue}>{comparison.entries}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>Saídas</Text>
                <Text style={[styles.summaryValue, { color: '#d93025' }]}>{comparison.exits}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>Saldo do filtro</Text>
                <Text style={styles.summaryValue}>{comparison.finalBalance}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>Saldo atual</Text>
                <Text style={styles.summaryValue}>{comparison.currentBalance}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>Divergência</Text>
                <Text style={[styles.summaryValue, { color: comparison.divergence === 0 ? primaryGreen : '#f57c00' }]}>
                  {comparison.divergence}
                </Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.emptyTitle}>Sem movimentações no filtro</Text>
            <Text style={styles.emptyText}>Ajuste os filtros para comparar entradas e saídas.</Text>
          </View>
        }
        renderItem={({ item }) => <MovementLine movement={item} />}
      />
    </SafeAreaView>
  );
}
