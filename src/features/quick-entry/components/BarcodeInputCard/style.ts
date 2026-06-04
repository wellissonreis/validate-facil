import { StyleSheet } from 'react-native';

export const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#cfd4da',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    padding: 22,
    rowGap: 8,
  },
  input: {
    color: '#202124',
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    height: '100%',
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: '#f8fafb',
    borderColor: '#e5e8eb',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 14,
    width: '100%',
  },
  scanIcon: {
    alignItems: 'center',
    backgroundColor: '#e8f8f0',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 2,
    width: 68,
  },
  subtitle: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
  },
});

export default styles;
