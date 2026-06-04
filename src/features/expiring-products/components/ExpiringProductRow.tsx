import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import StatusBadge, { ExpiringProductStatus } from './StatusBadge';

export type ExpiringProduct = {
  id: string;
  name: string;
  quantity: number;
  status: ExpiringProductStatus;
  validUntil: string;
};

type ExpiringProductRowProps = {
  product: ExpiringProduct;
};

export default function ExpiringProductRow({ product }: ExpiringProductRowProps) {
  return (
    <Pressable
      onPress={() => router.push('/product-detail')}
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

const styles = StyleSheet.create({
  dateColumn: {
    flex: 1.02,
    textAlign: 'center',
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#eef8f3',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  productColumn: {
    alignItems: 'center',
    columnGap: 9,
    flex: 1.65,
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
    flex: 0.58,
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
  statusColumn: {
    alignItems: 'center',
    flex: 0.95,
  },
  valueText: {
    color: '#3c4043',
    fontSize: 12,
    fontWeight: '700',
  },
});
