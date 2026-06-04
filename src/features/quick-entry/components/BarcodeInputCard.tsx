import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const primaryGreen = '#05b163';

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

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#cfd4da',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    padding: 22,
    rowGap: 8,
  },
  scanIcon: {
    alignItems: 'center',
    backgroundColor: '#e8f8f0',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 2,
    width: 68,
  },
  title: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: '#f8fafb',
    borderColor: '#e5e8eb',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 14,
    width: '100%',
  },
  input: {
    color: '#202124',
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    height: '100%',
  },
});
