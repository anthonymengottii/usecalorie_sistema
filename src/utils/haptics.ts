/**
 * CalorIA - Haptic Feedback Utilities
 * Wrapper for Expo Haptics with consistent feedback patterns
 */

import * as Haptics from 'expo-haptics';

/**
 * Light impact feedback - for subtle interactions
 */
export const lightImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium impact feedback - for standard button presses
 */
export const mediumImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Heavy impact feedback - for important actions
 */
export const heavyImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Selection feedback - for item selection
 */
export const selectionFeedback = () => {
  Haptics.selectionAsync();
};

/**
 * Success feedback - for successful actions
 */
export const successFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Error feedback - for error states
 */
export const errorFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Warning feedback - for warnings
 */
export const warningFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

