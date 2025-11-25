/**
 * CalorIA - Nutritional Analysis Screen
 * Shows in-depth nutritional analysis feature
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';

import { Button } from '../../components/UI/Button';
import { Heading2, BodyText } from '../../components/UI/Typography';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING } from '../../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface NutritionalAnalysisScreenProps {
  onNext?: () => void;
  carouselIndex?: number;
  totalScreens?: number;
}

export const NutritionalAnalysisScreen = ({ onNext, carouselIndex = 1, totalScreens = 3 }: NutritionalAnalysisScreenProps = {}) => {
  const navigation = useNavigation();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('BodyTransformation');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Image Section - Salad */}
      <View style={styles.imageSection}>
        {/* Placeholder for salad image */}
        <View style={styles.saladBackground}>
          {/* Decorative salad elements */}
          <View style={styles.saladBowl}>
            <View style={styles.lettuce} />
            <View style={styles.tomato1} />
            <View style={styles.tomato2} />
            <View style={styles.cucumber} />
            <View style={styles.corn} />
            <View style={styles.onion} />
            <View style={styles.chicken} />
          </View>
        </View>

        {/* Nutritional Card Overlay */}
        <View style={styles.nutritionCard}>
          <BlurView intensity={80} style={styles.blurCard} tint="light">
            <View style={styles.macrosContainer}>
              {/* Protein */}
              <View style={styles.macroItem}>
                <View style={styles.progressRing}>
                  <View style={[styles.progressRingFill, styles.proteinRing]} />
                  <BodyText style={styles.macroValue}>32</BodyText>
                </View>
                <BodyText style={styles.macroLabel}>Protein</BodyText>
              </View>

              {/* Carbs */}
              <View style={styles.macroItem}>
                <View style={styles.progressRing}>
                  <View style={[styles.progressRingFill, styles.carbsRing]} />
                  <BodyText style={styles.macroValue}>84</BodyText>
                </View>
                <BodyText style={styles.macroLabel}>Carbs</BodyText>
              </View>

              {/* Fat */}
              <View style={styles.macroItem}>
                <View style={styles.progressRing}>
                  <View style={[styles.progressRingFill, styles.fatRing]} />
                  <BodyText style={styles.macroValue}>20</BodyText>
                </View>
                <BodyText style={styles.macroLabel}>Fat</BodyText>
              </View>
            </View>
          </BlurView>
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <View style={styles.content}>
          {/* Title */}
          <Heading2 style={styles.title}>
            Análises nutricionais aprofundadas
          </Heading2>

          {/* Description */}
          <BodyText style={styles.description}>
            Mantê-lo-emos informado sobre as suas escolhas alimentares e o seu conteúdo nutricional
          </BodyText>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {Array.from({ length: totalScreens }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === carouselIndex && styles.dotActive
                ]}
              />
            ))}
          </View>

          {/* Next Button */}
          <Button
            title="Seguinte"
            onPress={handleNext}
            fullWidth
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageSection: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  saladBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saladBowl: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: screenWidth * 0.4,
    backgroundColor: '#0a0a0a',
    position: 'relative',
    overflow: 'hidden',
  },
  lettuce: {
    position: 'absolute',
    width: '90%',
    height: '50%',
    backgroundColor: '#2d5016',
    borderRadius: 100,
    top: '15%',
    left: '5%',
    opacity: 0.9,
  },
  tomato1: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#dc143c',
    top: '25%',
    left: '20%',
    opacity: 0.95,
  },
  tomato2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dc143c',
    top: '30%',
    right: '25%',
    opacity: 0.95,
  },
  cucumber: {
    position: 'absolute',
    width: 35,
    height: 55,
    borderRadius: 17.5,
    backgroundColor: '#228b22',
    top: '35%',
    right: '20%',
    opacity: 0.9,
  },
  corn: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffd700',
    bottom: '35%',
    left: '30%',
    opacity: 0.95,
  },
  onion: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8b008b',
    bottom: '30%',
    right: '30%',
    opacity: 0.8,
  },
  chicken: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#d3d3d3',
    top: '40%',
    left: '40%',
    opacity: 0.9,
  },
  nutritionCard: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    marginLeft: -screenWidth * 0.4,
    width: screenWidth * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurCard: {
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  macroItem: {
    alignItems: 'center',
  },
  progressRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    position: 'relative',
  },
  progressRingFill: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
  },
  proteinRing: {
    borderColor: '#dc143c',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  carbsRing: {
    borderColor: '#228b22',
    borderRightColor: 'transparent',
    transform: [{ rotate: '90deg' }],
  },
  fatRing: {
    borderColor: '#4169e1',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  macroLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    minHeight: screenHeight * 0.4,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  description: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.text,
    width: 24,
  },
  nextButton: {
    marginBottom: SPACING.lg,
  },
});

