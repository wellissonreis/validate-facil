import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import styles from './style';

type QuickEntryHeaderProps = {
  onBack: () => void;
};

export default function QuickEntryHeader({ onBack }: QuickEntryHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={onBack}
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
