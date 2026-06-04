import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const primaryGreen = '#05b163';

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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  brand: {
    alignItems: 'center',
    columnGap: 7,
    flexDirection: 'row',
  },
  brandText: {
    color: primaryGreen,
    fontSize: 19,
    fontWeight: '800',
  },
  notification: {
    position: 'relative',
  },
  notificationDot: {
    backgroundColor: '#e53935',
    borderColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1.5,
    height: 10,
    position: 'absolute',
    right: 1,
    top: 1,
    width: 10,
  },
});
