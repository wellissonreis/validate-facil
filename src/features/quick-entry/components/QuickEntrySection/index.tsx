import { Text, View } from 'react-native';

import styles from './style';
import type { QuickEntrySectionProps } from './types';

export default function QuickEntrySection({ children, title }: QuickEntrySectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
