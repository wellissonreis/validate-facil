import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import styles from './style';

export default function QuickEntryHeader() {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={() => router.back()}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>

      <Text style={styles.title}>Entrada Rápida</Text>

      <Pressable accessibilityLabel="Informações" style={styles.iconButton}>
        <Ionicons color="#202124" name="information-circle-outline" size={25} />
      </Pressable>
    </View>
  );
}
