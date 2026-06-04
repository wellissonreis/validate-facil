import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type SummaryCardProps = {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: number;
};

export default function SummaryCard({ color, icon, title, value }: SummaryCardProps) {
  return (
    <View style={styles.card}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#f0f2f5',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
    minHeight: 154,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    width: '48%',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    marginBottom: 14,
    width: 42,
  },
  title: {
    color: '#202124',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    minHeight: 40,
  },
  valueRow: {
    alignItems: 'baseline',
    columnGap: 6,
    flexDirection: 'row',
    marginTop: 8,
  },
  value: {
    fontSize: 34,
    fontWeight: '800',
  },
  unit: {
    color: '#747980',
    fontSize: 14,
    fontWeight: '700',
  },
});
