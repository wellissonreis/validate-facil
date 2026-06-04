import { Colors, Spacing } from '@/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.backgroundSelected,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    height: 72,
    maxWidth: 420,
    paddingHorizontal: 23,
    position: 'relative',
    width: '100%',
  },
  inputContainerFocused: {
    borderColor: Colors.light.textTerciary,
  },
  icon: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    marginRight: Spacing.four,
    width: 24,
  },
  inputLabel: {
    color: Colors.light.textTerciary,
    fontWeight: '500',
    left: 72,
    lineHeight: 16,
    position: 'absolute',
  },
  input: {
    color: Colors.light.text,
    flex: 1,
    fontSize: 18,
    height: 72,
    lineHeight: 20,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 24,
  },
});

export default styles;
