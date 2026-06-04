import { Text, View } from 'react-native';

import styles from './style';
import type { ExpiringProductStatus, StatusBadgeProps } from './types';

export type { ExpiringProductStatus } from './types';

const statusStyles: Record<
  ExpiringProductStatus,
  { backgroundColor: string; borderColor: string; color: string }
> = {
  Atenção: {
    backgroundColor: '#fff4e5',
    borderColor: '#ffd7a8',
    color: '#e8710a',
  },
  Crítico: {
    backgroundColor: '#fdecec',
    borderColor: '#f7bdbd',
    color: '#d93025',
  },
  Ok: {
    backgroundColor: '#e9f7ef',
    borderColor: '#b9e4c9',
    color: '#0f9d58',
  },
  Vencido: {
    backgroundColor: '#fdecec',
    borderColor: '#f7bdbd',
    color: '#d93025',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusStyles[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.color }]}>{status}</Text>
    </View>
  );
}
