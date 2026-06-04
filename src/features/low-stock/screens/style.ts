import { StyleSheet } from 'react-native';

export const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 68,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#edf0f2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  heading: {
    color: '#5f6368',
    fontSize: 12,
    fontWeight: '800',
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#eef8f3',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  listContent: {
    backgroundColor: '#ffffff',
    paddingBottom: 18,
    paddingHorizontal: 10,
  },
  minimumColumn: {
    flex: 0.62,
    textAlign: 'center',
  },
  productColumn: {
    alignItems: 'center',
    columnGap: 9,
    flex: 1.75,
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
    flex: 0.64,
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
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  statusColumn: {
    alignItems: 'center',
    flex: 0.95,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: '#f5fbff',
    borderColor: '#d8ecff',
    borderRadius: 16,
    borderWidth: 1,
    columnGap: 12,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 18,
    padding: 16,
  },
  summarySubtitle: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 3,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '800',
  },
  tableHeader: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e8eaed',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  title: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
  },
  valueText: {
    color: '#3c4043',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default styles;
