/**
 * CalorIA - Features Screen
 * Detailed app features and benefits
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/UI/Button';
import { Heading2, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';
import { useNavigation } from '../../utils/navigation';

interface Feature {
  id: number;
  emoji: string;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    emoji: '🧠',
    title: 'Inteligência artificial avançada',
    description: 'Reconhecimento instantâneo de alimentos com precisão acima de 90%',
    benefits: [
      'Identifica mais de 1000 alimentos diferentes',
      'Calcula porções automaticamente',
      'Fica mais precisa a cada novo escaneamento',
      'Funciona com qualquer tipo de refeição'
    ],
    color: COLORS.primary,
  },
  {
    id: 2,
    emoji: '📊',
    title: 'Dashboard inteligente',
    description: 'Visualize seu progresso com gráficos profissionais e insights personalizados',
    benefits: [
      'Gráficos dinâmicos de calorias e macros',
      'Tendências semanais e mensais',
      'Comparação com suas metas',
      'Insights nutricionais automáticos'
    ],
    color: COLORS.secondary,
  },
  {
    id: 3,
    emoji: '🎯',
    title: 'Metas personalizadas',
    description: 'Objetivos adaptados ao seu corpo, estilo de vida e metas específicas',
    benefits: [
      'Cálculo científico das necessidades calóricas',
      'Distribuição ideal de macronutrientes',
      'Ajustes automáticos conforme o progresso',
      'Recomendações personalizadas'
    ],
    color: COLORS.success,
  },
  {
    id: 4,
    emoji: '💰',
    title: 'Preço acessível',
    description: 'A melhor relação custo-benefício do mercado',
    benefits: [
      '30 dias totalmente grátis',
      'Apenas R$ 19,90/mês após o teste',
      '70% mais barato que a concorrência',
      'Cancele quando quiser'
    ],
    color: COLORS.primary,
  },
];

const { width: screenWidth } = Dimensions.get('window');

interface FeaturesScreenProps {
  onNext?: () => void;
}

export const FeaturesScreen = ({ onNext }: FeaturesScreenProps = {}) => {
  const navigation = useNavigation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentFeature < FEATURES.length - 1) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Boolean(true),
      }).start(() => {
        setCurrentFeature(currentFeature + 1);
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Boolean(true),
        }).start();
      });
    } else {
      if (onNext) {
        onNext();
      } else {
        navigation.navigate('ProfileSetup');
      }
    }
  };

  const handleSkip = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('ProfileSetup');
    }
  };

  const feature = FEATURES[currentFeature];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {FEATURES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentFeature && styles.progressDotActive
                ]}
              />
            ))}
          </View>
          <Button
            title="Pular"
            onPress={handleSkip}
            variant="ghost"
            size="small"
          />
        </View>

        {/* Feature Content */}
        <Animated.View style={[styles.featureContainer, { opacity: fadeAnim }]}>
          <View style={styles.featureHeader}>
            <BodyText style={styles.featureEmoji}>{feature.emoji}</BodyText>
            <Heading2 style={styles.featureTitle}>{feature.title}</Heading2>
            <BodyText align="center" color="textSecondary" style={styles.featureDescription}>
              {feature.description}
            </BodyText>
          </View>

          {/* Benefits List - Simplified */}
          <View style={styles.benefitsContainer}>
            {feature.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={[styles.benefitBullet, { backgroundColor: feature.color }]}>
                  <BodyText style={styles.benefitBulletText}>✓</BodyText>
                </View>
                <BodyText style={styles.benefitText}>{benefit}</BodyText>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Navigation - Fixed at bottom */}
      <View style={styles.navigationContainer}>
        <BodyText color="textSecondary" style={styles.counter}>
          {currentFeature + 1} de {FEATURES.length}
        </BodyText>
        <Button
          title={currentFeature === FEATURES.length - 1 ? "Continuar" : "Próximo"}
          onPress={handleNext}
          size="large"
          fullWidth
        />
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  progressBar: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  featureContainer: {
    flex: 1,
    minHeight: 400,
  },
  featureHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 2,
  },
  featureEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
    lineHeight: 80,
    textAlign: 'center',
  },
  featureTitle: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.text,
  },
  featureDescription: {
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 24,
    fontSize: 16,
  },
  benefitsContainer: {
    gap: SPACING.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  benefitBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  benefitBulletText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  benefitText: {
    flex: 1,
    lineHeight: 22,
    fontSize: 15,
    color: COLORS.text,
  },
  navigationContainer: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  counter: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: 14,
  },
});