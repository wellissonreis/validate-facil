import { StyleSheet } from 'react-native';

export const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    columnGap: 7,
    flexDirection: 'row',
  },
  brandText: {
    color: primaryGreen,
    fontSize: 19,
    fontWeight: '800',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    zIndex: 10,
  },
  headerSpacer: {
    width: 40,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderColor: '#eef2f4',
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    minWidth: 190,
    paddingVertical: 6,
    position: 'absolute',
    left: 0,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    top: 42,
  },
  menuArea: {
    position: 'relative',
  },
  menuButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  menuButtonPressed: {
    backgroundColor: '#f1f3f4',
  },
  menuDivider: {
    backgroundColor: '#eef2f4',
    height: 1,
    marginVertical: 4,
  },
  menuItem: {
    alignItems: 'center',
    columnGap: 10,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuItemPressed: {
    backgroundColor: '#f7f9fa',
  },
  menuItemText: {
    color: '#202124',
    fontSize: 15,
    fontWeight: '700',
  },
  signOutText: {
    color: '#d93025',
  },
});

export default styles;
