import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';

import styles from '@/features/quick-entry/components/QuickEntryHeader/style';
import type { RootTabParamList } from '@/navigation/types';

export default function StockOutputHeader() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <View style={styles.container}>
      <Pressable accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.iconButton}>
        <Ionicons color="#202124" name="chevron-back" size={26} />
      </Pressable>

      <Text style={styles.title}>Saída Rápida</Text>

      <Pressable
        accessibilityLabel="Consultar produto"
        onPress={() => navigation.navigate('ConsultationTab', { screen: 'ProductConsultation' })}
        style={styles.iconButton}
      >
        <Ionicons color="#202124" name="search-outline" size={25} />
      </Pressable>
    </View>
  );
}
