import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import styles, { primaryGreen } from './style';
import type { BottomTabProps, TabItem } from './types';

const tabs: TabItem[] = [
  { href: '/home', icon: 'home', label: 'Início' },
  { href: '/expiring-products', icon: 'cube-outline', label: 'Produtos' },
  { href: '/quick-entry', icon: 'add-circle-outline', label: 'Entrada' },
  { href: '/reports', icon: 'bar-chart-outline', label: 'Relatórios' },
  { href: '/more', icon: 'ellipsis-horizontal', label: 'Mais' },
];

export default function BottomTab({ activeTab = 'Início' }: BottomTabProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = tab.label === activeTab;
        const color = selected ? primaryGreen : '#5f6368';

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={tab.label}
            onPress={() => router.push(tab.href)}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          >
            {selected && tab.label === 'Entrada' ? (
              <View style={styles.selectedAction}>
                <Ionicons color="#ffffff" name="add" size={26} />
              </View>
            ) : (
              <Ionicons color={color} name={tab.icon} size={23} />
            )}
            <Text style={[styles.label, selected && styles.selectedLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
