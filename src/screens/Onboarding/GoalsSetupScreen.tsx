/**
 * CalorIA - Goals Setup Screen
 * Nutrition goals and objectives configuration
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';
import type { NutritionGoals } from '../../types';
import { useNavigation } from '../../utils/navigation';

type GoalType = 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'gain_muscle' | 'improve_health';
type WeightGoalRate = 'slow' | 'moderate' | 'fast';

interface GoalOption {
  id: GoalType;
  title: string;
  description: string;
  emoji: string;
  calorieModifier: number; // Multiplier for calorie needs
}

interface WeightRateOption {
  id: WeightGoalRate;
  title: string;
  description: string;
  calorieAdjustment: number; // Daily calorie adjustment
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'lose_weight',
    title: 'Perder peso',
    description: 'Criar déficit calórico para reduzir gordura corporal',
    emoji: '📉',
    calorieModifier: 0.85, // 15% reduction
  },
  {
    id: 'maintain_weight',
    title: 'Manter peso',
    description: 'Equilibrar calorias para manter o peso atual',
    emoji: '⚖️',
    calorieModifier: 1.0, // No change
  },
  {
    id: 'gain_weight',
    title: 'Ganhar peso',
    description: 'Criar superávit calórico para ganhar massa',
    emoji: '📈',
    calorieModifier: 1.15, // 15% increase
  },
  {
    id: 'gain_muscle',
    title: 'Ganhar músculo',
    description: 'Otimizar proteínas para desenvolvimento muscular',
    emoji: '💪',
    calorieModifier: 1.1, // 10% increase + high protein
  },
  {
    id: 'improve_health',
    title: 'Melhorar saúde',
    description: 'Foco em nutrição equilibrada e bem-estar',
    emoji: '🌱',
    calorieModifier: 1.0, // Maintain with balanced macros
  },
];

const WEIGHT_RATE_OPTIONS: WeightRateOption[] = [
  {
    id: 'slow',
    title: 'Lento e sustentável',
    description: '0,25 kg por semana',
    calorieAdjustment: 250, // ±250 calories
  },
  {
    id: 'moderate',
    title: 'Moderado',
    description: '0,5 kg por semana',
    calorieAdjustment: 500, // ±500 calories
  },
  {
    id: 'fast',
    title: 'Rápido',
    description: '0,75 kg por semana',
    calorieAdjustment: 750, // ±750 calories
  },
];

interface GoalsSetupProfile {
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export const GoalsSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { userProfile: GoalsSetupProfile };
  const userProfile = params.userProfile;
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('maintain_weight');
  const [selectedRate, setSelectedRate] = useState<WeightGoalRate>('moderate');

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const { weight, height, age, gender } = userProfile;
    
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const activityMultipliers: Record<GoalsSetupProfile['activityLevel'], number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    return bmr * activityMultipliers[userProfile.activityLevel];
  };

  const calculateWeeklyGoal = () => {
    const rateMap: Record<WeightGoalRate, number> = { slow: 0.25, moderate: 0.5, fast: 0.75 };
    return rateMap[selectedRate];
  };

  const calculateTargetDate = () => {
    const { weight, targetWeight } = userProfile;
    const weightDifference = Math.abs(targetWeight - weight);
    const weeklyGoal = calculateWeeklyGoal();
    const weeksNeeded = Math.ceil(weightDifference / weeklyGoal);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (weeksNeeded * 7));
    return targetDate;
  };

  const nutritionGoals = useMemo((): NutritionGoals => {
    const tdee = calculateTDEE();
    const selectedGoalOption = GOAL_OPTIONS.find(g => g.id === selectedGoal)!;
    const selectedRateOption = WEIGHT_RATE_OPTIONS.find(r => r.id === selectedRate)!;

    let targetCalories = tdee * selectedGoalOption.calorieModifier;

    if (selectedGoal === 'lose_weight') {
      targetCalories -= selectedRateOption.calorieAdjustment;
    } else if (selectedGoal === 'gain_weight' || selectedGoal === 'gain_muscle') {
      targetCalories += selectedRateOption.calorieAdjustment;
    }

    targetCalories = Math.max(targetCalories, 1200);

    let proteinPercentage = 0.25;
    let carbPercentage = 0.45;
    let fatPercentage = 0.30;

    if (selectedGoal === 'gain_muscle') {
      proteinPercentage = 0.30;
      carbPercentage = 0.40;
      fatPercentage = 0.30;
    } else if (selectedGoal === 'lose_weight') {
      proteinPercentage = 0.30;
      carbPercentage = 0.35;
      fatPercentage = 0.35;
    }

    const proteinCalories = targetCalories * proteinPercentage;
    const carbCalories = targetCalories * carbPercentage;
    const fatCalories = targetCalories * fatPercentage;

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbCalories / 4),
      fat: Math.round(fatCalories / 9),
      fiber: Math.round(targetCalories / 1000 * 14),
      sugar: Math.round(targetCalories / 1000 * 25),
      sodium: 2300,
    };
  }, [selectedGoal, selectedRate, userProfile]);

  const handleComplete = () => {
    const enhancedProfile = {
      ...userProfile,
      goalType: selectedGoal,
      weeklyGoal: calculateWeeklyGoal(),
      targetDate: calculateTargetDate().toISOString(),
      bmi: parseFloat(((userProfile.weight / Math.pow(userProfile.height / 100, 2))).toFixed(1)),
      bmr: calculateBMR(),
      tdee: calculateTDEE(),
    };

    navigation.navigate('Completion', {
      userProfile: enhancedProfile,
      nutritionGoals,
    });
  };

  const showWeightRateOptions = selectedGoal === 'lose_weight' || selectedGoal === 'gain_weight' || selectedGoal === 'gain_muscle';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.title}>Qual é o seu objetivo?</Heading2>
          <Caption color="textSecondary" style={styles.subtitle}>
            Vamos basear suas recomendações nutricionais no seu objetivo principal
          </Caption>
        </View>

        {/* Goal Selection */}
        <View style={styles.section}>
          <Heading3 style={styles.sectionTitle}>Objetivo principal</Heading3>
          <View style={styles.goalsContainer}>
            {GOAL_OPTIONS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  selectedGoal === goal.id && styles.goalOptionActive
                ]}
                onPress={() => setSelectedGoal(goal.id)}
              >
                <View style={styles.goalHeader}>
                  <BodyText style={styles.goalEmoji}>{goal.emoji}</BodyText>
                  <View style={styles.goalInfo}>
                    <BodyText style={[
                      styles.goalTitle,
                      selectedGoal === goal.id && styles.goalTitleActive
                    ]}>
                      {goal.title}
                    </BodyText>
                    <Caption style={[
                      styles.goalDescription,
                      selectedGoal === goal.id && styles.goalDescriptionActive
                    ]}>
                      {goal.description}
                    </Caption>
                  </View>
                  {selectedGoal === goal.id && (
                    <BodyText style={styles.checkmark}>✓</BodyText>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight Change Rate (conditional) */}
        {showWeightRateOptions && (
          <View style={styles.section}>
            <Heading3 style={styles.sectionTitle}>
              Velocidade de {selectedGoal === 'lose_weight' ? 'Perda' : 'Ganho'}
            </Heading3>
            <Caption color="textSecondary" style={styles.sectionDescription}>
              Uma velocidade mais lenta é mais sustentável e saudável
            </Caption>
            
            <View style={styles.ratesContainer}>
              {WEIGHT_RATE_OPTIONS.map((rate) => (
                <TouchableOpacity
                  key={rate.id}
                  style={[
                    styles.rateOption,
                    selectedRate === rate.id && styles.rateOptionActive
                  ]}
                  onPress={() => setSelectedRate(rate.id)}
                >
                  <View style={styles.rateHeader}>
                    <BodyText style={[
                      styles.rateTitle,
                      selectedRate === rate.id && styles.rateTitleActive
                    ]}>
                      {rate.title}
                    </BodyText>
                    {selectedRate === rate.id && (
                      <BodyText style={styles.checkmark}>✓</BodyText>
                    )}
                  </View>
                  <Caption style={[
                    styles.rateDescription,
                    selectedRate === rate.id && styles.rateDescriptionActive
                  ]}>
                    {rate.description}
                  </Caption>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Calculated Goals Preview */}
        <View style={styles.previewCard}>
          <Heading3 style={styles.previewTitle}>Seus objetivos nutricionais</Heading3>
          <Caption color="textSecondary" style={styles.previewDescription}>
            Calculados com base no seu perfil e objetivos
          </Caption>
          
          <View style={styles.goalsGrid}>
            <View style={[styles.goalStatCard, styles.caloriesCard]}>
              <BodyText style={styles.goalStatEmoji}>🔥</BodyText>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.calories}
              </BodyText>
              <Caption color="textSecondary" style={styles.goalStatLabel}>Calorias</Caption>
            </View>
            <View style={[styles.goalStatCard, styles.proteinCard]}>
              <BodyText style={styles.goalStatEmoji}>🥩</BodyText>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.protein}g
              </BodyText>
              <Caption color="textSecondary" style={styles.goalStatLabel}>Proteína</Caption>
            </View>
            <View style={[styles.goalStatCard, styles.carbsCard]}>
              <BodyText style={styles.goalStatEmoji}>🍞</BodyText>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.carbs}g
              </BodyText>
              <Caption color="textSecondary" style={styles.goalStatLabel}>Carbs</Caption>
            </View>
            <View style={[styles.goalStatCard, styles.fatCard]}>
              <BodyText style={styles.goalStatEmoji}>🥑</BodyText>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.fat}g
              </BodyText>
              <Caption color="textSecondary" style={styles.goalStatLabel}>Gorduras</Caption>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Complete Button - Fixed at bottom */}
      <View style={styles.actionsContainer}>
        <Button
          title="Concluir configuração"
          onPress={handleComplete}
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
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  sectionDescription: {
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  goalsContainer: {
    gap: SPACING.sm,
  },
  goalOption: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  goalOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E6F7F3',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  goalEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  goalTitleActive: {
    color: COLORS.primary,
  },
  goalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  goalDescriptionActive: {
    color: COLORS.textSecondary,
  },
  checkmark: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  ratesContainer: {
    gap: SPACING.sm,
  },
  rateOption: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  rateOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E6F7F3',
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  rateTitle: {
    fontWeight: '600',
    color: COLORS.text,
  },
  rateTitleActive: {
    color: COLORS.primary,
  },
  rateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  rateDescriptionActive: {
    color: COLORS.textSecondary,
  },
  previewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    marginBottom: SPACING.xs,
    fontSize: 20,
    fontWeight: '600',
  },
  previewDescription: {
    marginBottom: SPACING.lg,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  goalStatCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  caloriesCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  proteinCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  carbsCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  fatCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  goalStatEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
    lineHeight: 40,
    textAlign: 'center',
    minHeight: 40,
  },
  goalStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  goalStatLabel: {
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
});