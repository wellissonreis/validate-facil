import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import styles, { inactiveGray, primaryGreen } from './style';
import type { BottomTabProps, TabItem, TabNavigation, TabNavigationState, TabRoute } from './types';

const tabs: TabItem[] = [
  {
    icon: 'home-outline',
    label: 'Início',
    routeName: 'HomeTab',
    selectedIcon: 'home',
  },
  {
    icon: 'cube-outline',
    label: 'Produtos',
    routeName: 'ProductsTab',
    selectedIcon: 'cube',
  },
  {
    icon: 'search-outline',
    label: 'Consultar',
    routeName: 'ConsultationTab',
    selectedIcon: 'search',
  },
  {
    icon: 'bar-chart-outline',
    label: 'Relatórios',
    routeName: 'ReportsTab',
    selectedIcon: 'bar-chart',
  },
  {
    icon: 'ellipsis-horizontal',
    label: 'Mais',
    routeName: 'MoreTab',
    selectedIcon: 'ellipsis-horizontal-circle',
  },
];

function getTabRoute(tab: TabItem, state: TabNavigationState): TabRoute | undefined {
  return state.routes.find((route) => route.name === tab.routeName);
}

function TabButton({
  navigation,
  route,
  selected,
  tab,
}: {
  navigation: TabNavigation;
  route: TabRoute | undefined;
  selected: boolean;
  tab: TabItem;
}) {
  const pressProgress = useSharedValue(0);
  const activeProgress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withSpring(selected ? 1 : 0, {
      damping: 16,
      mass: 0.7,
      stiffness: 190,
    });
  }, [activeProgress, selected]);

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -5 * activeProgress.value },
      { scale: 1 - pressProgress.value * 0.06 + activeProgress.value * 0.03 },
    ],
  }));

  const animatedPillStyle = useAnimatedStyle(() => ({
    opacity: activeProgress.value,
    transform: [{ scale: 0.82 + activeProgress.value * 0.18 }],
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: activeProgress.value,
    transform: [{ scaleX: activeProgress.value }],
  }));

  const color = selected ? primaryGreen : inactiveGray;

  function navigate() {
    if (selected || !route) {
      return;
    }

    navigation.emit({
      canPreventDefault: true,
      target: route.key,
      type: 'tabPress',
    });

    navigation.navigate(route.name);
  }

  return (
    <Pressable
      accessibilityLabel={tab.label}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      key={tab.label}
      onPress={navigate}
      onPressIn={() => {
        pressProgress.value = withTiming(1, { duration: 90 });
      }}
      onPressOut={() => {
        pressProgress.value = withSpring(0, {
          damping: 13,
          stiffness: 220,
        });
      }}
      style={styles.pressable}
    >
      <Animated.View style={[styles.item, animatedItemStyle]}>
        <View style={styles.iconWrap}>
          <Animated.View style={[styles.selectedPill, animatedPillStyle]} />
          <Ionicons
            color={selected ? '#ffffff' : color}
            name={selected ? tab.selectedIcon : tab.icon}
            size={selected ? 24 : 22}
          />
        </View>
        <Text style={[styles.label, selected && styles.selectedLabel]} numberOfLines={1}>
          {tab.label}
        </Text>
        <Animated.View style={[styles.activeDot, animatedDotStyle]} />
      </Animated.View>
    </Pressable>
  );
}

export default function BottomTab({ navigation, state }: BottomTabProps) {
  return (
    <View style={styles.shell}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const route = getTabRoute(tab, state);

          return (
            <TabButton
              key={tab.label}
              navigation={navigation}
              route={route}
              selected={route ? state.routes[state.index]?.key === route.key : false}
              tab={tab}
            />
          );
        })}
      </View>
    </View>
  );
}
