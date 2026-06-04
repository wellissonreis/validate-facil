import { Colors, Spacing } from '@/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.topLogo,
  },
  subtitle: {
    marginTop: Spacing.three,
    color: Colors.light.textSecondary,
    fontSize: 18,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',    
    
  },
});

export default styles;