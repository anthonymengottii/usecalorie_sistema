/**
 * CalorIA Demo - Mock Firebase Service
 * Simulates Firebase functionality for demo purposes
 */

import { LocalAuthRepository } from './LocalAuthRepository';
import type { UserProfile, UserStats } from '../types';

type StoredProfile = (UserProfile & {
  onboardingCompleted?: boolean;
  stats?: UserStats;
}) | null;

const mapStoredUser = (storedUser: any) => ({
  id: storedUser.id,
  email: storedUser.email,
  displayName: storedUser.displayName || 'Usuário CalorIA',
  photoURL: storedUser.photoURL,
  createdAt: new Date(storedUser.createdAt),
});

export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    const storedUser = await LocalAuthRepository.verifyCredentials(email, password);
    return mapStoredUser(storedUser);
  }

  static async signUpWithEmail(email: string, password: string, displayName?: string) {
    const newUser = await LocalAuthRepository.createUser(email, password, displayName);
    return mapStoredUser(newUser);
  }

  static async signInWithGoogle() {
    return this.signInWithEmail('demo@caloria.app', 'demo123');
  }

  static async signInWithApple() {
    return this.signInWithEmail('demo@caloria.app', 'demo123');
  }

  static async signOut() {
    console.log('Demo sign out');
  }
}

export class FirestoreService {
  static async saveUserProfile(userId: string, profile: Partial<UserProfile>) {
    console.log('Demo: Saving user profile locally');
    return profile;
  }

  static async getUserProfile(userId: string): Promise<StoredProfile> {
    console.log('Demo: Getting user profile from local storage');
    return null;
  }
}

export class StorageService {
  static async uploadImage(userId: string, imageUri: string, path: string) {
    console.log('Demo: Mock image upload');
    return `demo_images/${Date.now()}.jpg`;
  }
}