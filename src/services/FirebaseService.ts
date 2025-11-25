/**
 * CalorIA - Firebase Service
 * Wrapper service for Firebase operations
 */

import { FirestoreService, StorageService as FirebaseStorageService } from './firebase';
import type { UserProfile, UserStats, User, FoodEntry } from '../types';

class FirebaseService {
  private waterIntakeStore = new Map<string, number>();

  /**
   * Get user data from Firestore
   */
  async getUserData(userId: string): Promise<{
    profile?: UserProfile;
    onboardingCompleted?: boolean;
    stats?: UserStats;
  }> {
    try {
      const profileData = await FirestoreService.getUserProfile(userId);
      return {
        profile: profileData ? (profileData as UserProfile) : undefined,
        onboardingCompleted: profileData?.onboardingCompleted || false,
        stats: profileData?.stats || undefined,
      };
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return {};
    }
  }

  /**
   * Save user profile to Firestore
   */
  async saveUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      await FirestoreService.saveUserProfile(userId, profile);
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Update top-level user fields
   */
  async updateUserProfile(userId: string, updates: Partial<Pick<User, 'displayName' | 'photoURL'>>): Promise<void> {
    try {
      // Update in LocalAuthRepository
      const { LocalAuthRepository } = await import('./LocalAuthRepository');
      await LocalAuthRepository.updateUser(userId, updates);
      console.log('✅ Updated user profile:', { userId, updates });
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Upload image to Firebase Storage
   */
  async uploadImage(userId: string, imageUri: string, path: string): Promise<string> {
    try {
      return await FirebaseStorageService.uploadImage(userId, imageUri, path);
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Save food entry to Firestore
   */
  async saveFoodEntry(userId: string, entry: Omit<FoodEntry, 'id'>): Promise<string> {
    try {
      // Demo: Just log it
      console.log('Demo: Saving food entry', { userId, entry });
      const entryId = `entry_${Date.now()}`;
      return entryId;
    } catch (error) {
      console.error('❌ Error saving food entry:', error);
      throw error;
    }
  }

  /**
   * Get food entries from Firestore
   */
  async getFoodEntries(userId: string, date?: Date): Promise<FoodEntry[]> {
    try {
      // Demo: Return empty array
      console.log('Demo: Getting food entries', { userId, date });
      return [];
    } catch (error) {
      console.error('❌ Error getting food entries:', error);
      return [];
    }
  }

  /**
   * Save user stats to Firestore
   */
  async saveUserStats(userId: string, stats: UserStats): Promise<void> {
    try {
      // Demo: Just log it
      console.log('Demo: Saving user stats', { userId, stats });
    } catch (error) {
      console.error('❌ Error saving user stats:', error);
      throw error;
    }
  }

  async updateStreak(userId: string): Promise<void> {
    console.log('Demo: Updating streak for', userId);
  }

  async saveWaterIntake(userId: string, amount: number): Promise<void> {
    this.waterIntakeStore.set(userId, amount);
    console.log('Demo: Saved water intake', { userId, amount });
  }

  async getWaterIntake(userId: string): Promise<number> {
    return this.waterIntakeStore.get(userId) ?? 0;
  }
}

export const firebaseService = new FirebaseService();

