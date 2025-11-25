// Initialize react-native-gesture-handler FIRST, before any other imports
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens(false);

import React, { useEffect } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { logger } from './src/utils/logger';
import { Platform, LogBox } from 'react-native';
import './src/utils/errorHandler';
// Ignore specific warnings but log them
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// Catch all errors including native errors
if (__DEV__) {
  const originalError = console.error;
  console.error = (...args) => {
    originalError(...args);
    if (args[0]?.includes?.('String cannot be cast to Boolean') || 
        args[0]?.toString?.().includes('String cannot be cast to Boolean')) {
      logger.error('Boolean casting error detected in console', {
        component: 'App',
        action: 'console-error',
        props: {
          error: args,
          platform: Platform.OS,
        },
      });
    }
  };
}

export default function App() {
  useEffect(() => {
    logger.info('App initialized', {
      component: 'App',
      action: 'mount',
      props: {
        platform: Platform.OS,
        version: Platform.Version,
      },
    });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

