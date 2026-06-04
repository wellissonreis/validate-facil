import { StyleSheet } from 'react-native';

const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#edf0f2',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    flex: 1,
    height: 44,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  buttons: {
    columnGap: 10,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#30343a',
    fontSize: 14,
    fontWeight: '800',
  },
  container: {
    backgroundColor: '#ffffff',
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  description: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 13,
  },
  pressedButton: {
    backgroundColor: '#f5fbf8',
  },
  selectedButton: {
    backgroundColor: primaryGreen,
    borderColor: primaryGreen,
    shadowColor: primaryGreen,
    shadowOpacity: 0.18,
  },
  selectedButtonText: {
    color: '#ffffff',
  },
});

export default styles;
