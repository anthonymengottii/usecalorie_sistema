/**
 * CalorIA - Native Error Handler
 * Catches native errors and logs them for debugging
 */

import { Platform, NativeModules } from 'react-native';
import { logger } from './logger';

// Set up global error handler for native errors
if (__DEV__) {
  const originalHandler = global.ErrorUtils?.getGlobalHandler?.();
  
  global.ErrorUtils?.setGlobalHandler?.((error: Error, isFatal?: boolean) => {
    const errorMessage = error?.message || String(error);
    
    if (errorMessage.includes('String cannot be cast to Boolean') || 
        errorMessage.includes('cannot be cast to') ||
        errorMessage.includes('Boolean')) {
      logger.error('Native error detected - Boolean casting issue', {
        component: 'ErrorHandler',
        action: 'native-error',
        props: {
          errorMessage,
          errorStack: error?.stack,
          isFatal: Boolean(isFatal),
          platform: Platform.OS,
        },
      });
    }
    
    // Call original handler
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

// Log all native module calls for debugging
export const logNativeModuleCall = (moduleName: string, method: string, args: any[]) => {
  if (__DEV__) {
    logger.debug(`Native module call: ${moduleName}.${method}`, {
      component: 'NativeModule',
      action: 'call',
      props: {
        moduleName,
        method,
        args: args.map(arg => ({
          type: typeof arg,
          value: typeof arg === 'object' ? JSON.stringify(arg).substring(0, 100) : String(arg).substring(0, 100),
        })),
      },
    });
  }
};

