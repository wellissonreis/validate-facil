import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function BatchInfoForm() {
  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Text style={styles.label}>Quantidade</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>12</Text>
          <Text style={styles.suffix}>un</Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Validade</Text>
        <View style={styles.valueRow}>
          <Ionicons color="#05b163" name="calendar-outline" size={20} />
          <Text style={styles.value}>25/05/2025</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  field: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e8eb',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minWidth: 150,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  label: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  suffix: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '800',
  },
  value: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
  },
  valueRow: {
    alignItems: 'center',
    columnGap: 7,
    flexDirection: 'row',
  },
});
