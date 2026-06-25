import { StyleSheet } from 'react-native';

export const primaryGreen = '#05b163';
export const inactiveGray = '#6f747b';

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: primaryGreen,
    borderRadius: 999,
    bottom: -5,
    height: 3,
    position: 'absolute',
    width: 20,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eef2f4',
    borderRadius: 28,
    borderWidth: 1,
    elevation: 16,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-around',
    paddingHorizontal: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  iconWrap: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 48,
  },
  item: {
    alignItems: 'center',
    height: 62,
    justifyContent: 'center',
    position: 'relative',
    rowGap: 2,
  },
  label: {
    color: inactiveGray,
    fontSize: 11,
    fontWeight: '700',
    maxWidth: 68,
  },
  pressable: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  selectedPill: {
    backgroundColor: primaryGreen,
    borderRadius: 18,
    height: 36,
    position: 'absolute',
    shadowColor: primaryGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26,
    shadowRadius: 12,
    width: 48,
  },
  selectedLabel: {
    color: primaryGreen,
  },
  shell: {
    backgroundColor: '#ffffff',
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default styles;
