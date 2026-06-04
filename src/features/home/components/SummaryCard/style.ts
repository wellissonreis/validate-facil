import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#f0f2f5',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
    minHeight: 154,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    width: '48%',
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    marginBottom: 14,
    width: 42,
  },
  title: {
    color: '#202124',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    minHeight: 40,
  },
  unit: {
    color: '#747980',
    fontSize: 14,
    fontWeight: '700',
  },
  value: {
    fontSize: 34,
    fontWeight: '800',
  },
  valueRow: {
    alignItems: 'baseline',
    columnGap: 6,
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default styles;
