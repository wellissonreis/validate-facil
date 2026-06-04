import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  brand: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eef0f3',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    flexDirection: 'row',
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  check: {
    alignItems: 'center',
    backgroundColor: '#e8f8f0',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  code: {
    color: '#9aa0a6',
    fontSize: 13,
    fontWeight: '600',
  },
  imageMock: {
    alignItems: 'center',
    backgroundColor: '#f0f6ff',
    borderColor: '#dbe7f7',
    borderRadius: 12,
    borderWidth: 1,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  imageText: {
    color: '#1e88e5',
    fontSize: 13,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    marginHorizontal: 13,
    rowGap: 3,
  },
  name: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default styles;
