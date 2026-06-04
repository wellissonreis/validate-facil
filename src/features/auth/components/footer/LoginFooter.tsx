import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';
import styles from './Style';

const softGreen = '#8CE8B6';

function FooterIllustration() {
  return (
    <View style={styles.illustration}>
      <View style={styles.groundLine} />
      <View style={styles.leftProducts}>
        <MaterialIcons color={softGreen} name="storefront" size={72} style={styles.backgroundIcon} />
        <MaterialIcons color={softGreen} name="inventory-2" size={54} style={styles.foregroundIcon} />
      </View>
      <MaterialIcons color={softGreen} name="shopping-basket" size={118} style={styles.basketIcon} />
    </View>
  );
}

export default function LoginFooter() {
  return (
    <View style={styles.container}>
      <FooterIllustration />
      <View style={styles.messageRow}>
        <MaterialIcons color="#60646C" name="verified-user" size={20} />
        <Text style={styles.message}>Seus dados protegidos com segurança</Text>
      </View>
    </View>
  );
}
