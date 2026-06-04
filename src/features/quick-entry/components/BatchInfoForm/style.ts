import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  field: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e8eb',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minWidth: 150,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  label: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suffix: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '800',
  },
  value: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
  },
  valueRow: {
    alignItems: 'center',
    columnGap: 7,
    flexDirection: 'row',
  },
});

export default styles;
