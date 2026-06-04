import { Colors, Spacing } from '@/theme';
import { StyleSheet } from 'react-native';

const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginTop: 50,
    rowGap: 12,
    width: '100%',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    margin: 5,
    maxWidth: 420,
    width: '100%',
  },
  forgotPasswordText: {
    color: primaryGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  signInButton: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 15,
    height: 58,
    justifyContent: 'center',
    marginTop: Spacing.two,
    maxWidth: 420,
    width: '100%',
  },
  signInButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '700',
  },
  signInButtonPressed: {
    backgroundColor: '#19c978',
  },
  continueDivider: {
    alignItems: 'center',
    columnGap: Spacing.two,
    flexDirection: 'row',
    marginTop: Spacing.three,
    maxWidth: 420,
    width: '100%',
  },
  continueLine: {
    backgroundColor: Colors.light.backgroundSelected,
    flex: 1,
    height: 1,
  },
  continueText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.backgroundSelected,
    borderRadius: 15,
    borderWidth: 1,
    columnGap: Spacing.two,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    maxWidth: 420,
    width: '100%',
    marginTop: 12
  },
  googleButtonPressed: {
    backgroundColor: '#F8F9FB',
    borderColor: '#D8DAE0',
  },
  googleButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;
