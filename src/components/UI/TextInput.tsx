/**
 * CalorIA - Base TextInput Component
 * Standardized text input with theme integration
 */

import React, { useEffect } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { logger } from '../../utils/logger';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  fullWidth = true,
  style,
  inputStyle,
  labelStyle,
  variant = 'outline',
  size = 'medium',
  ...props
}) => {
  const containerStyles = [
    styles.container,
    fullWidth && styles.fullWidth,
    style,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    error && styles.error,
  ];

  const textInputStyles = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles],
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    styles[`${size}Label` as keyof typeof styles],
    error && styles.errorLabel,
    labelStyle,
  ];

  // Normalize boolean props to ensure they are actual booleans, not strings
  const normalizedProps = {
    ...props,
    secureTextEntry: Boolean(props.secureTextEntry === true || props.secureTextEntry === 'true'),
    autoFocus: Boolean(props.autoFocus === true || props.autoFocus === 'true'),
    multiline: Boolean(props.multiline === true || props.multiline === 'true'),
    editable: Boolean(props.editable !== false && props.editable !== 'false'),
    autoCorrect: Boolean(props.autoCorrect === true || props.autoCorrect === 'true'),
  };

  // Log prop normalization for debugging
  useEffect(() => {
    if (props.secureTextEntry !== undefined || props.autoFocus !== undefined || 
        props.multiline !== undefined || props.editable !== undefined || 
        props.autoCorrect !== undefined) {
      logger.logComponentRender('TextInput', {
        secureTextEntry: { original: props.secureTextEntry, normalized: normalizedProps.secureTextEntry },
        autoFocus: { original: props.autoFocus, normalized: normalizedProps.autoFocus },
        multiline: { original: props.multiline, normalized: normalizedProps.multiline },
        editable: { original: props.editable, normalized: normalizedProps.editable },
        autoCorrect: { original: props.autoCorrect, normalized: normalizedProps.autoCorrect },
      });
    }
  }, [props.secureTextEntry, props.autoFocus, props.multiline, props.editable, props.autoCorrect]);

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
        </Text>
      )}
      <View style={inputContainerStyles}>
        <RNTextInput
          style={textInputStyles}
          placeholderTextColor={COLORS.textSecondary}
          {...normalizedProps}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  fullWidth: {
    width: '100%',
  },

  // Label styles
  label: {
    marginBottom: SPACING.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  errorLabel: {
    color: COLORS.error,
  },

  // Input container variants
  inputContainer: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  default: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  outline: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filled: {
    borderColor: 'transparent',
    backgroundColor: COLORS.background,
  },
  error: {
    borderColor: COLORS.error,
  },

  // Input container sizes
  small: {
    minHeight: 36,
  },
  medium: {
    minHeight: 44,
  },
  large: {
    minHeight: 52,
  },

  // Input styles
  input: {
    flex: 1,
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  // Input sizes
  smallInput: {
    fontSize: FONT_SIZES.sm,
    paddingVertical: SPACING.xs,
  },
  mediumInput: {
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.sm,
  },
  largeInput: {
    fontSize: FONT_SIZES.lg,
    paddingVertical: SPACING.md,
  },

  // Label sizes
  smallLabel: {
    fontSize: FONT_SIZES.xs,
  },
  mediumLabel: {
    fontSize: FONT_SIZES.sm,
  },
  largeLabel: {
    fontSize: FONT_SIZES.md,
  },

  // Error text
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
});