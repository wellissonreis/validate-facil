import { Ionicons } from '@expo/vector-icons';

export type SummaryCardProps = {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  title: string;
  value: number;
};
