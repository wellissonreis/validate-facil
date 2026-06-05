import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import styles from './style';

export default function ExpiringProductsHeader() {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={() => router.back()}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>

      <Text style={styles.title}>Produtos Vencidos</Text>

      <Pressable accessibilityLabel="Filtrar produtos" style={styles.iconButton}>
        <Ionicons color="#202124" name="filter-outline" size={24} />
      </Pressable>
    </View>
  );
}
