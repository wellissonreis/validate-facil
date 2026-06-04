import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '../components/BottomTab';
import HomeHeader from '../components/HomeHeader';
import QuickShortcutCard from '../components/QuickShortcutCard';
import SummaryCard from '../components/SummaryCard';

const primaryGreen = '#05b163';

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
              onPress={shortcut.label === 'Entrada Rápida' ? openQuickEntry : undefined}
            />
          ))}
        </View>
      </ScrollView>

      <BottomTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  content: {
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  greeting: {
    marginTop: 16,
  },
  greetingTitle: {
    color: '#202124',
    fontSize: 25,
    fontWeight: '800',
  },
  greetingSubtitle: {
    color: '#6f747b',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    marginTop: 6,
  },
  sectionTitle: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    marginTop: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 16,
    columnGap: 8,
    elevation: 3,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: primaryGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  primaryButtonPressed: {
    backgroundColor: '#19c978',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
});
