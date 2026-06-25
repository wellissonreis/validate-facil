import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ProductsStackParamList } from '@/navigation/types';
import { formatProductDate, getStockMovements, type StockMovement } from '@/shared/storage/products';

import styles, { primaryGreen } from './sharedStyles';

const movementLabels: Record<StockMovement['type'], string> = {
  ajuste: 'Ajuste',
  correcao_manual: 'Correção manual',
  entrada: 'Entrada',
  remocao_vencimento: 'Remoção por vencimento',
  saida: 'Saída',
};

function HistoryHeader() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>
      <Text style={styles.headerTitle}>Histórico</Text>
      <View style={styles.headerButton} />
    </View>
  );
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function MovementCard({ movement }: { movement: StockMovement }) {
  const isEntry = movement.quantityDelta > 0;
  const color = isEntry ? primaryGreen : '#d93025';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{movement.productName}</Text>
          <Text style={styles.meta}>
            {movementLabels[movement.type]} - {formatDateTime(movement.createdAt)}
          </Text>
          <Text style={styles.meta}>{movement.reason}</Text>
          {movement.lotCode ? (
            <Text style={styles.meta}>
              Lote {movement.lotCode}
              {movement.lotValidity ? ` - ${formatProductDate(movement.lotValidity)}` : ''}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.summaryValue, { color }]}>
            {isEntry ? '+' : ''}
            {movement.quantityDelta}
          </Text>
          <Text style={styles.meta}>Saldo: {movement.balanceAfterProduct}</Text>
        </View>
      </View>
    </View>
  );
}

export default function MovementHistoryScreen() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadMovements() {
        const nextMovements = await getStockMovements();

        if (isActive) {
          setMovements(nextMovements);
        }
      }

      loadMovements();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredMovements = normalizedSearch
    ? movements.filter(
        (movement) =>
          movement.productName.toLocaleLowerCase().includes(normalizedSearch) ||
          movement.lotCode?.toLocaleLowerCase().includes(normalizedSearch) ||
          movementLabels[movement.type].toLocaleLowerCase().includes(normalizedSearch),
      )
    : movements;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HistoryHeader />
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Buscar</Text>
          <TextInput
            onChangeText={setSearch}
            placeholder="Produto, lote ou tipo"
            placeholderTextColor="#9aa0a6"
            style={styles.input}
            value={search}
          />
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.emptyTitle}>Nenhuma movimentação</Text>
            <Text style={styles.emptyText}>Entradas, saídas e correções aparecerão aqui.</Text>
          </View>
        }
        renderItem={({ item }) => <MovementCard movement={item} />}
      />
    </SafeAreaView>
  );
}
