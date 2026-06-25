import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ProductsStackParamList } from '@/navigation/types';
import { pickAndPersistProductImage } from '@/shared/media/productImages';
import {
  formatDateInput,
  formatProductDate,
  getProductById,
  getProductDisplayDate,
  getProductLots,
  getStockMovements,
  isNonPerishableValidity,
  NON_PERISHABLE_VALIDITY,
  parseProductDate,
  removeProduct,
  type Product,
  type StockMovement,
  updateProduct,
  updateProductImage,
} from '@/shared/storage/products';

import styles, { primaryGreen } from './style';
import type { LotStatus } from './types';

type ProductForm = {
  barcode: string;
  expirationDate: string;
  lot: string;
  name: string;
  quantity: string;
};

function toProductForm(product: Product): ProductForm {
  return {
    barcode: product.codigoBarras ?? '',
    expirationDate: isNonPerishableValidity(product.validade) ? '' : formatProductDate(product.validade),
    lot: product.lote ?? '',
    name: product.nome,
    quantity: String(product.quantidade),
  };
}

function getDateStatus(value: string): LotStatus {
  if (isNonPerishableValidity(value)) {
    return 'Não perecível';
  }

  const [year, month, day] = value.split('-').map(Number);
  const expirationDate = new Date(year, month - 1, day);
  const today = new Date();

  expirationDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expirationDate < today ? 'Crítico' : 'Ok';
}

function formatRegistrationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('pt-BR');
}

function ProductDetailHeader({
  isEditing,
  onCancelEdit,
  onStartEdit,
}: {
  isEditing: boolean;
  onCancelEdit: () => void;
  onStartEdit: () => void;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Ionicons color="#202124" name="chevron-back" size={27} />
      </Pressable>
      <Text style={styles.headerTitle}>Detalhe do Produto</Text>
      <Pressable
        accessibilityLabel={isEditing ? 'Cancelar edição' : 'Editar produto'}
        onPress={isEditing ? onCancelEdit : onStartEdit}
        style={styles.headerButton}
      >
        <Ionicons color="#202124" name={isEditing ? 'close' : 'create-outline'} size={25} />
      </Pressable>
    </View>
  );
}

function ProductSummary({ onChangeImage, product }: { onChangeImage: () => void; product: Product }) {
  return (
    <View style={styles.summary}>
      <Pressable onPress={onChangeImage} style={styles.productImageCard}>
        {product.imageUri ? (
          <Image contentFit="cover" source={{ uri: product.imageUri }} style={styles.productImage} />
        ) : (
          <MaterialCommunityIcons color={primaryGreen} name="bottle-soda-classic-outline" size={50} />
        )}
        <View style={styles.imageActionBadge}>
          <Ionicons color="#ffffff" name="camera-outline" size={14} />
        </View>
      </Pressable>
      <View style={styles.summaryText}>
        <Text style={styles.productName}>{product.nome}</Text>
        <Text style={styles.productBrand}>Cadastro: {formatRegistrationDate(product.criadoEm)}</Text>
      </View>
    </View>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <Ionicons color="#6f747b" name={icon} size={31} />
    </View>
  );
}

function StockCard({ product }: { product: Product }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardLabel}>Estoque atual</Text>
        <View style={styles.stockValueRow}>
          <Text style={styles.stockValue}>{product.quantidade}</Text>
          <Text style={styles.stockUnit}>un</Text>
        </View>
      </View>
      <View style={styles.greenIconBox}>
        <Ionicons color={primaryGreen} name="cube-outline" size={28} />
      </View>
    </View>
  );
}

function StatusDot({ status }: { status: LotStatus }) {
  const color =
    status === 'Crítico' ? '#d93025' : status === 'Atenção' ? '#f57c00' : status === 'Não perecível' ? '#1e88e5' : primaryGreen;

  return <View style={[styles.statusDot, { backgroundColor: color }]} />;
}

function ProductLotsCard({ product }: { product: Product }) {
  const lots = getProductLots(product);
  const entries =
    lots.length > 0
      ? lots
      : [
          {
            id: product.id,
            codigo: product.lote || 'Sem lote',
            quantidade: product.quantidade,
            validade: product.validade,
          },
        ];

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lotes cadastrados</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.greenText}>{lots.length > 0 ? `${lots.length} lote(s)` : 'Sem lote'}</Text>
          <Ionicons color="#7a7f85" name="chevron-forward" size={19} />
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.subTitle}>Validade por lote</Text>

      {entries.map((entry) => {
        const status = getDateStatus(entry.validade);

        return (
          <View key={entry.id} style={styles.lotRow}>
            <Text style={styles.rowDate}>{entry.codigo}</Text>
            <Text style={styles.rowDate}>{formatProductDate(entry.validade)}</Text>
            <Text style={styles.rowQuantity}>{entry.quantidade} un</Text>
            <View style={styles.statusCell}>
              <StatusDot status={status} />
              <Text style={styles.rowStatus}>{status}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function formatMovementType(type: StockMovement['type']): string {
  const labels: Record<StockMovement['type'], string> = {
    ajuste: 'Ajuste',
    correcao_manual: 'Correção',
    entrada: 'Entrada',
    remocao_vencimento: 'Vencimento',
    saida: 'Saída',
  };

  return labels[type];
}

function ProductHistoryCard({ movements }: { movements: StockMovement[] }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Histórico de movimentação</Text>
        <Text style={styles.greenText}>{movements.length} registro(s)</Text>
      </View>
      <View style={styles.divider} />

      {movements.slice(0, 8).map((movement) => (
        <View key={movement.id} style={styles.historyRow}>
          <Text style={styles.rowDate}>{formatRegistrationDate(movement.createdAt)}</Text>
          <Text style={styles.rowQuantity}>
            {movement.quantityDelta > 0 ? '+' : ''}
            {movement.quantityDelta} un
          </Text>
          <Text style={styles.lotText}>
            {formatMovementType(movement.type)}
            {movement.lotCode ? ` - ${movement.lotCode}` : ''}
          </Text>
        </View>
      ))}

      {movements.length === 0 ? <Text style={styles.emptyText}>Nenhuma movimentação registrada.</Text> : null}
    </View>
  );
}

function EditProductForm({
  form,
  hasLots,
  onChangeForm,
  onSave,
}: {
  form: ProductForm;
  hasLots: boolean;
  onChangeForm: (form: ProductForm) => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Editar produto</Text>

      <View style={styles.editField}>
        <Text style={styles.cardLabel}>Código de barras</Text>
        <TextInput
          keyboardType="number-pad"
          onChangeText={(barcode) => onChangeForm({ ...form, barcode })}
          placeholder="Ex.: 7896058201234"
          placeholderTextColor="#9aa0a6"
          style={styles.editInput}
          value={form.barcode}
        />
      </View>

      <View style={styles.editField}>
        <Text style={styles.cardLabel}>Nome do produto</Text>
        <TextInput
          onChangeText={(name) => onChangeForm({ ...form, name })}
          placeholder="Ex.: Leite UHT Integral 1L"
          placeholderTextColor="#9aa0a6"
          style={styles.editInput}
          value={form.name}
        />
      </View>

      <View style={styles.editRow}>
        <View style={[styles.editField, styles.editRowField]}>
          <Text style={styles.cardLabel}>Quantidade</Text>
          <TextInput
            editable={!hasLots}
            keyboardType="numeric"
            onChangeText={(quantity) => onChangeForm({ ...form, quantity })}
            placeholder="Ex.: 12"
            placeholderTextColor="#9aa0a6"
            style={styles.editInput}
            value={form.quantity}
          />
        </View>

        <View style={[styles.editField, styles.editRowField]}>
          <Text style={styles.cardLabel}>Validade (opcional)</Text>
          <TextInput
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            onChangeText={(expirationDate) => onChangeForm({ ...form, expirationDate: formatDateInput(expirationDate) })}
            placeholder="Vazio = não perecível"
            placeholderTextColor="#9aa0a6"
            style={styles.editInput}
            value={form.expirationDate}
          />
        </View>
      </View>

      <View style={styles.editField}>
        <Text style={styles.cardLabel}>Lote</Text>
        <TextInput
          editable={!hasLots}
          onChangeText={(lot) => onChangeForm({ ...form, lot })}
          placeholder="Ex.: 250510-01"
          placeholderTextColor="#9aa0a6"
          style={styles.editInput}
          value={form.lot}
        />
      </View>

      <Pressable onPress={onSave} style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
        <Ionicons color="#ffffff" name="save-outline" size={21} />
        <Text style={styles.saveButtonText}>Salvar alterações</Text>
      </Pressable>
    </View>
  );
}

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<ProductsStackParamList, 'ProductDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const productId = route.params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>({
    barcode: '',
    expirationDate: '',
    lot: '',
    name: '',
    quantity: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProduct() {
        if (!productId) {
          setProduct(null);
          setIsLoading(false);
          return;
        }

        const storedProduct = await getProductById(productId);
        const productMovements = productId ? await getStockMovements(productId) : [];

        if (isActive) {
          setProduct(storedProduct);
          setMovements(productMovements);
          setIsEditing(false);
          setIsLoading(false);

          if (storedProduct) {
            setForm(toProductForm(storedProduct));
          }
        }
      }

      setIsLoading(true);
      loadProduct();

      return () => {
        isActive = false;
      };
    }, [productId]),
  );

  function handleStartEdit() {
    if (!product) {
      return;
    }

    setForm(toProductForm(product));
    setIsEditing(true);
  }

  async function handleSave() {
    if (!product) {
      return;
    }

    const hasLots = getProductLots(product).length > 0;
    const trimmedName = form.name.trim();
    const trimmedBarcode = form.barcode.trim();
    const parsedQuantity = Number(form.quantity.replace(',', '.'));
    const parsedExpirationDate = form.expirationDate.trim()
      ? parseProductDate(form.expirationDate)
      : NON_PERISHABLE_VALIDITY;

    if (!trimmedBarcode) {
      Alert.alert('Código obrigatório', 'Informe o código de barras.');
      return;
    }

    if (!trimmedName) {
      Alert.alert('Nome obrigatório', 'Informe o nome do produto.');
      return;
    }

    if (!hasLots && (!form.quantity.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0)) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade numérica válida.');
      return;
    }

    if (!parsedExpirationDate) {
      Alert.alert('Validade inválida', 'Informe a validade no formato DD/MM/AAAA.');
      return;
    }

    try {
      const updatedProduct = await updateProduct(product.id, {
        codigoBarras: trimmedBarcode,
        nome: trimmedName,
        validade: parsedExpirationDate,
        ...(hasLots
          ? {}
          : {
              lote: form.lot.trim() || undefined,
              quantidade: parsedQuantity,
            }),
      });

      if (!updatedProduct) {
        Alert.alert('Produto não encontrado', 'Não foi possível localizar este produto.');
        return;
      }

      setProduct(updatedProduct);
      setMovements(await getStockMovements(updatedProduct.id));
      setForm(toProductForm(updatedProduct));
      setIsEditing(false);
      Alert.alert('Produto atualizado', 'As alterações foram salvas com sucesso.');
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível atualizar o produto agora.');
    }
  }

  function handleChangeImage() {
    if (!product) {
      return;
    }

    Alert.alert('Imagem do produto', 'Escolha a origem da imagem.', [
      {
        text: 'Câmera',
        onPress: () => handlePickImage('camera'),
      },
      {
        text: 'Galeria',
        onPress: () => handlePickImage('library'),
      },
      ...(product.imageUri
        ? [
            {
              text: 'Remover imagem',
              style: 'destructive' as const,
              onPress: handleRemoveImage,
            },
          ]
        : []),
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  async function handlePickImage(source: 'camera' | 'library') {
    if (!product) {
      return;
    }

    try {
      const imageUri = await pickAndPersistProductImage(product.id, source);

      if (!imageUri) {
        return;
      }

      const updatedProduct = await updateProductImage(product.id, imageUri);

      if (updatedProduct) {
        setProduct(updatedProduct);
        setForm(toProductForm(updatedProduct));
      }
    } catch {
      Alert.alert('Erro na imagem', 'Não foi possível salvar a imagem do produto.');
    }
  }

  async function handleRemoveImage() {
    if (!product) {
      return;
    }

    const updatedProduct = await updateProductImage(product.id, undefined);

    if (updatedProduct) {
      setProduct(updatedProduct);
    }
  }

  function handleDelete() {
    if (!product || isEditing) {
      return;
    }

    Alert.alert('Excluir produto', `Tem certeza que deseja excluir "${product.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeProduct(product.id);
            navigation.popTo('Products');
          } catch {
            Alert.alert('Erro ao excluir', 'Não foi possível excluir o produto agora.');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProductDetailHeader
        isEditing={isEditing}
        onCancelEdit={() => setIsEditing(false)}
        onStartEdit={handleStartEdit}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Carregando produto...</Text>
          </View>
        ) : product ? (
          <>
            <ProductSummary onChangeImage={handleChangeImage} product={product} />
            <InfoCard icon="barcode-outline" label="Código de barras" value={product.codigoBarras || 'Não informado'} />
            <InfoCard icon="calendar-outline" label="Validade" value={formatProductDate(getProductDisplayDate(product))} />
            <StockCard product={product} />
            {isEditing ? (
              <EditProductForm
                form={form}
                hasLots={getProductLots(product).length > 0}
                onChangeForm={setForm}
                onSave={handleSave}
              />
            ) : (
              <>
                <ProductLotsCard product={product} />
                <ProductHistoryCard movements={movements} />
                <Pressable accessibilityRole="button" onPress={handleDelete} style={styles.card}>
                  <Text style={styles.sectionTitle}>Excluir produto</Text>
                  <Ionicons color="#d93025" name="trash-outline" size={28} />
                </Pressable>
              </>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Produto não encontrado</Text>
            <Text style={styles.emptyText}>Não foi possível carregar os dados deste produto.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
