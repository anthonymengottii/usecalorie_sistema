/**
 * CalorIA - Landing Screen
 * First screen before login/registration - shows app value proposition
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/UI/Button';
import { Heading2, BodyText, Caption } from '../../components/UI/Typography';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING } from '../../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LandingScreenProps {
  onNext?: () => void;
  carouselIndex?: number;
  totalScreens?: number;
}

export const LandingScreen = ({ onNext, carouselIndex = 0, totalScreens = 3 }: LandingScreenProps = {}) => {
  const navigation = useNavigation();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Image Section with Camera Frame */}
      <View style={styles.imageSection}>
        {/* Food image - try to use screenshot or create a nice gradient */}
        <View style={styles.foodImageContainer}>
          <View style={styles.foodImageGradient}>
            {/* Decorative elements to simulate food */}
            <View style={styles.saladBowl}>
              <View style={styles.lettuce} />
              <View style={styles.tomato} />
              <View style={styles.cucumber} />
              <View style={styles.corn} />
            </View>
          </View>
        </View>
        
        {/* Camera Frame Overlay */}
        <View style={styles.cameraFrame}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Center line */}
          <View style={styles.centerLine} />
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <View style={styles.content}>
          {/* Title */}
          <Heading2 style={styles.title}>
            Controle de calorias{'\n'}facilitado
          </Heading2>

          {/* Description */}
          <BodyText style={styles.description}>
            Basta tirar uma fotografia rápida da sua refeição{'\n'}
            e nós tratamos do resto
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
    backgroundColor: '#000',
  },
  foodImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  foodImageGradient: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saladBowl: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: screenWidth * 0.35,
    backgroundColor: '#0a0a0a',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lettuce: {
    position: 'absolute',
    width: '80%',
    height: '40%',
    backgroundColor: '#2d5016',
    borderRadius: 100,
    top: '20%',
    opacity: 0.8,
  },
  tomato: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#dc143c',
    top: '30%',
    left: '30%',
    opacity: 0.9,
  },
  cucumber: {
    position: 'absolute',
    width: 40,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#228b22',
    top: '35%',
    right: '25%',
    opacity: 0.8,
  },
  corn: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#ffd700',
    bottom: '30%',
    left: '35%',
    opacity: 0.9,
  },
  cameraFrame: {
    position: 'absolute',
    width: screenWidth * 0.85,
    height: screenWidth * 0.85,
    borderWidth: 2,
    borderColor: COLORS.surface,
    borderStyle: 'dashed',
    borderRadius: 20,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.surface,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  centerLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.surface,
    opacity: 0.5,
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

