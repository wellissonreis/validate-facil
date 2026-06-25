import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ProductsStackParamList } from '@/navigation/types';
import {
  addProduct,
  addStockEntry,
  formatDateInput,
  formatProductDate,
  getProductDisplayDate,
  getProductByBarcode,
  NON_PERISHABLE_VALIDITY,
  parseProductDate,
} from '@/shared/storage/products';
import type { InitialStock, Product } from '@/shared/storage/products';

import QuickEntryHeader from '../components/QuickEntryHeader';
import QuickEntrySection from '../components/QuickEntrySection';
import styles from './style';

async function searchLocalProduct(barcode: string): Promise<Product | null> {
  return getProductByBarcode(barcode);
}

async function registerProductWithInitialStock(barcode: string, name: string, entry: InitialStock): Promise<void> {
  await addProduct({
    codigoBarras: barcode,
    nome: name,
    ...entry,
  });
}

async function registerStockEntry(productId: string, entry: InitialStock): Promise<void> {
  await addStockEntry(productId, entry);
}

export default function QuickEntryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [barcode, setBarcode] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [lot, setLot] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isExpirationModalOpen, setIsExpirationModalOpen] = useState(false);
  const scanLockedRef = useRef(false);
  const cameraGranted = cameraPermission?.granted ?? false;
  const cameraPermissionLoaded = cameraPermission !== null;
  const cameraCanAskAgain = cameraPermission?.canAskAgain ?? true;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function openScannerOnFocus() {
        if (cameraGranted) {
          scanLockedRef.current = false;
          setIsScannerOpen(true);
          return;
        }

        if (!cameraPermissionLoaded) {
          const permission = await requestCameraPermission();

          if (isActive && permission.granted) {
            scanLockedRef.current = false;
            setIsScannerOpen(true);
          }

          return;
        }

        if (!isActive) {
          return;
        }

        Alert.alert(
          'Câmera não autorizada',
          cameraCanAskAgain
            ? 'A permissão da câmera é necessária para escanear o código de barras.'
            : 'Ative a permissão da câmera nas configurações do aparelho para usar o scanner.',
        );
      }

      openScannerOnFocus();

      return () => {
        isActive = false;
        scanLockedRef.current = false;
        setIsScannerOpen(false);
        setIsExpirationModalOpen(false);
      };
    }, [cameraCanAskAgain, cameraGranted, cameraPermissionLoaded, requestCameraPermission]),
  );

  function handleChangeBarcode(value: string) {
    setBarcode(value);
    setFoundProduct(null);
    setHasSearched(false);
  }

  async function findProduct(trimmedBarcode: string) {
    try {
      const product = await searchLocalProduct(trimmedBarcode);

      setFoundProduct(product);
      setHasSearched(true);
      setName('');
    } catch {
      Alert.alert('Erro ao buscar', 'Não foi possível buscar o produto agora.');
    }
  }

  async function handleSearch() {
    const trimmedBarcode = barcode.trim();

    if (!trimmedBarcode) {
      Alert.alert('Código obrigatório', 'Informe ou escaneie o código de barras.');
      return;
    }

    await findProduct(trimmedBarcode);
  }

  async function handleToggleScanner() {
    if (isScannerOpen) {
      setIsScannerOpen(false);
      scanLockedRef.current = false;
      return;
    }

    const permission = cameraPermission?.granted ? cameraPermission : await requestCameraPermission();

    if (!permission.granted) {
      Alert.alert(
        'Câmera não autorizada',
        permission.canAskAgain
          ? 'A permissão da câmera é necessária para escanear o código de barras.'
          : 'Ative a permissão da câmera nas configurações do aparelho para usar o scanner.',
      );
      return;
    }

    scanLockedRef.current = false;
    setIsScannerOpen(true);
  }

  async function handleBarcodeScanned({ data }: BarcodeScanningResult) {
    const scannedBarcode = data.trim();

    if (scanLockedRef.current || !scannedBarcode) {
      return;
    }

    scanLockedRef.current = true;
    setIsScannerOpen(false);
    setBarcode(scannedBarcode);
    setFoundProduct(null);
    setHasSearched(false);
    setExpirationDate('');
    setIsExpirationModalOpen(true);

    await findProduct(scannedBarcode);
  }

  async function handleSave() {
    const trimmedBarcode = barcode.trim();
    const trimmedName = name.trim();
    const parsedQuantity = Number(quantity.replace(',', '.'));
    const parsedExpirationDate = expirationDate.trim()
      ? parseProductDate(expirationDate)
      : NON_PERISHABLE_VALIDITY;

    if (!trimmedBarcode) {
      Alert.alert('Código obrigatório', 'Informe ou escaneie o código de barras.');
      return;
    }

    if (!hasSearched) {
      Alert.alert('Busque o produto', 'Busque o código de barras antes de salvar.');
      return;
    }

    if (!foundProduct && !trimmedName) {
      Alert.alert('Nome obrigatório', 'Informe o nome do produto.');
      return;
    }

    if (!quantity.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade maior que zero.');
      return;
    }

    if (!parsedExpirationDate) {
      Alert.alert('Validade inválida', 'Informe a validade no formato DD/MM/AAAA.');
      return;
    }

    try {
      const initialStock: InitialStock = {
        quantidade: parsedQuantity,
        validade: parsedExpirationDate,
        lote: lot.trim() || undefined,
      };

      if (foundProduct) {
        await registerStockEntry(foundProduct.id, initialStock);
      } else {
        await registerProductWithInitialStock(trimmedBarcode, trimmedName, initialStock);
      }

      Alert.alert(foundProduct ? 'Entrada registrada' : 'Produto cadastrado', 'Estoque atualizado com sucesso.');
      navigation.popTo('Products');
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível cadastrar o produto agora.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuickEntryHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuickEntrySection title="1. Código de barras">
          <View style={styles.field}>
            <Text style={styles.label}>Código de barras</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={handleChangeBarcode}
              placeholder="Escaneie ou digite o código"
              placeholderTextColor="#9aa0a6"
              style={styles.input}
              value={barcode}
            />
          </View>

          <View style={styles.barcodeActions}>
            <Pressable
              onPress={handleToggleScanner}
              style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
            >
              <Ionicons color="#ffffff" name={isScannerOpen ? 'close-outline' : 'scan-outline'} size={22} />
              <Text style={styles.scanButtonText}>{isScannerOpen ? 'Fechar scanner' : 'Escanear código'}</Text>
            </Pressable>

            <Pressable
              onPress={handleSearch}
              style={({ pressed }) => [styles.searchButton, pressed && styles.searchButtonPressed]}
            >
              <Ionicons color="#05b163" name="keypad-outline" size={21} />
              <Text style={styles.searchButtonText}>Usar código digitado</Text>
            </Pressable>
          </View>

          {isScannerOpen ? (
            <View style={styles.scannerContainer}>
              <CameraView facing="back" onBarcodeScanned={handleBarcodeScanned} style={styles.scanner} />
              <Text style={styles.scannerHelp}>Aponte a câmera para o código de barras.</Text>
            </View>
          ) : null}
        </QuickEntrySection>

        {foundProduct ? (
          <QuickEntrySection title="2. Produto já cadastrado">
            <View style={styles.foundCard}>
              <View style={styles.foundIcon}>
                <Ionicons color="#05b163" name="checkmark" size={22} />
              </View>
              <View style={styles.foundInfo}>
                <Text style={styles.foundName}>{foundProduct.nome}</Text>
                <Text style={styles.foundText}>Este código já está em uso. Registre uma nova entrada abaixo.</Text>
                <Text style={styles.foundText}>Estoque atual: {foundProduct.quantidade} un</Text>
                <Text style={styles.foundText}>Validade: {formatProductDate(getProductDisplayDate(foundProduct))}</Text>
              </View>
            </View>
          </QuickEntrySection>
        ) : hasSearched ? (
          <QuickEntrySection title="2. Novo produto">
            <View style={styles.notFoundCard}>
              <Ionicons color="#f57c00" name="alert-circle-outline" size={22} />
              <Text style={styles.notFoundText}>Código não encontrado. Cadastre o produto abaixo.</Text>
            </View>

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
        ) : null}

        <QuickEntrySection title={foundProduct ? '3. Nova entrada' : '3. Estoque inicial'}>
          {!hasSearched ? <Text style={styles.helpText}>Busque o código de barras para continuar.</Text> : null}
          {foundProduct ? <Text style={styles.helpText}>A entrada será adicionada ao produto encontrado.</Text> : null}

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                editable={hasSearched}
                keyboardType="numeric"
                onChangeText={setQuantity}
                placeholder="Ex.: 12"
                placeholderTextColor="#9aa0a6"
                style={styles.input}
                value={quantity}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Validade (opcional)</Text>
              <TextInput
                editable={hasSearched}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                onChangeText={(value) => setExpirationDate(formatDateInput(value))}
                placeholder="Vazio = não perecível"
                placeholderTextColor="#9aa0a6"
                style={styles.input}
                value={expirationDate}
              />
            </View>
          </View>

          <View style={[styles.field, styles.lotField]}>
            <Text style={styles.label}>Lote opcional</Text>
            <TextInput
              editable={hasSearched}
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
          <Text style={styles.saveButtonText}>{foundProduct ? 'Salvar entrada' : 'Salvar produto'}</Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsExpirationModalOpen(false)}
        transparent
        visible={isExpirationModalOpen}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons color="#05b163" name="calendar-outline" size={28} />
            </View>
            <Text style={styles.modalTitle}>Qual é a validade?</Text>
            <Text style={styles.modalText}>
              Informe a data agora ou continue sem preencher para identificar o produto como não perecível.
            </Text>
            <View style={styles.modalField}>
              <Text style={styles.label}>Validade (opcional)</Text>
              <TextInput
                autoFocus
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                onChangeText={(value) => setExpirationDate(formatDateInput(value))}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#9aa0a6"
                style={styles.input}
                value={expirationDate}
              />
            </View>
            <Pressable
              onPress={() => {
                if (expirationDate.trim() && !parseProductDate(expirationDate)) {
                  Alert.alert('Validade inválida', 'Informe a validade no formato DD/MM/AAAA.');
                  return;
                }

                setIsExpirationModalOpen(false);
              }}
              style={({ pressed }) => [styles.modalPrimaryButton, pressed && styles.saveButtonPressed]}
            >
              <Text style={styles.saveButtonText}>{expirationDate ? 'Confirmar validade' : 'Continuar sem validade'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
