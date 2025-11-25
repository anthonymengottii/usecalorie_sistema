/**
 * CalorIA - Profile Setup Screen
 * User personal information setup
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/UI/Button';
import { TextInput } from '../../components/UI/TextInput';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';
import { useNavigation } from '../../utils/navigation';

type Gender = 'male' | 'female' | 'other';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  gender: Gender;
  activityLevel: ActivityLevel;
}

const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male', label: 'Masculino', emoji: '👨' },
  { value: 'female', label: 'Feminino', emoji: '👩' },
  { value: 'other', label: 'Outro', emoji: '🏳️‍⚧️' },
];

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { 
    value: 'sedentary', 
    label: 'Sedentário', 
    description: 'Pouco ou nenhum exercício'
  },
  { 
    value: 'light', 
    label: 'Leve', 
    description: 'Exercícios leves 1-3 dias/semana'
  },
  { 
    value: 'moderate', 
    label: 'Moderado', 
    description: 'Exercícios moderados 3-5 dias/semana'
  },
  { 
    value: 'active', 
    label: 'Ativo', 
    description: 'Exercícios intensos 6-7 dias/semana'
  },
  { 
    value: 'very_active', 
    label: 'Muito ativo', 
    description: 'Exercícios muito intensos, trabalho físico'
  },
];

export const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile>({
    age: 0,
    weight: 0,
    height: 0,
    targetWeight: 0,
    gender: 'male',
    activityLevel: 'moderate',
  });

  const [ageText, setAgeText] = useState('');
  const [weightText, setWeightText] = useState('');
  const [heightText, setHeightText] = useState('');
  const [targetWeightText, setTargetWeightText] = useState('');

  const handleNext = () => {
    const age = parseInt(ageText);
    const weight = parseFloat(weightText);
    const height = parseInt(heightText);
    const targetWeight = parseFloat(targetWeightText);

    if (!age || age < 13 || age > 120) {
      Alert.alert('Idade inválida', 'Informe uma idade entre 13 e 120 anos');
      return;
    }

    if (!weight || weight < 30 || weight > 300) {
      Alert.alert('Peso inválido', 'Informe um peso entre 30 e 300 kg');
      return;
    }

    if (!height || height < 100 || height > 250) {
      Alert.alert('Altura inválida', 'Informe uma altura entre 100 e 250 cm');
      return;
    }

    if (!targetWeight || targetWeight < 30 || targetWeight > 300) {
      Alert.alert('Peso objetivo inválido', 'Informe um peso objetivo entre 30 e 300 kg');
      return;
    }

    const userProfile: UserProfile = {
      age,
      weight,
      height,
      targetWeight,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
    };

    navigation.navigate('GoalsSetup', { userProfile });
  };

  const calculateBMI = () => {
    const weight = parseFloat(weightText);
    const height = parseInt(heightText);
    
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Abaixo do peso', color: COLORS.secondary };
    if (bmi < 25) return { label: 'Peso normal', color: COLORS.success };
    if (bmi < 30) return { label: 'Sobrepeso', color: COLORS.secondary };
    return { label: 'Obesidade', color: COLORS.error };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.title}>Conte sobre você</Heading2>
          <Caption color="textSecondary" style={styles.subtitle}>
            Essas informações nos ajudam a personalizar suas metas nutricionais
          </Caption>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <TextInput
                label="Idade"
                value={ageText}
                onChangeText={setAgeText}
                placeholder="25"
                keyboardType="numeric"
                maxLength={3}
                variant="filled"
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputBox}>
              <TextInput
                label="Peso (kg)"
                value={weightText}
                onChangeText={setWeightText}
                placeholder="70"
                keyboardType="decimal-pad"
                variant="filled"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <TextInput
                label="Altura (cm)"
                value={heightText}
                onChangeText={setHeightText}
                placeholder="170"
                keyboardType="numeric"
                maxLength={3}
                variant="filled"
                style={styles.input}
              />
            </View>

            <View style={styles.inputBox}>
              <TextInput
                label="Peso objetivo (kg)"
                value={targetWeightText}
                onChangeText={setTargetWeightText}
                placeholder="65"
                keyboardType="decimal-pad"
                variant="filled"
                style={styles.input}
              />
            </View>
          </View>

          {/* BMI Display */}
          {bmi && bmiCategory && (
            <View style={[styles.bmiCard, { borderLeftColor: bmiCategory.color }]}>
              <BodyText style={styles.bmiLabel}>Seu IMC:</BodyText>
              <BodyText style={[styles.bmiValue, { color: bmiCategory.color }]}>
                {bmi}
              </BodyText>
              <Caption style={[styles.bmiCategory, { color: bmiCategory.color }]}>
                {bmiCategory.label}
              </Caption>
            </View>
          )}
        </View>

        {/* Gender Selection */}
        <View style={styles.section}>
          <Heading3 style={styles.sectionTitle}>Gênero</Heading3>
          <View style={styles.optionsContainer}>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  profile.gender === option.value && styles.optionButtonActive
                ]}
                onPress={() => setProfile(prev => ({ ...prev, gender: option.value }))}
              >
                <BodyText style={styles.optionEmoji}>{option.emoji}</BodyText>
                <BodyText style={[
                  styles.optionLabel,
                  profile.gender === option.value && styles.optionLabelActive
                ]}>
                  {option.label}
                </BodyText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Heading3 style={styles.sectionTitle}>Nível de atividade</Heading3>
          <Caption color="textSecondary" style={styles.sectionDescription}>
            Isso nos ajuda a calcular suas necessidades calóricas diárias
          </Caption>
          
          <View style={styles.activityContainer}>
            {ACTIVITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.activityOption,
                  profile.activityLevel === level.value && styles.activityOptionActive
                ]}
                onPress={() => setProfile(prev => ({ ...prev, activityLevel: level.value }))}
              >
                <View style={styles.activityHeader}>
                  <BodyText style={[
                    styles.activityLabel,
                    profile.activityLevel === level.value && styles.activityLabelActive
                  ]}>
                    {level.label}
                  </BodyText>
                  {profile.activityLevel === level.value && (
                    <BodyText style={styles.checkmark}>✓</BodyText>
                  )}
                </View>
                <Caption style={[
                  styles.activityDescription,
                  profile.activityLevel === level.value && styles.activityDescriptionActive
                ]}>
                  {level.description}
                </Caption>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <Button
          title="Continuar"
          onPress={handleNext}
          size="large"
          fullWidth
          disabled={!ageText || !weightText || !heightText || !targetWeightText}
          style={styles.continueButton}
        />
      </ScrollView>
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
  content: {
    padding: SPACING.lg,
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
    fontSize: 18,
    fontWeight: '600',
  },
  sectionDescription: {
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
  },
  input: {
    marginBottom: 0,
  },
  bmiCard: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bmiLabel: {
    fontWeight: '500',
    fontSize: 14,
  },
  bmiValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  bmiCategory: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 'auto',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    minHeight: 80,
  },
  optionButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E6F7F3',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  optionLabel: {
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  optionLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  activityContainer: {
    gap: SPACING.sm,
  },
  activityOption: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  activityOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E6F7F3',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  activityLabel: {
    fontWeight: '600',
    color: COLORS.text,
  },
  activityLabelActive: {
    color: COLORS.primary,
  },
  checkmark: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  activityDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  activityDescriptionActive: {
    color: COLORS.textSecondary,
  },
  continueButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
});