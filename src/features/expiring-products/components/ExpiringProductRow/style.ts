import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  dateColumn: {
    flex: 1.02,
    textAlign: 'center',
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#eef8f3',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  productColumn: {
    alignItems: 'center',
    columnGap: 9,
    flex: 1.65,
    flexDirection: 'row',
  },
  productName: {
    color: '#30343a',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  quantityColumn: {
    flex: 0.58,
    textAlign: 'center',
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#edf0f2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 66,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rowPressed: {
    backgroundColor: '#f5fbf8',
  },
  statusColumn: {
    alignItems: 'center',
    flex: 0.95,
  },
  valueText: {
    color: '#3c4043',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default styles;
