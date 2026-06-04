import { StyleSheet, Text, View } from 'react-native';

export default function ProductTableHeader() {
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, styles.productColumn]}>Produto</Text>
      <Text style={[styles.heading, styles.quantityColumn]}>Qtd.</Text>
      <Text style={[styles.heading, styles.dateColumn]}>Validade</Text>
      <Text style={[styles.heading, styles.statusColumn]}>Status</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e8eaed',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dateColumn: {
    flex: 1.02,
    textAlign: 'center',
  },
  heading: {
    color: '#5f6368',
    fontSize: 12,
    fontWeight: '800',
  },
  productColumn: {
    flex: 1.65,
  },
  quantityColumn: {
    flex: 0.58,
    textAlign: 'center',
  },
  statusColumn: {
    flex: 0.95,
    textAlign: 'center',
  },
});
