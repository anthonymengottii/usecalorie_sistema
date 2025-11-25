/**
 * CalorIA - Body Transformation Screen
 * Shows body transformation and goal setting feature
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

import { Button } from '../../components/UI/Button';
import { Heading2, BodyText } from '../../components/UI/Typography';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING } from '../../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface BodyTransformationScreenProps {
  onNext?: () => void;
  carouselIndex?: number;
  totalScreens?: number;
}

export const BodyTransformationScreen = ({ onNext, carouselIndex = 2, totalScreens = 3 }: BodyTransformationScreenProps = {}) => {
  const navigation = useNavigation();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('ProfileSetup');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Image Section - Woman with bowl */}
      <View style={styles.imageSection}>
        {/* Placeholder for woman image */}
        <View style={styles.womanBackground}>
          {/* Decorative elements */}
          <View style={styles.womanSilhouette} />
          <View style={styles.bowl} />
        </View>

        {/* Weight Goal Overlay */}
        <View style={styles.weightGoalOverlay}>
          <View style={styles.weightGoalCard}>
            <BodyText style={styles.weightGoalLabel}>Weight Goal</BodyText>
            <BodyText style={styles.weightGoalValue}>54kg</BodyText>
          </View>
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <View style={styles.content}>
          {/* Title */}
          <Heading2 style={styles.title}>
            Transforme o seu corpo
          </Heading2>

          {/* Description */}
          <BodyText style={styles.description}>
            Hoje é a melhor altura para começar a trabalhar para o seu corpo de sonho
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
    backgroundColor: '#2a2a2a',
  },
  womanBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  womanSilhouette: {
    position: 'absolute',
    width: screenWidth * 0.6,
    height: screenHeight * 0.5,
    backgroundColor: '#3a3a3a',
    borderRadius: 100,
    bottom: '20%',
    opacity: 0.8,
  },
  bowl: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    bottom: '15%',
    left: '20%',
    opacity: 0.9,
  },
  weightGoalOverlay: {
    position: 'absolute',
    bottom: '25%',
    left: SPACING.lg,
  },
  weightGoalCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    minWidth: 120,
  },
  weightGoalLabel: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  weightGoalValue: {
    color: COLORS.surface,
    fontSize: 24,
    fontWeight: '700',
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

