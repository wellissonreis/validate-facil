import { Colors, Spacing } from '@/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.four,
    rowGap: Spacing.two,
    width: '100%',
  },
  illustration: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 126,
    justifyContent: 'center',
    maxWidth: 420,
    position: 'relative',
    width: '100%',
  },
  groundLine: {
    backgroundColor: '#8CE8B6',
    bottom: 4,
    height: 4,
    left: 0,
    opacity: 0.62,
    position: 'absolute',
    right: 0,
  },
  leftProducts: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    left: Spacing.two,
    position: 'absolute',
  },
  backgroundIcon: {
    opacity: 0.5,
  },
  foregroundIcon: {
    marginLeft: -Spacing.three,
    opacity: 0.68,
  },
  basketIcon: {
    bottom: -Spacing.one,
    opacity: 0.78,
    position: 'absolute',
    right: Spacing.two,
  },
  messageRow: {
    alignItems: 'center',
    columnGap: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 420,
    width: '100%',
  },
  message: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
