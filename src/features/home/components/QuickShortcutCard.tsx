import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type QuickShortcutCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export default function QuickShortcutCard({ icon, label }: QuickShortcutCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons color="#05b163" name={icon} size={23} />
      <Text numberOfLines={2} style={styles.label}>
        {label}
      </Text>
    </View>
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
  label: {
    color: '#30343a',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
    textAlign: 'center',
  },
});
