import { StyleSheet } from 'react-native';

const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#ffffff',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  field: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e8eb',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minWidth: 150,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '700',
    padding: 0,
  },
  label: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  lotField: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 16,
    columnGap: 8,
    elevation: 3,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    marginTop: 26,
    shadowColor: primaryGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  saveButtonPressed: {
    backgroundColor: '#19c978',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
});

export default styles;
