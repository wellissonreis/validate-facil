export type AppDataMode = 'storage' | 'onpremise';

const MODE_ALIASES: Record<string, AppDataMode> = {
  local: 'storage',
  modoonpremise: 'onpremise',
  modoonpremisse: 'onpremise',
  modostorage: 'storage',
  onpremise: 'onpremise',
  onpremisse: 'onpremise',
  storage: 'storage',
};

function readEnvironmentValue(key: string): string | undefined {
  return process.env[key];
}

function normalizeMode(value: string | undefined): AppDataMode {
  const normalized = value?.trim().toLowerCase().replace(/[-_\s]/g, '');

  if (!normalized) {
    return 'storage';
  }

  return MODE_ALIASES[normalized] ?? 'storage';
}

export const appDataMode = normalizeMode(
  readEnvironmentValue('EXPO_PUBLIC_MODO_STORAGE') ??
    readEnvironmentValue('EXPO_PUBLIC_MODO_ON_PREMISSE') ??
    readEnvironmentValue('EXPO_PUBLIC_MODO_ON_PREMISE') ??
    readEnvironmentValue('EXPO_PUBLIC_APP_DATA_MODE'),
);

export const isStorageMode = appDataMode === 'storage';
export const isOnPremiseMode = appDataMode === 'onpremise';

export const apiBaseUrl = (
  readEnvironmentValue('EXPO_PUBLIC_API_URL') ??
  readEnvironmentValue('EXPO_PUBLIC_BACKEND_URL') ??
  'http://10.0.2.2:8080'
).replace(/\/+$/, '');

console.log('apiBaseUrl', apiBaseUrl);
console.log('appDataMode', appDataMode);
