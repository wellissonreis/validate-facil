import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#e8f7ef',
    borderRadius: 18,
    height: 64,
    justifyContent: 'center',
    marginBottom: 18,
    width: 64,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  subtitle: {
    color: '#6f747b',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    color: '#202124',
    fontSize: 26,
    fontWeight: '800',
  },
});

export default styles;
