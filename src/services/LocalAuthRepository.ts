/**
 * CalorIA - Local Auth Repository
 * Stores registered users securely in AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sha256 } from 'js-sha256';

const AUTH_USERS_KEY = '@caloria:auth_users';

export interface StoredAuthUser {
  id: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hashPassword = async (password: string) => {
  return Promise.resolve(sha256(password));
};

const getStoredUsers = async (): Promise<StoredAuthUser[]> => {
  const usersJson = await AsyncStorage.getItem(AUTH_USERS_KEY);
  if (!usersJson) {
    const seededUser: StoredAuthUser = {
      id: 'demo_user_123',
      email: 'demo@caloria.app',
      passwordHash: await hashPassword('demo123'),
      displayName: 'Demo User',
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_USERS_KEY, JSON.stringify([seededUser]));
    return [seededUser];
  }

  try {
    return JSON.parse(usersJson);
  } catch {
    await AsyncStorage.removeItem(AUTH_USERS_KEY);
    return getStoredUsers();
  }
};

const persistUsers = async (users: StoredAuthUser[]) => {
  await AsyncStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
};

export const LocalAuthRepository = {
  async createUser(email: string, password: string, displayName?: string): Promise<StoredAuthUser> {
    const normalizedEmail = normalizeEmail(email);
    const users = await getStoredUsers();

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('Este e-mail já está cadastrado. Faça login.');
    }

    const newUser: StoredAuthUser = {
      id: `user_${Date.now()}`,
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      displayName: displayName?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await persistUsers([...users, newUser]);
    return newUser;
  },

  async verifyCredentials(email: string, password: string): Promise<StoredAuthUser> {
    const normalizedEmail = normalizeEmail(email);
    const users = await getStoredUsers();
    const storedUser = users.find((user) => user.email === normalizedEmail);

    if (!storedUser) {
      throw new Error('Usuário não encontrado. Verifique o e-mail informado.');
    }

    const incomingHash = await hashPassword(password);
    if (incomingHash !== storedUser.passwordHash) {
      throw new Error('Senha incorreta. Tente novamente.');
    }

    return storedUser;
  },

  async ensureDemoUserPassword(password: string) {
    const users = await getStoredUsers();
    const demoUser = users.find((user) => user.email === 'demo@caloria.app');
    if (demoUser && password && !(await hashPassword(password) === demoUser.passwordHash)) {
      demoUser.passwordHash = await hashPassword(password);
      await persistUsers(users);
    }
  },

  async updateUser(userId: string, updates: Partial<Pick<StoredAuthUser, 'displayName' | 'photoURL'>>): Promise<StoredAuthUser | null> {
    const users = await getStoredUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return null;
    }

    const updatedUser: StoredAuthUser = {
      ...users[userIndex],
      ...updates,
    };

    users[userIndex] = updatedUser;
    await persistUsers(users);
    return updatedUser;
  },
};


