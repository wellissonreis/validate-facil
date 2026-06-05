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
});

export default styles;
