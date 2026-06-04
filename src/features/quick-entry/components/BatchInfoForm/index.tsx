import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import styles from './style';

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
