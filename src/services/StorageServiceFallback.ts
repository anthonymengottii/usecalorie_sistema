/**
 * CalorIA - Storage Service (Fallback)
 * Local storage service using AsyncStorage for demo purposes
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

const STORAGE_KEYS = {
  USER: '@caloria:user',
  FOOD_ENTRIES: '@caloria:food_entries',
  SETTINGS: '@caloria:settings',
} as const;

export class StorageService {
  /**
   * Save user data to local storage
   */
  static async saveUser(user: User): Promise<void> {
    try {
      const userJson = JSON.stringify({
        ...user,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        profile: user.profile ? {
          ...user.profile,
          createdAt: user.profile.createdAt instanceof Date 
            ? user.profile.createdAt.toISOString() 
            : user.profile.createdAt,
          updatedAt: user.profile.updatedAt instanceof Date 
            ? user.profile.updatedAt.toISOString() 
            : user.profile.updatedAt,
          targetDate: user.profile.targetDate instanceof Date 
            ? user.profile.targetDate.toISOString() 
            : user.profile.targetDate,
        } : undefined,
        stats: user.stats ? {
          ...user.stats,
          lastActivityDate: user.stats.lastActivityDate instanceof Date 
            ? user.stats.lastActivityDate.toISOString() 
            : user.stats.lastActivityDate,
        } : undefined,
      });
      await AsyncStorage.setItem(STORAGE_KEYS.USER, userJson);
    } catch (error) {
      console.error('❌ Error saving user to storage:', error);
      throw error;
    }
  }

  /**
   * Load user data from local storage
   */
  static async loadUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (!userJson) return null;

      const userData = JSON.parse(userJson);
      
      // Restore Date objects
      const user: User = {
        ...userData,
        createdAt: new Date(userData.createdAt),
        profile: userData.profile ? {
          ...userData.profile,
          createdAt: new Date(userData.profile.createdAt),
          updatedAt: new Date(userData.profile.updatedAt),
          targetDate: new Date(userData.profile.targetDate),
        } : undefined,
        stats: userData.stats ? {
          ...userData.stats,
          lastActivityDate: new Date(userData.stats.lastActivityDate),
        } : undefined,
      };

      return user;
    } catch (error) {
      console.error('❌ Error loading user from storage:', error);
      return null;
    }
  }

  /**
   * Remove user data from local storage
   */
  static async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('❌ Error removing user from storage:', error);
      throw error;
    }
  }

  /**
   * Save food entries to local storage
   */
  static async saveFoodEntries(userId: string, entries: any[]): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.FOOD_ENTRIES}:${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(entries));
    } catch (error) {
      console.error('❌ Error saving food entries:', error);
      throw error;
    }
  }

  /**
   * Load food entries from local storage
   */
  static async loadFoodEntries(userId: string): Promise<any[]> {
    try {
      const key = `${STORAGE_KEYS.FOOD_ENTRIES}:${userId}`;
      const entriesJson = await AsyncStorage.getItem(key);
      if (!entriesJson) return [];
      return JSON.parse(entriesJson);
    } catch (error) {
      console.error('❌ Error loading food entries:', error);
      return [];
    }
  }

  /**
   * Clear all storage
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      throw error;
    }
  }
}

