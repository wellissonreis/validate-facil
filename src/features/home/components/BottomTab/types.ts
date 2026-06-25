import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ParamListBase, RouteProp } from '@react-navigation/native';

export type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  routeName: string;
  selectedIcon: keyof typeof Ionicons.glyphMap;
};

export type BottomTabProps = BottomTabBarProps;

export type TabRoute = RouteProp<ParamListBase, string>;

export type TabNavigationState = BottomTabBarProps['state'];

export type TabNavigation = BottomTabBarProps['navigation'];
