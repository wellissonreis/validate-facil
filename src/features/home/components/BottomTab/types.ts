import { Ionicons } from '@expo/vector-icons';
import { Href } from 'expo-router';

export type TabItem = {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export type BottomTabProps = {
  activeTab?: string;
};
