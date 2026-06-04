import { Text, View } from 'react-native';

import styles from './style';

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
