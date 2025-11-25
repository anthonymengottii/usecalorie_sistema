/**
 * CalorIA - Welcome Screen
 * First onboarding screen with app introduction
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/UI/Button';
import { Heading1, Heading2, BodyText, Caption } from '../../components/UI/Typography';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING } from '../../utils/constants';

const { width: screenWidth } = Dimensions.get('window');

interface WelcomeScreenProps {
  onNext?: () => void;
}

export const WelcomeScreen = ({ onNext }: WelcomeScreenProps = {}) => {
  const navigation = useNavigation();
  const handleGetStarted = () => {
    if (onNext) {
      onNext();
    } else {
      console.log('🚀 Welcome Screen - Navigating to Features');
      navigation.navigate('Features');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Heading1 style={styles.appName}>CalorIA</Heading1>
          </View>
          
          <Heading2 style={styles.tagline}>
            Seu nutricionista pessoal{'\n'}com inteligência artificial
          </Heading2>
          
          <BodyText align="center" color="textSecondary" style={styles.description}>
            Escaneie suas refeições, acompanhe calorias automaticamente e alcance suas metas de saúde de forma inteligente.
          </BodyText>
        </View>

        {/* Feature Highlights - Simplified */}
        <View style={styles.highlights}>
          <View style={styles.highlightItem}>
            <BodyText style={styles.highlightEmoji}>📸</BodyText>
            <View style={styles.highlightText}>
              <BodyText style={styles.highlightTitle}>Escaneamento inteligente</BodyText>
              <Caption color="textSecondary" style={styles.highlightDescription}>
                Basta tirar uma foto e a IA identifica sua refeição automaticamente
              </Caption>
            </View>
          </View>

          <View style={styles.highlightItem}>
            <BodyText style={styles.highlightEmoji}>📊</BodyText>
            <View style={styles.highlightText}>
              <BodyText style={styles.highlightTitle}>Acompanhamento automático</BodyText>
              <Caption color="textSecondary" style={styles.highlightDescription}>
                Calorias, macros e micronutrientes calculados na hora
              </Caption>
            </View>
          </View>

          <View style={styles.highlightItem}>
            <BodyText style={styles.highlightEmoji}>🎯</BodyText>
            <View style={styles.highlightText}>
              <BodyText style={styles.highlightTitle}>Metas personalizadas</BodyText>
              <Caption color="textSecondary" style={styles.highlightDescription}>
                Objetivos adaptados ao seu estilo de vida e necessidades
              </Caption>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button - Fixed at bottom */}
      <View style={styles.actionsContainer}>
        <Button
          title="Começar"
          onPress={handleGetStarted}
          size="large"
          fullWidth
        />
        
        <Caption align="center" color="textSecondary" style={styles.disclaimer}>
          30 dias grátis • Sem compromisso
        </Caption>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  hero: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '600',
    color: COLORS.text,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 24,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  highlights: {
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 50,
  },
  highlightEmoji: {
    fontSize: 32,
    lineHeight: 40,
    width: 40,
    textAlign: 'center',
  },
  highlightText: {
    flex: 1,
  },
  highlightTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
    fontSize: 17,
    color: COLORS.text,
  },
  highlightDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  actionsContainer: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  disclaimer: {
    fontSize: 12,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
});