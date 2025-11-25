/**
 * CalorIA - Enhanced Logging Utility
 * Provides detailed logging with component tracking and error context
 */

import { Platform } from 'react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  props?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = __DEV__;

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const platform = Platform.OS;
    const component = context?.component ? `[${context.component}]` : '';
    const action = context?.action ? `(${context.action})` : '';
    
    return `[${timestamp}] [${platform.toUpperCase()}] [${level.toUpperCase()}] ${component} ${action} ${message}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') return;

    const formattedMessage = this.formatMessage(level, message, context);
    
    switch (level) {
      case 'debug':
        console.log(`🔍 ${formattedMessage}`, context?.props || '');
        break;
      case 'info':
        console.log(`ℹ️  ${formattedMessage}`, context?.props || '');
        break;
      case 'warn':
        console.warn(`⚠️  ${formattedMessage}`, context?.props || '');
        break;
      case 'error':
        console.error(`❌ ${formattedMessage}`, context?.error || context?.props || '');
        break;
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  /**
   * Log component render with props validation
   */
  logComponentRender(componentName: string, props: Record<string, any>) {
    // Check for potential boolean casting issues
    const booleanProps: string[] = [];
    const suspiciousProps: Array<{ key: string; value: any; type: string }> = [];

    Object.entries(props).forEach(([key, value]) => {
      const valueType = typeof value;
      
      // Check if prop name suggests it should be boolean
      const booleanKeywords = ['disabled', 'loading', 'visible', 'enabled', 'selected', 'checked', 
                              'required', 'readOnly', 'multiline', 'secureTextEntry', 'autoFocus', 
                              'editable', 'scrollEnabled', 'showsVerticalScrollIndicator', 
                              'showsHorizontalScrollIndicator', 'interactive', 'fullWidth'];
      
      if (booleanKeywords.some(keyword => key.toLowerCase().includes(keyword.toLowerCase()))) {
        booleanProps.push(key);
        
        // Check if it's a string that looks like a boolean
        if (valueType === 'string' && (value === 'true' || value === 'false')) {
          suspiciousProps.push({ key, value, type: valueType });
        }
      }
    });

    if (suspiciousProps.length > 0) {
      this.warn(`Potential boolean casting issue detected in ${componentName}`, {
        component: componentName,
        action: 'render',
        props: {
          suspiciousProps,
          allBooleanProps: booleanProps,
        },
      });
    }

    this.debug(`Rendering ${componentName}`, {
      component: componentName,
      action: 'render',
      props: Object.keys(props),
    });
  }

  /**
   * Log prop normalization
   */
  logPropNormalization(componentName: string, propName: string, originalValue: any, normalizedValue: any) {
    if (originalValue !== normalizedValue) {
      this.debug(`Normalized prop ${propName}`, {
        component: componentName,
        action: 'normalize',
        props: {
          propName,
          original: { value: originalValue, type: typeof originalValue },
          normalized: { value: normalizedValue, type: typeof normalizedValue },
        },
      });
    }
  }
}

export const logger = new Logger();

