import { apiRequest } from './client';
import { clearAuthSession, saveAuthSession, type AuthSession } from './session';

type Credentials = {
  password: string;
  username: string;
};

export async function login(credentials: Credentials): Promise<AuthSession> {
  const session = await apiRequest<AuthSession>('/auth/login', {
    body: credentials,
    method: 'POST',
  });

  console.log('login session', session);
  await saveAuthSession(session);

  return session;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>('/auth/logout', { method: 'POST' });
  } finally {
    await clearAuthSession();
  }
}
