import { StyleSheet } from 'react-native';

export const primaryGreen = '#05b163';

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#eef0f3',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  choiceButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e8eb',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  choiceButtonPressed: {
    opacity: 0.72,
  },
  choiceButtonSelected: {
    backgroundColor: '#eef8f3',
    borderColor: '#9bd9b8',
  },
  choiceText: {
    color: '#202124',
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    backgroundColor: '#f7f9fa',
    padding: 16,
  },
  emptyText: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  field: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e8eb',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
    paddingHorizontal: 14,
    paddingVertical: 11,
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
  headerButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerTitle: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
  },
  input: {
    color: '#202124',
    fontSize: 15,
    fontWeight: '700',
    padding: 0,
  },
  label: {
    color: '#6f747b',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 7,
  },
  meta: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
  },
  productImage: {
    backgroundColor: '#eef8f3',
    borderRadius: 13,
    height: 48,
    width: 48,
  },
  productImageFallback: {
    alignItems: 'center',
    backgroundColor: '#eef8f3',
    borderRadius: 13,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  row: {
    alignItems: 'center',
    columnGap: 12,
    flexDirection: 'row',
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  summaryValue: {
    color: primaryGreen,
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    color: '#202124',
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default styles;
