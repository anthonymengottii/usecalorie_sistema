/**
 * CalorIA - Navigation Utilities
 * Typed navigation hooks for React Navigation
 */

import { useNavigation as useRNNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

// Hook for any navigator (stack/tab)
export const useNavigation = () => {
  return useRNNavigation<NavigationProp<ParamListBase>>();
};

// Hook for tab navigation (kept for backwards compatibility)
export const useTabNavigation = () => {
  return useRNNavigation<NavigationProp<ParamListBase>>();
};

