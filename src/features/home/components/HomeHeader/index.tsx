import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import styles, { primaryGreen } from './style';

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <Ionicons color="#202124" name="menu" size={28} />

      <View style={styles.brand}>
        <MaterialCommunityIcons color={primaryGreen} name="shopping-outline" size={25} />
        <Text style={styles.brandText}>Validade Fácil</Text>
      </View>

      <View style={styles.notification}>
        <Ionicons color="#202124" name="notifications-outline" size={25} />
        <View style={styles.notificationDot} />
      </View>
    </View>
  );
}
