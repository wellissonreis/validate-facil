import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';

import type { ProductsStackParamList } from '@/navigation/types';

import styles from './style';

export default function QuickEntryHeader() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>

      <Text style={styles.title}>Cadastrar Produto</Text>

      <Pressable accessibilityLabel="Informações" style={styles.iconButton}>
        <Ionicons color="#202124" name="information-circle-outline" size={25} />
      </Pressable>
    </View>
  );
}
