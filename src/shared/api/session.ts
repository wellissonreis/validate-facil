import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@validade-facil/onpremise-session';

export type AuthUser = {
  id: string;
  username: string;
  createdAt: string;
};

export type AuthSession = {
  token: string;
  expiresAt: string;
  user: AuthUser;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  const storedSession = await AsyncStorage.getItem(SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const session = JSON.parse(storedSession) as AuthSession;

    if (!session.token || new Date(session.expiresAt).getTime() <= Date.now()) {
      await clearAuthSession();
      return null;
    }

    return session;
  } catch {
    await clearAuthSession();
    return null;
  }
}

export async function saveAuthSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getAuthToken(): Promise<string | null> {
  return (await getAuthSession())?.token ?? null;
}
