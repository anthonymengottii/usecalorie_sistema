/**
 * CalorIA - Food Store (Zustand)
 * Manages food entries, daily stats, and nutrition tracking
 * Now with full local persistence via AsyncStorage
 */

import { create } from 'zustand';
import { firebaseService } from '../services/FirebaseService';
import { StorageService } from '../services/StorageServiceFallback';
import type {
  FoodEntry,
  DailyStats,
  NutritionGoals,
  MealType,
  FoodRecognitionResult
} from '../types';
import { DEFAULT_NUTRITION_GOALS } from '../utils/constants';

interface FoodState {
  // State
  todayStats: DailyStats | null;
  foodEntries: FoodEntry[];
  nutritionGoals: NutritionGoals;
  waterIntake: number; // ml
  isLoading: boolean;
  error: string | null;
  lastRecognitionResult: FoodRecognitionResult | null;

  // Actions
  addFoodEntry: (entry: Omit<FoodEntry, 'id'>) => Promise<void>;
  updateFoodEntry: (id: string, updates: Partial<FoodEntry>) => Promise<void>;
  deleteFoodEntry: (id: string) => Promise<void>;
  addWaterIntake: (amount: number, userId: string) => Promise<void>;
  loadWaterIntake: (userId: string) => Promise<void>;
  resetWaterIntake: () => void;
  setTodayStats: (stats: DailyStats) => void;
  updateNutritionGoals: (goals: Partial<NutritionGoals>) => Promise<void>;
  setRecognitionResult: (result: FoodRecognitionResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  loadFoodEntries: (userId: string) => Promise<void>;

  // Helper functions
  getTodayEntries: () => FoodEntry[];
  getEntriesByMeal: (mealType: MealType) => FoodEntry[];
  calculateDailyNutrition: () => void;
}

export const useFoodStore = create<FoodState>()((set, get) => ({
      // Initial state
      todayStats: null,
      foodEntries: [],
      nutritionGoals: DEFAULT_NUTRITION_GOALS,
      waterIntake: 0,
      isLoading: false,
      error: null,
      lastRecognitionResult: null,

      // Actions
      addFoodEntry: async (entryData) => {
        const entry: FoodEntry = {
          ...entryData,
          id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        const newEntries = [...get().foodEntries, entry];
        set({ foodEntries: newEntries });

        // Save to local storage
        try {
          await StorageService.saveFoodEntries(entryData.userId, newEntries);
          // Also try to save to Firebase (async, don't wait)
          firebaseService.saveFoodEntry(entryData.userId, entryData).catch(err => 
            console.warn('⚠️ Failed to sync entry to Firebase:', err)
          );
        } catch (error) {
          console.error('❌ Error saving food entry:', error);
        }

        // Update user stats
        try {
          const { useUserStore } = await import('./userStore');
          const user = useUserStore.getState().user;
          if (user) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const lastActivity = user.stats?.lastActivityDate 
              ? new Date(user.stats.lastActivityDate) 
              : null;
            const lastActivityDate = lastActivity ? new Date(lastActivity) : null;
            if (lastActivityDate) lastActivityDate.setHours(0, 0, 0, 0);

            const isNewDay = !lastActivityDate || lastActivityDate.getTime() !== today.getTime();
            const currentStreak = user.stats?.currentStreak || 0;
            const newStreak = isNewDay 
              ? (lastActivityDate && lastActivityDate.getTime() === today.getTime() - 86400000 
                  ? currentStreak + 1 
                  : 1)
              : currentStreak;

            const updatedStats = {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, user.stats?.longestStreak || 0),
              totalMealsLogged: (user.stats?.totalMealsLogged || 0) + 1,
              totalDaysTracked: isNewDay 
                ? (user.stats?.totalDaysTracked || 0) + 1 
                : (user.stats?.totalDaysTracked || 0),
              lastActivityDate: today,
              avgCaloriesPerDay: user.stats?.avgCaloriesPerDay || 0, // Will be recalculated
            };

            await useUserStore.getState().updateUser({
              stats: updatedStats,
            });

            // Update streak in Firebase
            if (isNewDay) {
              firebaseService.updateStreak(user.id).catch(err => 
                console.warn('⚠️ Failed to update streak:', err)
              );
            }
          }
        } catch (error) {
          console.error('❌ Error updating user stats:', error);
        }

        // Recalculate daily stats
        get().calculateDailyNutrition();
      },

      updateFoodEntry: async (id, updates) => {
        const updatedEntries = get().foodEntries.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        );
        set({ foodEntries: updatedEntries });

        // Save to local storage
        const entry = updatedEntries.find(e => e.id === id);
        if (entry) {
          try {
            await StorageService.saveFoodEntries(entry.userId, updatedEntries);
          } catch (error) {
            console.error('❌ Error updating food entry:', error);
          }
        }

        get().calculateDailyNutrition();
      },

      deleteFoodEntry: async (id) => {
        const entry = get().foodEntries.find(e => e.id === id);
        const filteredEntries = get().foodEntries.filter((entry) => entry.id !== id);
        set({ foodEntries: filteredEntries });

        // Save to local storage
        if (entry) {
          try {
            await StorageService.saveFoodEntries(entry.userId, filteredEntries);
          } catch (error) {
            console.error('❌ Error deleting food entry:', error);
          }
        }

        get().calculateDailyNutrition();
      },

      addWaterIntake: async (amount, userId) => {
        const newTotal = get().waterIntake + amount;
        set({ waterIntake: newTotal });

        // Save to Firebase (and local via user profile)
        try {
          await firebaseService.saveWaterIntake(userId, newTotal);
          // Also save in user profile for persistence
          const user = (await import('./userStore')).useUserStore.getState().user;
          if (user) {
            await StorageService.saveUser({
              ...user,
              profile: {
                ...user.profile,
                waterIntake: newTotal,
              } as any,
            });
          }
        } catch (error) {
          console.error('❌ Error saving water intake:', error);
        }
      },

      loadWaterIntake: async (userId) => {
        try {
          // Try Firebase first
          const cloudIntake = await firebaseService.getWaterIntake(userId);
          
          // Also check user profile
          const user = (await import('./userStore')).useUserStore.getState().user;
          const localIntake = (user?.profile as any)?.waterIntake || 0;
          
          // Use the higher value (most recent)
          const waterIntake = Math.max(cloudIntake, localIntake);
          set({ waterIntake });
          console.log(`💧 Loaded water intake: ${waterIntake}ml`);
        } catch (error) {
          console.error('❌ Error loading water intake:', error);
        }
      },

      resetWaterIntake: () => {
        set({ waterIntake: 0 });
      },

      setTodayStats: (todayStats) => {
        set({ todayStats });
      },

      updateNutritionGoals: async (goalUpdates) => {
        const newGoals = {
          ...get().nutritionGoals,
          ...goalUpdates,
        };
        set({ nutritionGoals: newGoals });

        // Save to local storage
        try {
          const user = (await import('./userStore')).useUserStore.getState().user;
          if (user) {
            await StorageService.saveUser({
              ...user,
              profile: {
                ...user.profile,
                nutritionGoals: newGoals,
              } as any,
            });
          }
        } catch (error) {
          console.error('❌ Error saving nutrition goals:', error);
        }

        get().calculateDailyNutrition();
      },

      setRecognitionResult: (lastRecognitionResult) => {
        set({ lastRecognitionResult });
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

      loadFoodEntries: async (userId: string) => {
        try {
          set({ isLoading: true });
          
          // First try to load from local storage (fast)
          const localEntries = await StorageService.loadFoodEntries(userId);
          
          if (localEntries && localEntries.length > 0) {
            // Restore Date objects
            const restoredEntries: FoodEntry[] = localEntries.map((entry: any) => ({
              ...entry,
              date: new Date(entry.date),
              food: {
                ...entry.food,
              },
            }));
            
            set({ foodEntries: restoredEntries, isLoading: false });
            get().calculateDailyNutrition();
            
            // Also try to sync from Firebase in background (optional)
            firebaseService.getFoodEntries(userId).then(cloudEntries => {
              if (cloudEntries && cloudEntries.length > 0) {
                // Merge cloud entries with local (cloud takes precedence)
                const merged = [...restoredEntries];
                cloudEntries.forEach(cloudEntry => {
                  const localIndex = merged.findIndex(e => e.id === cloudEntry.id);
                  if (localIndex >= 0) {
                    merged[localIndex] = cloudEntry;
                  } else {
                    merged.push(cloudEntry);
                  }
                });
                set({ foodEntries: merged });
                StorageService.saveFoodEntries(userId, merged);
                get().calculateDailyNutrition();
              }
            }).catch(err => console.warn('⚠️ Firebase sync failed:', err));
          } else {
            // No local entries, try Firebase
            const cloudEntries = await firebaseService.getFoodEntries(userId);
            if (cloudEntries && cloudEntries.length > 0) {
              set({ foodEntries: cloudEntries, isLoading: false });
              await StorageService.saveFoodEntries(userId, cloudEntries);
              get().calculateDailyNutrition();
            } else {
              set({ isLoading: false });
            }
          }
        } catch (error) {
          console.error('❌ Error loading food entries:', error);
          set({ isLoading: false, error: 'Erro ao carregar histórico de comidas' });
        }
      },

      // Helper functions
      getTodayEntries: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return get().foodEntries.filter((entry) => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        });
      },

      getEntriesByMeal: (mealType) => {
        return get().getTodayEntries().filter((entry) => entry.mealType === mealType);
      },

      calculateDailyNutrition: () => {
        const todayEntries = get().getTodayEntries();
        const goals = get().nutritionGoals;

        if (todayEntries.length === 0) {
          set({ todayStats: null });
          return;
        }

        // Calculate total nutrition for today
        // Note: entry.nutrition already includes quantity multiplication from ConfirmationScreen
        const totalNutrition = todayEntries.reduce(
          (total, entry) => {
            return {
              calories: total.calories + entry.nutrition.calories,
              protein: total.protein + entry.nutrition.protein,
              carbs: total.carbs + entry.nutrition.carbs,
              fat: total.fat + entry.nutrition.fat,
              fiber: total.fiber + entry.nutrition.fiber,
              sugar: total.sugar + entry.nutrition.sugar,
              sodium: total.sodium + entry.nutrition.sodium,
              cholesterol: total.cholesterol + entry.nutrition.cholesterol,
              saturatedFat: total.saturatedFat + entry.nutrition.saturatedFat,
              transFat: total.transFat + entry.nutrition.transFat,
              potassium: total.potassium + entry.nutrition.potassium,
              calcium: total.calcium + entry.nutrition.calcium,
              iron: total.iron + entry.nutrition.iron,
              vitaminA: total.vitaminA + entry.nutrition.vitaminA,
              vitaminC: total.vitaminC + entry.nutrition.vitaminC,
            };
          },
          {
            calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0,
            sodium: 0, cholesterol: 0, saturatedFat: 0, transFat: 0,
            potassium: 0, calcium: 0, iron: 0, vitaminA: 0, vitaminC: 0,
          }
        );

        // Calculate progress
        const progress = {
          calories: {
            current: totalNutrition.calories,
            goal: goals.calories,
            percentage: Math.round((totalNutrition.calories / goals.calories) * 100),
            status: totalNutrition.calories < goals.calories * 0.9 
              ? 'under' 
              : totalNutrition.calories > goals.calories * 1.1 
                ? 'over' 
                : 'on-track',
          },
          protein: {
            current: totalNutrition.protein,
            goal: goals.protein,
            percentage: Math.round((totalNutrition.protein / goals.protein) * 100),
            status: totalNutrition.protein < goals.protein * 0.9 
              ? 'under' 
              : totalNutrition.protein > goals.protein * 1.1 
                ? 'over' 
                : 'on-track',
          },
          carbs: {
            current: totalNutrition.carbs,
            goal: goals.carbs,
            percentage: Math.round((totalNutrition.carbs / goals.carbs) * 100),
            status: totalNutrition.carbs < goals.carbs * 0.9 
              ? 'under' 
              : totalNutrition.carbs > goals.carbs * 1.1 
                ? 'over' 
                : 'on-track',
          },
          fat: {
            current: totalNutrition.fat,
            goal: goals.fat,
            percentage: Math.round((totalNutrition.fat / goals.fat) * 100),
            status: totalNutrition.fat < goals.fat * 0.9 
              ? 'under' 
              : totalNutrition.fat > goals.fat * 1.1 
                ? 'over' 
                : 'on-track',
          },
          fiber: {
            current: totalNutrition.fiber,
            goal: goals.fiber,
            percentage: Math.round((totalNutrition.fiber / goals.fiber) * 100),
            status: totalNutrition.fiber < goals.fiber * 0.9 
              ? 'under' 
              : totalNutrition.fiber > goals.fiber * 1.1 
                ? 'over' 
                : 'on-track',
          },
        } as const;

        const dailyStats: DailyStats = {
          date: new Date(),
          nutrition: totalNutrition,
          goals,
          progress,
          meals: todayEntries,
          waterIntake: 0, // TODO: Implement water tracking
        };

        set({ todayStats: dailyStats });
      },
    }));