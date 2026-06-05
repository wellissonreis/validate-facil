import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import StatusBadge from '../StatusBadge';
import styles from './style';
import type { ExpiringProductRowProps } from './types';

export type { ExpiringProduct } from './types';

export default function ExpiringProductRow({ onRemove, onUpdateDate, product }: ExpiringProductRowProps) {
  return (
    <View style={styles.rowWrapper}>
      <Pressable
        onPress={() => router.push(`/product-detail?id=${encodeURIComponent(product.productId ?? product.id)}`)}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <View style={styles.productColumn}>
          <View style={styles.iconBox}>
            <Ionicons color="#05b163" name="cube-outline" size={20} />
          </View>
          <View style={styles.productText}>
            <Text numberOfLines={2} style={styles.productName}>
              {product.name}
            </Text>
            {product.subtitle ? (
              <Text numberOfLines={1} style={styles.productSubtitle}>
                {product.subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <Text style={[styles.valueText, styles.quantityColumn]}>{product.quantity}</Text>
        <Text style={[styles.valueText, styles.dateColumn]}>{product.validUntil}</Text>

        <View style={styles.statusColumn}>
          <StatusBadge status={product.status} />
        </View>
      </Pressable>

      {onRemove || onUpdateDate ? (
        <View style={styles.actions}>
          {onUpdateDate ? (
            <Pressable onPress={() => onUpdateDate(product)} style={styles.actionButton}>
              <Ionicons color="#05b163" name="calendar-outline" size={17} />
              <Text style={styles.actionText}>Atualizar validade</Text>
            </Pressable>
          ) : null}

          {onRemove ? (
            <Pressable onPress={() => onRemove(product)} style={[styles.actionButton, styles.removeButton]}>
              <Ionicons color="#d93025" name="trash-outline" size={17} />
              <Text style={[styles.actionText, styles.removeText]}>Remover</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
