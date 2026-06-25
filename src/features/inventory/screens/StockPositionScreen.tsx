import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ProductsStackParamList } from '@/navigation/types';
import {
  formatProductDate,
  formatStockStatus,
  getStockPositions,
  type StockAvailabilityStatus,
  type StockPosition,
} from '@/shared/storage/products';

import styles, { primaryGreen } from './sharedStyles';

function getStatusColor(status: StockAvailabilityStatus): string {
  const colors: Record<StockAvailabilityStatus, string> = {
    disponivel: primaryGreen,
    proximo: '#f57c00',
    sem_estoque: '#6f747b',
    vencido: '#d93025',
  };

  return colors[status];
}

function InventoryHeader() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>
      <Text style={styles.headerTitle}>Posição do Estoque</Text>
      <View style={styles.headerButton} />
    </View>
  );
}

function StatusBadge({ status }: { status: StockAvailabilityStatus }) {
  const color = getStatusColor(status);

  return (
    <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: `${color}55` }]}>
      <Text style={[styles.badgeText, { color }]}>{formatStockStatus(status)}</Text>
    </View>
  );
}

function PositionCard({ item }: { item: StockPosition }) {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  return (
    <Pressable onPress={() => navigation.navigate('ProductDetail', { id: item.productId })} style={styles.card}>
      <View style={styles.row}>
        {item.imageUri ? (
          <Image contentFit="cover" source={{ uri: item.imageUri }} style={styles.productImage} />
        ) : (
          <View style={styles.productImageFallback}>
            <Ionicons color={primaryGreen} name="cube-outline" size={24} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.productName}</Text>
          <Text style={styles.meta}>Saldo: {item.quantity} un</Text>
          <Text style={styles.meta}>Validade mais próxima: {formatProductDate(item.validUntil)}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {item.lots.length > 0 ? (
        <View style={{ marginTop: 12, rowGap: 8 }}>
          {item.lots.map((lot) => (
            <View key={lot.lotId} style={styles.row}>
              <Text style={styles.title}>{lot.lotCode}</Text>
              <Text style={styles.meta}>
                {lot.quantity} un - {formatProductDate(lot.validUntil)}
              </Text>
              <StatusBadge status={lot.status} />
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

export default function StockPositionScreen() {
  const [positions, setPositions] = useState<StockPosition[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadPositions() {
        const stockPositions = await getStockPositions();

        if (isActive) {
          setPositions(stockPositions);
        }
      }

      loadPositions();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <InventoryHeader />
      <FlatList
        contentContainerStyle={styles.content}
        data={positions}
        keyExtractor={(item) => item.productId}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.emptyTitle}>Nenhum estoque encontrado</Text>
            <Text style={styles.emptyText}>Entradas registradas aparecerão aqui.</Text>
          </View>
        }
        renderItem={({ item }) => <PositionCard item={item} />}
      />
    </SafeAreaView>
  );
}
