import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

import styles from './utility-screen-style';

export default function ReportsRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons color="#05b163" name="bar-chart-outline" size={34} />
        </View>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.subtitle}>Indicadores e análises do estoque ficam centralizados aqui.</Text>
      </View>
      <BottomTab activeTab="Relatórios" />
    </SafeAreaView>
  );
}
