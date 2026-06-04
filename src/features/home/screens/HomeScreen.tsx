import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '../components/BottomTab';
import HomeHeader from '../components/HomeHeader';
import QuickShortcutCard from '../components/QuickShortcutCard';
import SummaryCard from '../components/SummaryCard';
import styles from './style';

const summaryCards = [
  {
    color: '#e53935',
    icon: 'alert-circle-outline',
    title: 'Produtos vencidos',
    value: 42,
  },
  {
    color: '#f57c00',
    icon: 'time-outline',
    title: 'Vencem em 7 dias',
    value: 28,
  },
  {
    color: '#f4b400',
    icon: 'calendar-outline',
    title: 'Vencem em 15 dias',
    value: 46,
  },
  {
    color: '#1e88e5',
    icon: 'trending-down-outline',
    title: 'Estoque baixo',
    value: 19,
  },
] as const;

const shortcuts = [
  { icon: 'add-outline', label: 'Entrada Rápida' },
  { icon: 'hourglass-outline', label: 'Produtos Vencendo' },
  { icon: 'layers-outline', label: 'Estoque Baixo' },
  { icon: 'document-text-outline', label: 'Relatórios' },
] as const;

export default function HomeScreen() {
  function openQuickEntry() {
    router.push('/quick-entry');
  }

  function openExpiringProducts() {
    router.push('/expiring-products');
  }

  function openLowStock() {
    router.push('/low-stock');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Olá, João!</Text>
          <Text style={styles.greetingSubtitle}>Aqui está o resumo do seu estoque hoje.</Text>
        </View>

        <Text style={styles.sectionTitle}>Resumo do dia</Text>
        <View style={styles.grid}>
          {summaryCards.map((card) => (
            <SummaryCard
              color={card.color}
              icon={card.icon}
              key={card.title}
              onPress={openExpiringProducts}
              title={card.title}
              value={card.value}
            />
          ))}
        </View>

        <Pressable
          onPress={openQuickEntry}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Ionicons color="#ffffff" name="add" size={23} />
          <Text style={styles.primaryButtonText}>Registrar entrada</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Atalhos rápidos</Text>
        <View style={styles.grid}>
          {shortcuts.map((shortcut) => (
            <QuickShortcutCard
              icon={shortcut.icon}
              key={shortcut.label}
              label={shortcut.label}
              onPress={
                shortcut.label === 'Entrada Rápida'
                  ? openQuickEntry
                  : shortcut.label === 'Produtos Vencendo'
                    ? openExpiringProducts
                    : shortcut.label === 'Estoque Baixo'
                      ? openLowStock
                    : undefined
              }
            />
          ))}
        </View>
      </ScrollView>

      <BottomTab />
    </SafeAreaView>
  );
}
