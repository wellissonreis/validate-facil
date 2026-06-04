import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

type BottomTabProps = {
  activeTab?: string;
};

const tabs: TabItem[] = [
  { icon: 'home', label: 'Início' },
  { icon: 'cube-outline', label: 'Produtos' },
  { icon: 'add-circle-outline', label: 'Entrada' },
  { icon: 'bar-chart-outline', label: 'Relatórios' },
  { icon: 'ellipsis-horizontal', label: 'Mais' },
];

const primaryGreen = '#05b163';

export default function BottomTab({ activeTab = 'Início' }: BottomTabProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = tab.label === activeTab;
        const color = selected ? primaryGreen : '#5f6368';

        return (
          <View key={tab.label} style={styles.item}>
            {selected && tab.label === 'Entrada' ? (
              <View style={styles.selectedAction}>
                <Ionicons color="#ffffff" name="add" size={26} />
              </View>
            ) : (
              <Ionicons color={color} name={tab.icon} size={23} />
            )}
            <Text style={[styles.label, selected && styles.selectedLabel]}>{tab.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopColor: '#edf0f2',
    borderTopWidth: 1,
    elevation: 10,
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 4,
  },
  label: {
    color: '#5f6368',
    fontSize: 11,
    fontWeight: '700',
  },
  selectedLabel: {
    color: primaryGreen,
  },
  selectedAction: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginTop: -22,
    shadowColor: primaryGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    width: 48,
  },
});
