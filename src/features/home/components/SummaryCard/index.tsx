import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import styles from './style';
import type { SummaryCardProps } from './types';

export default function SummaryCard({ color, icon, onPress, title, value }: SummaryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}18` }]}>
        <Ionicons color={color} name={icon} size={24} />
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.unit}>itens</Text>
      </View>
    </Pressable>
  );
}
