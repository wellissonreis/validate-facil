import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';
import { addProduct, parseProductDate } from '@/shared/storage/products';

import QuickEntryHeader from '../components/QuickEntryHeader';
import QuickEntrySection from '../components/QuickEntrySection';
import styles from './style';

export default function QuickEntryScreen() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [lot, setLot] = useState('');

  async function handleSave() {
    const trimmedName = name.trim();
    const parsedQuantity = Number(quantity.replace(',', '.'));
    const parsedExpirationDate = parseProductDate(expirationDate);

    if (!trimmedName) {
      Alert.alert('Nome obrigatório', 'Informe o nome do produto.');
      return;
    }

    if (!quantity.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade numérica válida.');
      return;
    }

    if (!parsedExpirationDate) {
      Alert.alert('Validade inválida', 'Informe a validade no formato DD/MM/AAAA.');
      return;
    }

    try {
      await addProduct({
        nome: trimmedName,
        quantidade: parsedQuantity,
        validade: parsedExpirationDate,
        lote: lot.trim() || undefined,
      });

      Alert.alert('Produto salvo', 'Produto cadastrado com sucesso.');
      router.replace('/products');
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível cadastrar o produto agora.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuickEntryHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuickEntrySection title="1. Produto">
          <View style={styles.field}>
            <Text style={styles.label}>Nome do produto</Text>
            <TextInput
              onChangeText={setName}
              placeholder="Ex.: Leite UHT Integral 1L"
              placeholderTextColor="#9aa0a6"
              style={styles.input}
              value={name}
            />
          </View>
        </QuickEntrySection>

        <QuickEntrySection title="2. Estoque e validade">
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={setQuantity}
                placeholder="Ex.: 12"
                placeholderTextColor="#9aa0a6"
                style={styles.input}
                value={quantity}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Validade</Text>
              <TextInput
                keyboardType="numbers-and-punctuation"
                onChangeText={setExpirationDate}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#9aa0a6"
                style={styles.input}
                value={expirationDate}
              />
            </View>
          </View>

          <View style={[styles.field, styles.lotField]}>
            <Text style={styles.label}>Lote</Text>
            <TextInput
              onChangeText={setLot}
              placeholder="Ex.: 250510-01"
              placeholderTextColor="#9aa0a6"
              style={styles.input}
              value={lot}
            />
          </View>
        </QuickEntrySection>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
        >
          <Ionicons color="#ffffff" name="save-outline" size={22} />
          <Text style={styles.saveButtonText}>Salvar produto</Text>
        </Pressable>
      </ScrollView>

      <BottomTab activeTab="Entrada" />
    </SafeAreaView>
  );
}
