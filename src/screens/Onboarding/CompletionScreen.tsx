/**
 * CalorIA - Completion Screen
 * Onboarding completion and welcome to the app
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Button } from '../../components/UI/Button';
import { Heading1, Heading2, BodyText, Caption } from '../../components/UI/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import { useFoodStore } from '../../store/foodStore';
import { firebaseService } from '../../services/FirebaseService';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING } from '../../utils/constants';

export const CompletionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { userProfile?: any; nutritionGoals?: any };
  const userProfile = params.userProfile
    ? {
        ...params.userProfile,
        targetDate: params.userProfile.targetDate
          ? new Date(params.userProfile.targetDate)
          : params.userProfile.targetDate,
      }
    : null;
  const nutritionGoals = params.nutritionGoals || null;
  const { completeOnboarding, updateProfile } = useUserStore();
  const { updateNutritionGoals } = useFoodStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Scale animation for success icon
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: Boolean(true),
    }).start();

    // Fade in animation for content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleGetStarted = async () => {
    console.log('🚀 handleGetStarted called!');
    setIsLoading(true);

    try {
      const user = useUserStore.getState().user;
      if (!user) {
        console.error('❌ No user found in store');
      Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      const firestorePromise = (async () => {
        try {
          const profileSaved = await firebaseService.saveUserProfile(user.id, {
            age: userProfile.age,
            weight: userProfile.weight,
            height: userProfile.height,
            targetWeight: userProfile.targetWeight,
            bmi: userProfile.bmi,
            bmr: userProfile.bmr,
            tdee: userProfile.tdee,
            gender: userProfile.gender,
            activityLevel: userProfile.activityLevel,
            goalType: userProfile.goalType,
            weeklyGoal: userProfile.weeklyGoal,
            targetDate: userProfile.targetDate,
            goals: nutritionGoals,
            preferences: {
              units: 'metric',
              language: 'es',
              notifications: {
                mealReminders: true,
                waterReminders: true,
                goalAchievements: true,
                weeklyReports: true,
              },
              privacy: {
                shareData: false,
                analytics: true,
              },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const statsSaved = await firebaseService.saveUserStats(user.id, {
            currentStreak: 0,
            longestStreak: 0,
            totalDaysTracked: 0,
            totalMealsLogged: 0,
            avgCaloriesPerDay: 0,
            lastActivityDate: new Date(),
          });

          return { profileSaved, statsSaved };
        } catch (error) {
          console.error('⚠️  Firestore save failed:', error);
          return null;
        }
      })();

      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve(null), 5000)
      );

      const result = await Promise.race([firestorePromise, timeoutPromise]);

      if (!result) {
        console.warn('⚠️  Firestore sync skipped');
      }

      await updateProfile({
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
        targetWeight: userProfile.targetWeight,
        bmi: userProfile.bmi,
        bmr: userProfile.bmr,
        tdee: userProfile.tdee,
        gender: userProfile.gender,
        activityLevel: userProfile.activityLevel,
        goalType: userProfile.goalType,
        weeklyGoal: userProfile.weeklyGoal,
        targetDate: userProfile.targetDate,
        goals: nutritionGoals,
        preferences: {
          units: 'metric',
          language: 'es',
          notifications: {
            mealReminders: true,
            waterReminders: true,
            goalAchievements: true,
            weeklyReports: true,
          },
          privacy: {
            shareData: false,
            analytics: true,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      updateNutritionGoals(nutritionGoals);
      await completeOnboarding();
      setIsLoading(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as const }],
      });

    } catch (error) {
      console.error('❌ CRITICAL ERROR completing onboarding:', error);
      Alert.alert('Erro', 'Ocorreu um problema ao concluir o onboarding. Tente novamente.');
      setIsLoading(false);
    }
  };

  const calculateBMI = () => {
    const heightInMeters = userProfile.height / 100;
    return (userProfile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <BodyText style={styles.successEmoji}>🎉</BodyText>
        </Animated.View>

        {/* Title and Description */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Heading1 style={styles.title}>Perfeito!</Heading1>
          <BodyText align="center" color="textSecondary" style={styles.subtitle}>
            Seu perfil nutricional personalizado{'\n'}está pronto para começar
          </BodyText>
        </Animated.View>

        {/* Summary Stats */}
        {userProfile && nutritionGoals && (
          <Animated.View style={[styles.summaryContainer, { opacity: fadeAnim }]}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <BodyText style={styles.summaryValue}>
                  {nutritionGoals.calories}
                </BodyText>
                <Caption color="textSecondary" style={styles.summaryLabel}>
                  Calorias/dia
                </Caption>
              </View>
              <View style={styles.summaryItem}>
                <BodyText style={styles.summaryValue}>
                  {userProfile.targetWeight}kg
                </BodyText>
                <Caption color="textSecondary" style={styles.summaryLabel}>
                  Meta de peso
                </Caption>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Action Button - Fixed at bottom */}
      <View style={styles.actionsContainer}>
        <Button
          title={isLoading ? 'Salvando...' : 'Começar minha jornada'}
          onPress={handleGetStarted}
          size="large"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        />
        <Caption align="center" color="textSecondary" style={styles.disclaimer}>
          Você pode alterar essas metas a qualquer momento no seu perfil
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
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successEmoji: {
    fontSize: 64,
    lineHeight: 80,
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 24,
    fontSize: 16,
    marginBottom: SPACING.xl * 2,
  },
  summaryContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
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