import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import styles from './style';

type ExpiringProductsHeaderProps = {
  title?: string;
};

export default function ExpiringProductsHeader({ title = 'Produtos Vencidos' }: ExpiringProductsHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={() => router.back()}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <Pressable accessibilityLabel="Filtrar produtos" style={styles.iconButton}>
        <Ionicons color="#202124" name="filter-outline" size={24} />
      </Pressable>
    </View>
  );
}
