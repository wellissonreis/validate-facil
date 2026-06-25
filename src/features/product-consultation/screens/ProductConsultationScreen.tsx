import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import type { BarcodeScanningResult } from 'expo-camera';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useCallback, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootTabParamList } from '@/navigation/types';
import {
  formatProductDate,
  getProductByBarcode,
  getProductDisplayDate,
  getProductLots,
  getProducts,
  isNonPerishableValidity,
} from '@/shared/storage/products';
import type { Product, ProductLot } from '@/shared/storage/products';

import styles, { primaryGreen } from './style';

type QueryResult = {
  matches: Product[];
  product: Product | null;
};

function ProductConsultationHeader() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        style={styles.headerButton}
      >
        <Ionicons color="#202124" name="chevron-back" size={27} />
      </Pressable>
      <Text style={styles.headerTitle}>Consultar Produto</Text>
      <Pressable
        accessibilityLabel="Cadastrar produto"
        onPress={() => navigation.navigate('ProductsTab', { screen: 'QuickEntry' })}
        style={styles.headerButton}
      >
        <Ionicons color="#202124" name="add" size={26} />
      </Pressable>
    </View>
  );
}

function normalizeQuery(value: string) {
  return value.trim().toLocaleLowerCase();
}

async function findProducts(query: string): Promise<QueryResult> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return { matches: [], product: null };
  }

  const barcodeProduct = await getProductByBarcode(trimmedQuery);

  if (barcodeProduct) {
    return { matches: [barcodeProduct], product: barcodeProduct };
  }

  const normalizedQuery = normalizeQuery(trimmedQuery);
  const products = await getProducts();
  const matches = products.filter(
    (product) =>
      product.nome.toLocaleLowerCase().includes(normalizedQuery) ||
      product.codigoBarras?.toLocaleLowerCase().includes(normalizedQuery),
  );

  return { matches, product: matches.length === 1 ? matches[0] : null };
}

function getLotStatus(validity: string) {
  if (isNonPerishableValidity(validity)) {
    return { color: '#1e88e5', label: 'Não perecível' };
  }

  const [year, month, day] = validity.split('-').map(Number);
  const expirationDate = new Date(year, month - 1, day);
  const today = new Date();

  expirationDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(expirationDate.getTime())) {
    return { color: '#6f747b', label: 'Sem data' };
  }

  if (expirationDate < today) {
    return { color: '#d93025', label: 'Vencido' };
  }

  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / 86400000);

  if (daysUntilExpiration <= 7) {
    return { color: '#f57c00', label: 'Atenção' };
  }

  return { color: primaryGreen, label: 'Ok' };
}

function formatEntryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('pt-BR');
}

function getDisplayLots(product: Product): ProductLot[] {
  const lots = getProductLots(product);

  if (lots.length > 0) {
    return lots;
  }

  return [
    {
      id: product.id,
      codigo: product.lote || 'Sem lote',
      criadoEm: product.criadoEm,
      quantidade: product.quantidade,
      atualizadoEm: product.atualizadoEm,
      validade: product.validade,
    },
  ];
}

function ProductSummary({ product }: { product: Product }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.productIcon}>
        {product.imageUri ? (
          <Image contentFit="cover" source={{ uri: product.imageUri }} style={styles.productImage} />
        ) : (
          <MaterialCommunityIcons color={primaryGreen} name="bottle-soda-classic-outline" size={48} />
        )}
      </View>
      <View style={styles.summaryInfo}>
        <Text style={styles.productName}>{product.nome}</Text>
        <Text style={styles.productMeta}>Código: {product.codigoBarras || 'Não informado'}</Text>
        <Text style={styles.productMeta}>Cadastro: {formatEntryDate(product.criadoEm)}</Text>
      </View>
    </View>
  );
}

function InfoGrid({ product }: { product: Product }) {
  const lots = getDisplayLots(product);

  return (
    <View style={styles.infoGrid}>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Estoque atual</Text>
        <Text style={styles.stockValue}>{product.quantidade}</Text>
        <Text style={styles.infoMeta}>unidades</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Validade mais próxima</Text>
        <Text style={styles.infoValue}>{formatProductDate(getProductDisplayDate(product))}</Text>
        <Text style={styles.infoMeta}>{lots.length} lote(s)</Text>
      </View>
    </View>
  );
}

function ProductLots({ product }: { product: Product }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lotes</Text>
        <Text style={styles.greenText}>{getDisplayLots(product).length} encontrado(s)</Text>
      </View>

      {getDisplayLots(product).map((lot) => {
        const status = getLotStatus(lot.validade);

        return (
          <View key={lot.id} style={styles.lotRow}>
            <View style={styles.lotMain}>
              <Text style={styles.lotCode}>{lot.codigo}</Text>
              <Text style={styles.lotMeta}>Validade: {formatProductDate(lot.validade)}</Text>
            </View>
            <View style={styles.lotAside}>
              <Text style={styles.lotQuantity}>{lot.quantidade} un</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                <Text style={styles.statusText}>{status.label}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function MatchList({ matches, onSelect }: { matches: Product[]; onSelect: (product: Product) => void }) {
  if (matches.length <= 1) {
    return null;
  }

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Produtos encontrados</Text>
      {matches.map((product) => (
        <Pressable
          key={product.id}
          onPress={() => onSelect(product)}
          style={({ pressed }) => [styles.matchRow, pressed && styles.matchRowPressed]}
        >
          {product.imageUri ? (
            <Image contentFit="cover" source={{ uri: product.imageUri }} style={styles.matchImage} />
          ) : (
            <View style={styles.matchIcon}>
              <Ionicons color={primaryGreen} name="cube-outline" size={20} />
            </View>
          )}
          <View style={styles.matchInfo}>
            <Text numberOfLines={1} style={styles.matchName}>
              {product.nome}
            </Text>
            <Text numberOfLines={1} style={styles.matchMeta}>
              {product.codigoBarras || 'Sem código'} - {product.quantidade} un
            </Text>
          </View>
          <Ionicons color="#7a7f85" name="chevron-forward" size={20} />
        </Pressable>
      ))}
    </View>
  );
}

export default function ProductConsultationScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [matches, setMatches] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const scanLockedRef = useRef(false);
  const cameraGranted = cameraPermission?.granted ?? false;
  const cameraPermissionLoaded = cameraPermission !== null;
  const cameraCanAskAgain = cameraPermission?.canAskAgain ?? true;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadTotalProducts() {
        const storedProducts = await getProducts();

        if (isActive) {
          setTotalProducts(storedProducts.length);
        }
      }

      loadTotalProducts();

      return () => {
        isActive = false;
      };
    }, []),
  );

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
      };
    }, [cameraCanAskAgain, cameraGranted, cameraPermissionLoaded, requestCameraPermission]),
  );

  function handleChangeQuery(value: string) {
    setQuery(value);
    setProduct(null);
    setMatches([]);
    setHasSearched(false);
  }

  async function handleSearch(nextQuery = query) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      Alert.alert('Código obrigatório', 'Informe ou escaneie o código de barras.');
      return;
    }

    try {
      const result = await findProducts(trimmedQuery);

      setProduct(result.product);
      setMatches(result.matches);
      setHasSearched(true);
    } catch {
      Alert.alert('Erro ao consultar', 'Não foi possível consultar o produto agora.');
    }
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
    setQuery(scannedBarcode);
    await handleSearch(scannedBarcode);
  }

  function handleSelectProduct(selectedProduct: Product) {
    setProduct(selectedProduct);
    setMatches([selectedProduct]);
    setHasSearched(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProductConsultationHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchCard}>
          <View style={styles.searchHeader}>
            <View style={styles.searchIcon}>
              <Ionicons color={primaryGreen} name="barcode-outline" size={24} />
            </View>
            <View style={styles.searchTitleGroup}>
              <Text style={styles.searchTitle}>Consulta rápida</Text>
              <Text style={styles.searchSubtitle}>{totalProducts} produto(s) no estoque</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Código de barras ou nome</Text>
            <TextInput
              keyboardType="default"
              onChangeText={handleChangeQuery}
              onSubmitEditing={() => handleSearch()}
              placeholder="Bipe, escaneie ou digite"
              placeholderTextColor="#9aa0a6"
              returnKeyType="search"
              style={styles.input}
              value={query}
            />
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={handleToggleScanner}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            >
              <Ionicons color="#ffffff" name={isScannerOpen ? 'close-outline' : 'scan-outline'} size={21} />
              <Text style={styles.primaryButtonText}>{isScannerOpen ? 'Fechar scanner' : 'Escanear código'}</Text>
            </Pressable>

            <Pressable
              onPress={() => handleSearch()}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            >
              <Ionicons color={primaryGreen} name="keypad-outline" size={21} />
              <Text style={styles.secondaryButtonText}>Buscar digitado</Text>
            </Pressable>
          </View>

          {isScannerOpen ? (
            <View style={styles.scannerContainer}>
              <CameraView facing="back" onBarcodeScanned={handleBarcodeScanned} style={styles.scanner} />
              <Text style={styles.scannerHelp}>Aponte a câmera para o código de barras.</Text>
            </View>
          ) : null}
        </View>

        {product ? (
          <>
            <ProductSummary product={product} />
            <InfoGrid product={product} />
            <ProductLots product={product} />
            <Pressable
              onPress={() => navigation.navigate('ProductsTab', { params: { id: product.id }, screen: 'ProductDetail' })}
              style={({ pressed }) => [styles.detailButton, pressed && styles.detailButtonPressed]}
            >
              <Ionicons color={primaryGreen} name="create-outline" size={21} />
              <Text style={styles.detailButtonText}>Abrir cadastro completo</Text>
            </Pressable>
          </>
        ) : (
          <>
            <MatchList matches={matches} onSelect={handleSelectProduct} />

            {hasSearched && matches.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons color="#f57c00" name="alert-circle-outline" size={30} />
                <Text style={styles.emptyTitle}>Produto não encontrado</Text>
                <Text style={styles.emptyText}>Cadastre o produto para acompanhar estoque, validade e lotes.</Text>
                <Pressable
                  onPress={() => navigation.navigate('ProductsTab', { screen: 'QuickEntry' })}
                  style={({ pressed }) => [styles.emptyButton, pressed && styles.emptyButtonPressed]}
                >
                  <Ionicons color="#ffffff" name="add" size={20} />
                  <Text style={styles.emptyButtonText}>Cadastrar produto</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
