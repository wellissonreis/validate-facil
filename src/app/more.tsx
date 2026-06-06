import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

import styles from '@/shared/styles/utilityScreenStyle';

export default function MoreRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons color="#05b163" name="ellipsis-horizontal" size={34} />
        </View>
        <Text style={styles.title}>Mais</Text>
        <Text style={styles.subtitle}>Configurações, suporte e opções extras do app ficam nesta área.</Text>
      </View>
      <BottomTab activeTab="Mais" />
    </SafeAreaView>
  );
}
