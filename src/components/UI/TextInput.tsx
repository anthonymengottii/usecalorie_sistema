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
  StyleProp,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { logger } from '../../utils/logger';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  leftIcon,
  rightIcon,
  ...props
}) => {
  const containerStyles: StyleProp<ViewStyle> = [
    styles.container,
    fullWidth ? styles.fullWidth : undefined,
    style,
  ];

  const inputContainerStyles: StyleProp<ViewStyle> = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    error ? styles.error : undefined,
  ];

  const textInputStyles: StyleProp<TextStyle> = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles],
    inputStyle,
  ];

  const labelStyles: StyleProp<TextStyle> = [
    styles.label,
    styles[`${size}Label` as keyof typeof styles],
    error ? styles.errorLabel : undefined,
    labelStyle,
  ];

  // Normalize boolean props to ensure they are actual booleans, not strings
  const normalizedProps = {
    ...props,
    secureTextEntry: props.secureTextEntry === true,
    autoFocus: props.autoFocus === true,
    multiline: props.multiline === true,
    editable: props.editable !== false,
    autoCorrect: props.autoCorrect !== false,
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
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        <RNTextInput
          style={[
            textInputStyles,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
          ]}
          placeholderTextColor={COLORS.textSecondary}
          {...normalizedProps}
        />
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.xs,
  },
  iconContainer: {
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
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