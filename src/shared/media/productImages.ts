import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

type PickProductImageSource = 'camera' | 'library';

export async function pickAndPersistProductImage(
  productId: string,
  source: PickProductImageSource,
): Promise<string | null> {
  const permissionGranted = await ensurePermission(source);

  if (!permissionGranted) {
    return null;
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          mediaTypes: ['images'],
          quality: 0.72,
        })
      : await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          mediaTypes: ['images'],
          quality: 0.72,
        });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return persistProductImage(productId, result.assets[0].uri);
}

async function ensurePermission(source: PickProductImageSource): Promise<boolean> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  return permission.granted;
}

async function persistProductImage(productId: string, uri: string): Promise<string> {
  const imagesDirectory = new Directory(Paths.document, 'product-images');

  if (!imagesDirectory.exists) {
    imagesDirectory.create({ idempotent: true, intermediates: true });
  }

  const sourceFile = new File(uri);
  const extension = sourceFile.extension || Paths.extname(uri) || '.jpg';
  const targetFile = new File(imagesDirectory, `${productId}-${Date.now()}${extension}`);

  await sourceFile.copy(targetFile, { overwrite: true });

  return targetFile.uri;
}
