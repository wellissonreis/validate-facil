import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import styles from './style';

export default function ProductFoundCard() {
  return (
    <View style={styles.card}>
      <View style={styles.imageMock}>
        <Text style={styles.imageText}>Leite</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>Leite UHT Integral 1L</Text>
        <Text style={styles.brand}>Itambé</Text>
        <Text style={styles.code}>7896058201234</Text>
      </View>

      <View style={styles.check}>
        <Ionicons color="#05b163" name="checkmark" size={22} />
      </View>
    </View>
  );
}
