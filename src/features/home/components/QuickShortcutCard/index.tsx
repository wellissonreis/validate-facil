import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import styles from './style';
import type { QuickShortcutCardProps } from './types';

export default function QuickShortcutCard({ icon, label, onPress }: QuickShortcutCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Ionicons color="#05b163" name={icon} size={23} />
      <Text numberOfLines={2} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}
