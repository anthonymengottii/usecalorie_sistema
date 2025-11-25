import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
// Temporarily disabled to fix Android casting error
// import { LiquidGlassView, LiquidGlassContainerView, isLiquidGlassSupported } from '@callstack/liquid-glass';
const isLiquidGlassSupported = false;
import { Heading3, BodyText } from './Typography';
import { COLORS, SPACING } from '../../utils/constants';

export const LiquidGlassDemo: React.FC = () => {
  // Temporarily disabled to fix Android casting error
  return null;
  
  /* Original code disabled
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Heading3 style={styles.title}>Liquid Glass Effects (iOS 26)</Heading3>
      ...
    </View>
  );
  */
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 16,
  },
  title: {
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  glassCard: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  glassText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  glassTextWhite: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 4,
    opacity: 0.8,
  },
});
