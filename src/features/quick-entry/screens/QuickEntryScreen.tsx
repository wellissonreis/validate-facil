import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';

import BarcodeInputCard from '../components/BarcodeInputCard';
import BatchInfoForm from '../components/BatchInfoForm';
import ProductFoundCard from '../components/ProductFoundCard';
import QuickEntryHeader from '../components/QuickEntryHeader';
import QuickEntrySection from '../components/QuickEntrySection';
import styles from './style';

export default function QuickEntryScreen() {
  function handleSave() {
    Alert.alert('Lote salvo', 'Entrada mockada registrada com sucesso.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuickEntryHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuickEntrySection title="1. Escanear ou digitar código de barras">
          <BarcodeInputCard />
        </QuickEntrySection>

        <QuickEntrySection title="2. Produto encontrado">
          <ProductFoundCard />
        </QuickEntrySection>

        <QuickEntrySection title="3. Informações do lote">
          <BatchInfoForm />
        </QuickEntrySection>

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
