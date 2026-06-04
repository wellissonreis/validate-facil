import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e8eaed',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dateColumn: {
    flex: 1.02,
    textAlign: 'center',
  },
  heading: {
    color: '#5f6368',
    fontSize: 12,
    fontWeight: '800',
  },
  productColumn: {
    flex: 1.65,
  },
  quantityColumn: {
    flex: 0.58,
    textAlign: 'center',
  },
  statusColumn: {
    flex: 0.95,
    textAlign: 'center',
  },
});

export default styles;
