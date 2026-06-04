import { Image, StyleSheet, View } from 'react-native';

type BrandLogoProps = {
  iconSize?: number;
  widthLogo?: number;
  heightLogo?: number;
};

export default function BrandLogo({ iconSize = 0, widthLogo = 300, heightLogo = 130  }: BrandLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logos/Logo.png')}
        style={
          { 
            width: iconSize > 0 ? iconSize : widthLogo,
            height: iconSize > 0 ? iconSize : heightLogo 
          }
        }
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
