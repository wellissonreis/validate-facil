import { StyleSheet } from 'react-native';

const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  content: {
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  greeting: {
    marginTop: 16,
  },
  greetingSubtitle: {
    color: '#6f747b',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    marginTop: 6,
  },
  greetingTitle: {
    color: '#202124',
    fontSize: 25,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 16,
    columnGap: 8,
    elevation: 3,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: primaryGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  primaryButtonPressed: {
    backgroundColor: '#19c978',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  sectionTitle: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    marginTop: 28,
  },
});

export default styles;
