import { Image, View } from 'react-native';

import styles from './style';
import type { BrandLogoProps } from './types';

export default function BrandLogo({ iconSize = 0, widthLogo = 300, heightLogo = 130 }: BrandLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logos/Logo.png')}
        style={{
          height: iconSize > 0 ? iconSize : heightLogo,
          width: iconSize > 0 ? iconSize : widthLogo,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
