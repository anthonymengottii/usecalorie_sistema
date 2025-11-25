// 🚀 DEMO VERSION - Mock data and limited persistence
/**
 * CalorIA - User Store (Zustand)
 * Manages user authentication and profile state with persistence
 */

import { create } from 'zustand';
import { StorageService } from '../services/StorageServiceFallback';
import { firebaseService } from '../services/FirebaseService';
import { useFoodStore } from './foodStore';
import type { User, UserProfile } from '../types';

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isOnboardingCompleted: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  loadUserFromStorage: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
      // Initial state (will load from storage)
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      isOnboardingCompleted: false,
      error: null,

      // Actions
      setUser: async (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
        
        // Persist user data
        if (user) {
          await StorageService.saveUser(user);
        } else {
          await StorageService.removeUser();
        }
      },

      updateUser: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          ...updates,
        };

        set({ user: updatedUser });
        await StorageService.saveUser(updatedUser);
      },

      updateProfile: async (profileUpdates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          profile: {
            ...currentUser.profile,
            ...profileUpdates,
          } as UserProfile,
        };

        set({ user: updatedUser });
        await StorageService.saveUser(updatedUser);
      },

      completeOnboarding: async () => {
        const currentUser = get().user;
        if (!currentUser) {
          console.error('❌ completeOnboarding: No user found!');
          return;
        }

        const updatedUser: User = {
          ...currentUser,
          onboardingCompleted: true,
        };

        set({
          user: updatedUser,
          isOnboardingCompleted: true,
        });

        await StorageService.saveUser(updatedUser);
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      logout: async () => {
        try {
          const currentUser = get().user;
          const userId = currentUser?.id;
          
          // Clear food entries from storage for this user
          if (userId) {
            try {
              await StorageService.removeFoodEntries(userId);
            } catch (error) {
              console.warn('⚠️ Error removing food entries:', error);
            }
          }
          
          // Clear food store data
          const { useFoodStore } = await import('./foodStore');
          useFoodStore.getState().setLoading(false);
          useFoodStore.getState().setError(null);
          useFoodStore.setState({
            foodEntries: [],
            todayStats: null,
            waterIntake: 0,
            lastRecognitionResult: null,
          });
          
          // Clear user data from storage
          await StorageService.removeUser();
          
          // Call auth service sign out
          try {
            const { AuthServiceUnified } = await import('../services/AuthServiceUnified');
            await AuthServiceUnified.signOut();
          } catch (authError) {
            console.warn('⚠️ Auth sign out error (non-critical):', authError);
          }
          
          // Reset user state
          set({
            user: null,
            isAuthenticated: false,
            isOnboardingCompleted: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('❌ Logout error:', error);
          // Still reset state even if cleanup fails
          set({
            user: null,
            isAuthenticated: false,
            isOnboardingCompleted: false,
            isLoading: false,
            error: null,
          });
        }
      },

      loadUserFromStorage: async () => {
        try {
          set({ isLoading: true });
          const user = await StorageService.loadUser();

          if (user) {
            try {
              const firestoreData = await firebaseService.getUserData(user.id);

              if (firestoreData.profile || firestoreData.onboardingCompleted) {
                const syncedUser: User = {
                  ...user,
                  onboardingCompleted: firestoreData.onboardingCompleted,
                  profile: firestoreData.profile || user.profile,
                  stats: firestoreData.stats || user.stats,
                };

                await StorageService.saveUser(syncedUser);

                set({
                  user: syncedUser,
                  isAuthenticated: true,
                  isOnboardingCompleted: firestoreData.onboardingCompleted,
                  isLoading: false,
                  error: null,
                });

                useFoodStore.getState().loadFoodEntries(syncedUser.id);
                return;
              }
            } catch (firestoreError) {
              console.warn('⚠️  Firestore sync failed, using local data');
            }

            set({
              user,
              isAuthenticated: true,
              isOnboardingCompleted: !!user.onboardingCompleted,
              isLoading: false,
              error: null,
            });

            useFoodStore.getState().loadFoodEntries(user.id);
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isOnboardingCompleted: false,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error('❌ Error loading user from storage:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          error: 'Erro ao carregar dados do usuário',
          });
        }
      },

      initialize: async () => {
        try {
          await get().loadUserFromStorage();
          set({ isInitialized: true });
        } catch (error) {
          console.error('❌ Error initializing user store:', error);
        set({ isInitialized: true, error: 'Erro ao inicializar o aplicativo' });
        }
      },
    }));