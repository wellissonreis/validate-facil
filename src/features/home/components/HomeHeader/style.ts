import { StyleSheet } from 'react-native';

export const primaryGreen = '#05b163';

const styles = StyleSheet.create({
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
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
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

export default styles;
