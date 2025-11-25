/**
 * CalorIA - Navigation Utilities
 * Typed navigation hooks for React Navigation
 */

import { useNavigation as useRNNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from '../types';

// Navigation types
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// Hook for stack navigation (Auth, Onboarding, Main)
export const useNavigation = () => {
  return useRNNavigation<RootNavigationProp>();
};

// Hook for tab navigation (Home, Camera, History, Profile)
export const useTabNavigation = () => {
  return useRNNavigation<MainTabNavigationProp>();
};

