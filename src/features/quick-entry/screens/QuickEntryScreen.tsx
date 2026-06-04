import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

import BarcodeInputCard from '../components/BarcodeInputCard';
import BatchInfoForm from '../components/BatchInfoForm';
import ProductFoundCard from '../components/ProductFoundCard';
import QuickEntryHeader from '../components/QuickEntryHeader';

const primaryGreen = '#05b163';

export default function QuickEntryScreen() {
  function handleSave() {
    Alert.alert('Lote salvo', 'Entrada mockada registrada com sucesso.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuickEntryHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="1. Escanear ou digitar código de barras">
          <BarcodeInputCard />
        </Section>

        <Section title="2. Produto encontrado">
          <ProductFoundCard />
        </Section>

        <Section title="3. Informações do lote">
          <BatchInfoForm />
        </Section>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
        >
          <Ionicons color="#ffffff" name="save-outline" size={22} />
          <Text style={styles.saveButtonText}>Salvar lote</Text>
        </Pressable>
      </ScrollView>

      <BottomTab activeTab="Entrada" />
    </SafeAreaView>
  );
}

type SectionProps = {
  children: React.ReactNode;
  title: string;
};

function Section({ children, title }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  content: {
    backgroundColor: '#ffffff',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 16,
    columnGap: 8,
    elevation: 3,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    marginTop: 26,
    shadowColor: primaryGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  saveButtonPressed: {
    backgroundColor: '#19c978',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 13,
  },
});
