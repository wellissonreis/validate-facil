import { StyleSheet } from 'react-native';

const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  emptyButton: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 14,
    columnGap: 8,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 18,
  },
  emptyButtonPressed: {
    backgroundColor: '#19c978',
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
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
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#edf0f2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
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
  searchInput: {
    backgroundColor: '#f5f6f7',
    borderRadius: 12,
    color: '#202124',
    fontSize: 15,
    height: 46,
    marginHorizontal: 14,
    marginVertical: 12,
    paddingHorizontal: 14,
  },
  table: {
    marginHorizontal: 10,
  },
  title: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default styles;
