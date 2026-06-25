import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QuickEntrySection from '@/features/quick-entry/components/QuickEntrySection';
import styles from '@/features/quick-entry/screens/style';
import type { ProductsStackParamList } from '@/navigation/types';
import {
  formatProductDate,
  getProductByBarcode,
  getProductDisplayDate,
  getProductLots,
  removeStockOutput,
} from '@/shared/storage/products';
import type { Product } from '@/shared/storage/products';

import StockOutputHeader from '../components/StockOutputHeader';

async function searchLocalProduct(barcode: string): Promise<Product | null> {
  return getProductByBarcode(barcode);
}

export default function StockOutputScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [barcode, setBarcode] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [selectedLotId, setSelectedLotId] = useState<string | undefined>();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scanLockedRef = useRef(false);

  function handleChangeBarcode(value: string) {
    setBarcode(value);
    setFoundProduct(null);
    setSelectedLotId(undefined);
    setHasSearched(false);
  }

  async function findProduct(trimmedBarcode: string) {
    try {
      const product = await searchLocalProduct(trimmedBarcode);

      setFoundProduct(product);
      setSelectedLotId(undefined);
      setHasSearched(true);
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

    await findProduct(scannedBarcode);
  }

  async function handleSave() {
    const parsedQuantity = Number(quantity.replace(',', '.'));

    if (!foundProduct) {
      Alert.alert('Produto obrigatório', 'Busque um produto cadastrado antes de registrar a saída.');
      return;
    }

    if (!quantity.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade maior que zero.');
      return;
    }

    if (parsedQuantity > foundProduct.quantidade) {
      Alert.alert('Estoque insuficiente', `Estoque atual: ${foundProduct.quantidade} un.`);
      return;
    }

    try {
      await removeStockOutput(foundProduct.id, { lotId: selectedLotId, quantidade: parsedQuantity });
      Alert.alert('Saída salva', 'Estoque atualizado com sucesso.');
      navigation.popTo('Products');
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível salvar a saída agora.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StockOutputHeader />

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

          <Pressable
            onPress={handleSearch}
            style={({ pressed }) => [styles.searchButton, pressed && styles.searchButtonPressed]}
          >
            <Ionicons color="#05b163" name="barcode-outline" size={21} />
            <Text style={styles.searchButtonText}>Buscar código</Text>
          </Pressable>

          <Pressable
            onPress={handleToggleScanner}
            style={({ pressed }) => [styles.searchButton, pressed && styles.searchButtonPressed]}
          >
            <Ionicons color="#05b163" name={isScannerOpen ? 'close-outline' : 'camera-outline'} size={21} />
            <Text style={styles.searchButtonText}>{isScannerOpen ? 'Fechar scanner' : 'Abrir scanner'}</Text>
          </Pressable>

          {isScannerOpen ? (
            <View style={styles.scannerContainer}>
              <CameraView facing="back" onBarcodeScanned={handleBarcodeScanned} style={styles.scanner} />
              <Text style={styles.scannerHelp}>Aponte a câmera para o código de barras.</Text>
            </View>
          ) : null}
        </QuickEntrySection>

        {foundProduct ? (
          <QuickEntrySection title="2. Produto encontrado">
            <View style={styles.foundCard}>
              <View style={styles.foundIcon}>
                <Ionicons color="#05b163" name="checkmark" size={22} />
              </View>
              <View style={styles.foundInfo}>
                <Text style={styles.foundName}>{foundProduct.nome}</Text>
                <Text style={styles.foundText}>Estoque atual: {foundProduct.quantidade} un</Text>
                <Text style={styles.foundText}>
                  Validade: {formatProductDate(getProductDisplayDate(foundProduct))}
                </Text>
              </View>
            </View>
          </QuickEntrySection>
        ) : hasSearched ? (
          <QuickEntrySection title="2. Produto não encontrado">
            <View style={styles.notFoundCard}>
              <Ionicons color="#f57c00" name="alert-circle-outline" size={22} />
              <Text style={styles.notFoundText}>Cadastre o produto antes de registrar uma saída.</Text>
            </View>
          </QuickEntrySection>
        ) : null}

        <QuickEntrySection title="3. Saída do estoque">
          {!hasSearched ? <Text style={styles.helpText}>Busque o código de barras para continuar.</Text> : null}

          <View style={styles.field}>
            <Text style={styles.label}>Quantidade de saída</Text>
            <TextInput
              editable={Boolean(foundProduct)}
              keyboardType="numeric"
              onChangeText={setQuantity}
              placeholder="Ex.: 3"
              placeholderTextColor="#9aa0a6"
              style={styles.input}
              value={quantity}
            />
          </View>

          {foundProduct && getProductLots(foundProduct).length > 0 ? (
            <View style={styles.lotField}>
              <Text style={styles.label}>Lote de saída</Text>
              <Pressable
                onPress={() => setSelectedLotId(undefined)}
                style={({ pressed }) => [
                  styles.searchButton,
                  !selectedLotId && styles.searchButtonPressed,
                  pressed && styles.searchButtonPressed,
                ]}
              >
                <Ionicons color="#05b163" name="shuffle-outline" size={19} />
                <Text style={styles.searchButtonText}>Automático por validade</Text>
              </Pressable>
              {getProductLots(foundProduct).map((lot) => (
                <Pressable
                  key={lot.id}
                  onPress={() => setSelectedLotId(lot.id)}
                  style={({ pressed }) => [
                    styles.searchButton,
                    selectedLotId === lot.id && styles.searchButtonPressed,
                    pressed && styles.searchButtonPressed,
                  ]}
                >
                  <Ionicons
                    color="#05b163"
                    name={selectedLotId === lot.id ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                    size={19}
                  />
                  <Text style={styles.searchButtonText}>
                    {lot.codigo} - {lot.quantidade} un - {formatProductDate(lot.validade)}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </QuickEntrySection>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
        >
          <Ionicons color="#ffffff" name="remove-circle-outline" size={22} />
          <Text style={styles.saveButtonText}>Salvar saída</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
