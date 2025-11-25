/**
 * CalorIA - Firebase Service
 * Wrapper service for Firebase operations
 */

import { FirestoreService, StorageService as FirebaseStorageService } from './firebase';
import type { User, UserProfile, UserStats } from '../types';

class FirebaseService {
  /**
   * Get user data from Firestore
   */
  async getUserData(userId: string): Promise<{
    profile?: UserProfile;
    onboardingCompleted?: boolean;
    stats?: UserStats;
  }> {
    try {
      const profile = await FirestoreService.getUserProfile(userId);
      return {
        profile: profile || undefined,
        onboardingCompleted: profile?.onboardingCompleted || false,
        stats: profile?.stats || undefined,
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
  async saveFoodEntry(userId: string, entry: any): Promise<void> {
    try {
      // Demo: Just log it
      console.log('Demo: Saving food entry', { userId, entry });
    } catch (error) {
      console.error('❌ Error saving food entry:', error);
      throw error;
    }
  }

  /**
   * Get food entries from Firestore
   */
  async getFoodEntries(userId: string, date?: Date): Promise<any[]> {
    try {
      // Demo: Return empty array
      console.log('Demo: Getting food entries', { userId, date });
      return [];
    } catch (error) {
      console.error('❌ Error getting food entries:', error);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();

