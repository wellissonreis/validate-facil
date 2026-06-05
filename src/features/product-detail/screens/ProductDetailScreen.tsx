import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTab from '@/features/home/components/BottomTab';
import {
  formatDateInput,
  formatProductDate,
  getProductDisplayDate,
  getProductById,
  getProductLots,
  parseProductDate,
  updateProduct,
} from '@/shared/storage/products';
import type { Product } from '@/shared/storage/products';

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
    expirationDate: formatProductDate(getProductDisplayDate(product)),
    lot: product.lote ?? '',
    name: product.nome,
    quantity: String(product.quantidade),
  };
}

function getDateStatus(value: string): LotStatus {
  const [year, month, day] = value.split('-').map(Number);
  const expirationDate = new Date(year, month - 1, day);
  const today = new Date();

  expirationDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expirationDate < today ? 'Crítico' : 'Ok';
}

function formatEntryDate(value: string): string {
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
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.headerButton}>
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

function ProductSummary({ product }: { product: Product }) {
  return (
    <View style={styles.summary}>
      <View style={styles.productImageCard}>
        <MaterialCommunityIcons color={primaryGreen} name="bottle-soda-classic-outline" size={50} />
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.productName}>{product.nome}</Text>
        <Text style={styles.productBrand}>Entrada: {formatEntryDate(product.criadoEm)}</Text>
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
  const color = status === 'Crítico' ? '#d93025' : status === 'Atenção' ? '#f57c00' : primaryGreen;

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

function ProductHistoryCard({ product }: { product: Product }) {
  const lots = getProductLots(product);
  const entries =
    lots.length > 0
      ? lots
      : [
          {
            id: product.id,
            codigo: product.lote || 'Não informado',
            criadoEm: product.criadoEm,
            quantidade: product.quantidade,
          },
        ];

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Histórico de entradas</Text>
        <Text style={styles.greenText}>Atualizado</Text>
      </View>
      <View style={styles.divider} />

      {entries.map((entry) => (
        <View key={entry.id} style={styles.historyRow}>
          <Text style={styles.rowDate}>{formatEntryDate(entry.criadoEm)}</Text>
          <Text style={styles.rowQuantity}>{entry.quantidade} un</Text>
          <Text style={styles.lotText}>Lote: {entry.codigo}</Text>
        </View>
      ))}
    </View>
  );
}

function EditProductForm({
  form,
  onChangeForm,
  onSave,
}: {
  form: ProductForm;
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
            keyboardType="numeric"
            onChangeText={(quantity) => onChangeForm({ ...form, quantity })}
            placeholder="Ex.: 12"
            placeholderTextColor="#9aa0a6"
            style={styles.editInput}
            value={form.quantity}
          />
        </View>

        <View style={[styles.editField, styles.editRowField]}>
          <Text style={styles.cardLabel}>Validade</Text>
          <TextInput
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            onChangeText={(expirationDate) => onChangeForm({ ...form, expirationDate: formatDateInput(expirationDate) })}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#9aa0a6"
            style={styles.editInput}
            value={form.expirationDate}
          />
        </View>
      </View>

      <View style={styles.editField}>
        <Text style={styles.cardLabel}>Lote</Text>
        <TextInput
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
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
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

        if (isActive) {
          setProduct(storedProduct);
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

    const trimmedName = form.name.trim();
    const trimmedBarcode = form.barcode.trim();
    const parsedQuantity = Number(form.quantity.replace(',', '.'));
    const parsedExpirationDate = parseProductDate(form.expirationDate);

    if (!trimmedBarcode) {
      Alert.alert('Código obrigatório', 'Informe o código de barras.');
      return;
    }

    if (!trimmedName) {
      Alert.alert('Nome obrigatório', 'Informe o nome do produto.');
      return;
    }

    if (!form.quantity.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
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
        lote: form.lot.trim() || undefined,
        nome: trimmedName,
        quantidade: parsedQuantity,
        validade: parsedExpirationDate,
      });

      if (!updatedProduct) {
        Alert.alert('Produto não encontrado', 'Não foi possível localizar este produto.');
        return;
      }

      setProduct(updatedProduct);
      setForm(toProductForm(updatedProduct));
      setIsEditing(false);
      Alert.alert('Produto atualizado', 'As alterações foram salvas com sucesso.');
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível atualizar o produto agora.');
    }
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
            <ProductSummary product={product} />
            <InfoCard icon="barcode-outline" label="Código de barras" value={product.codigoBarras || 'Não informado'} />
            <InfoCard icon="calendar-outline" label="Validade" value={formatProductDate(getProductDisplayDate(product))} />
            <StockCard product={product} />
            {isEditing ? (
              <EditProductForm form={form} onChangeForm={setForm} onSave={handleSave} />
            ) : (
              <>
                <ProductLotsCard product={product} />
                <ProductHistoryCard product={product} />
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

      <BottomTab activeTab="Produtos" />
    </SafeAreaView>
  );
}
