import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import StatusBadge from '../StatusBadge';
import styles from './style';
import type { ExpiringProductRowProps } from './types';

export type { ExpiringProduct } from './types';

export default function ExpiringProductRow({ product }: ExpiringProductRowProps) {
  return (
    <Pressable
      onPress={() => router.push(`/product-detail?id=${encodeURIComponent(product.id)}`)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.productColumn}>
        <View style={styles.iconBox}>
          <Ionicons color="#05b163" name="cube-outline" size={20} />
        </View>
        <Text numberOfLines={2} style={styles.productName}>
          {product.name}
        </Text>
      </View>

      <Text style={[styles.valueText, styles.quantityColumn]}>{product.quantity}</Text>
      <Text style={[styles.valueText, styles.dateColumn]}>{product.validUntil}</Text>

      <View style={styles.statusColumn}>
        <StatusBadge status={product.status} />
      </View>
    </Pressable>
  );
}
