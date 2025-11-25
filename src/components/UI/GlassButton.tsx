/**
 * CalorIA - Glass Button Component
 * Liquid glass button with iOS 18 effect
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
// Temporarily disabled to fix Android casting error
// import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
const isLiquidGlassSupported = false;
import { BodyText } from './Typography';
import { COLORS, SPACING } from '../../utils/constants';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  glassEffect?: 'clear' | 'regular';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  glassEffect = 'clear',
}) => {
  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56;
      default:
        return 44;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const getVariantStyles = () => {
    const isGlassSupported = isLiquidGlassSupported;

    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: isGlassSupported ? 'transparent' : COLORS.primary,
          },
          text: { color: COLORS.surface },
          glassEffect: 'regular' as const,
          glassTintColor: COLORS.primary,
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: isGlassSupported ? 'transparent' : COLORS.secondary,
          },
          text: { color: COLORS.surface },
          glassEffect: 'regular' as const,
          glassTintColor: COLORS.secondary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: isGlassSupported ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1.5,
            borderColor: COLORS.primary,
          },
          text: { color: COLORS.primary },
          glassEffect: 'clear' as const,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: { color: COLORS.primary },
          glassEffect: undefined,
        };
      default:
        return {
          container: {},
          text: {},
          glassEffect: undefined,
        };
    }
  };

  const variantStyles = getVariantStyles();
  // Completely disable LiquidGlass on Android to avoid casting errors
  const isGlassSupported = false; // Temporarily disabled
  const shouldShowGlass = false; // Temporarily disabled

  // Ensure boolean props are actual booleans
  const isDisabled = Boolean(disabled || loading);
  const isPressedOpacity = disabled ? 0.5 : 0.8;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.container,
        {
          height: getButtonHeight(),
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.5 : (pressed ? isPressedOpacity : 1),
          overflow: 'hidden',
        },
        variantStyles.container,
        style,
      ]}
    >
      {/* LiquidGlass temporarily disabled to fix Android casting error */}
      {/* {shouldShowGlass && variantStyles.glassEffect && Platform.OS === 'ios' && (
        <LiquidGlassView
          effect={variantStyles.glassEffect}
          tintColor={variantStyles.glassTintColor}
          interactive={true}
          style={StyleSheet.absoluteFill}
        />
      )} */}

      <BodyText
        style={[
          styles.text,
          {
            fontSize: getTextSize(),
            fontWeight: '600',
          },
          variantStyles.text,
          textStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variantStyles.text.color}
            size="small"
          />
        ) : (
          <>
            {icon && icon}
            {icon && ' '}
            {title}
          </>
        )}
      </BodyText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  text: {
    textAlign: 'center',
  },
});
