/**
 * CalorIA - Theme Context
 * Provides theme colors and styling throughout the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { COLORS } from '../utils/constants';

interface ThemeColors {
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  success: string;
  error: string;
  surface: string;
  background: string;
  border: string;
  disabled: string;
  placeholder: string;
  overlay: string;
}

interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

const lightTheme: Theme = {
  colors: {
    text: COLORS.text,
    textSecondary: COLORS.textSecondary,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    success: COLORS.success,
    error: COLORS.error,
    surface: COLORS.surface,
    background: COLORS.background,
    border: COLORS.border,
    disabled: COLORS.disabled,
    placeholder: COLORS.placeholder,
    overlay: COLORS.overlay,
  },
  isDark: false,
};

const ThemeContext = createContext<Theme>(lightTheme);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = lightTheme,
}) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

