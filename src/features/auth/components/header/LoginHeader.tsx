import BrandLogo from '@/shared/components/BrandLogo';
import { Text, View } from 'react-native';
import styles from './Style';

export default function LoginHeader() {
  return (
    <View style={styles.container}>
      <BrandLogo />
      <Text style={styles.subtitle}>
        Controle de validade e estoque{'\n'}para o seu negócio
      </Text>
    </View>
  );
}

