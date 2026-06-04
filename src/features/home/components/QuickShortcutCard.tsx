import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

type QuickShortcutCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

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

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eef0f3',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'center',
    minHeight: 92,
    paddingHorizontal: 10,
    paddingVertical: 14,
    rowGap: 9,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    width: '48%',
  },
  cardPressed: {
    backgroundColor: '#f5fbf8',
  },
  label: {
    color: '#30343a',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
    textAlign: 'center',
  },
});
