import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 70,
  },
  emptyText: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
  },
  listContent: {
    backgroundColor: '#ffffff',
    flexGrow: 1,
    paddingBottom: 18,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  table: {
    marginHorizontal: 10,
  },
  updateButton: {
    alignItems: 'center',
    backgroundColor: '#05b163',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  updateButtonPressed: {
    backgroundColor: '#19c978',
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  updateCard: {
    backgroundColor: '#f5fbf8',
    borderColor: '#d8f0e4',
    borderRadius: 14,
    borderWidth: 1,
    margin: 12,
    padding: 14,
  },
  updateInput: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e8eb',
    borderRadius: 12,
    borderWidth: 1,
    color: '#202124',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    height: 46,
    paddingHorizontal: 12,
  },
  updateRow: {
    columnGap: 10,
    flexDirection: 'row',
    marginTop: 12,
  },
  updateText: {
    color: '#5f6368',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  updateTitle: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default styles;
