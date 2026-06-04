import { StyleSheet } from 'react-native';

export const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopColor: '#edf0f2',
    borderTopWidth: 1,
    elevation: 10,
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    rowGap: 4,
  },
  itemPressed: {
    opacity: 0.7,
  },
  label: {
    color: '#5f6368',
    fontSize: 11,
    fontWeight: '700',
  },
  selectedAction: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginTop: -22,
    shadowColor: primaryGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    width: 48,
  },
  selectedLabel: {
    color: primaryGreen,
  },
});

export default styles;
