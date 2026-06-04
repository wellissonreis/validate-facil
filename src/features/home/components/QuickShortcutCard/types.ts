import { Ionicons } from '@expo/vector-icons';

export type QuickShortcutCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};
