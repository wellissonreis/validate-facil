import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ParamListBase, RouteProp } from '@react-navigation/native';

import type { RootTabParamList } from '@/navigation/types';

export type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  routeName: keyof RootTabParamList;
  selectedIcon: keyof typeof Ionicons.glyphMap;
};

export type BottomTabProps = BottomTabBarProps;

export type TabRoute = RouteProp<ParamListBase, string>;

export type TabNavigationState = BottomTabBarProps['state'];

export type TabNavigation = BottomTabBarProps['navigation'];
