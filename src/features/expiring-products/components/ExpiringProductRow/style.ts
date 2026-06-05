import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderColor: '#d8f0e4',
    borderRadius: 12,
    borderWidth: 1,
    columnGap: 6,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionText: {
    color: '#05b163',
    fontSize: 12,
    fontWeight: '800',
  },
  actions: {
    columnGap: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
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
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  productSubtitle: {
    color: '#6f747b',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  productText: {
    flex: 1,
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
  rowWrapper: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#edf0f2',
    borderBottomWidth: 1,
  },
  removeButton: {
    borderColor: '#f3d1cd',
  },
  removeText: {
    color: '#d93025',
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
