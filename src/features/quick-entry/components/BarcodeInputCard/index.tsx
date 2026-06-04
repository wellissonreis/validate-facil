import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TextInput, View } from 'react-native';

import styles, { primaryGreen } from './style';

export default function BarcodeInputCard() {
  return (
    <View style={styles.card}>
      <View style={styles.scanIcon}>
        <MaterialCommunityIcons color={primaryGreen} name="barcode-scan" size={42} />
      </View>

      <Text style={styles.title}>Toque para escanear</Text>
      <Text style={styles.subtitle}>ou digite o código manualmente</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          keyboardType="number-pad"
          placeholder="Digite o código de barras"
          placeholderTextColor="#9aa0a6"
          style={styles.input}
          value="7896058201234"
        />
        <Ionicons color="#6f747b" name="keypad-outline" size={22} />
      </View>
    </View>
  );
}
