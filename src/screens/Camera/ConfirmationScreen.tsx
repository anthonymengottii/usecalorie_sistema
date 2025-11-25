/**
 * CalorIA - Confirmation Screen
 * Edit and confirm AI-detected food before saving
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { TextInput } from '../../components/UI/TextInput';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { CameraService } from '../../services/CameraService';
import { useFoodStore } from '../../store/foodStore';
import { useUserStore } from '../../store/userStore';
import { firebaseService } from '../../services/FirebaseService';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING } from '../../utils/constants';
import type {
  FoodRecognitionResult,
  MealType,
  FoodEntry,
  Food,
  RecognizedFoodAlternative,
} from '../../types';

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Café da manhã', emoji: '🌅' },
  { value: 'lunch', label: 'Almoço', emoji: '☀️' },
  { value: 'dinner', label: 'Jantar', emoji: '🌙' },
  { value: 'snack', label: 'Lanche', emoji: '🍪' },
];

export const ConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { imageUri: string; recognitionResult?: FoodRecognitionResult };
  const imageUri = params.imageUri;
  const recognitionResult = params.recognitionResult || null;
  const { addFoodEntry } = useFoodStore();
  const { user } = useUserStore();

  // Safety check: if no recognition result, go back
  if (!recognitionResult) {
    console.error('❌ ConfirmationScreen: No recognition result provided');
    navigation.goBack();
    return null;
  }

  const initialFood: Food = recognitionResult.detectedFood || {
    id: `food_${Date.now()}`,
    name: 'Alimento desconhecido',
    brand: 'CalorIA',
    barcode: undefined,
    nutrition: recognitionResult.nutrition,
    servingSize: {
      amount: 1,
      unit: 'porção',
      grams: 100,
    },
    category: 'unknown',
    verified: false,
  };

  const [selectedFood, setSelectedFood] = useState<Food>(initialFood);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [portionAmount, setPortionAmount] = useState(
    recognitionResult.suggestedPortion?.amount?.toString() || '1'
  );
  const [portionUnit, setPortionUnit] = useState(
    recognitionResult.suggestedPortion?.unit || selectedFood.servingSize?.unit || 'porção'
  );
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get food details from service
  const foodDetails = CameraService.getFoodById(selectedFood.id) || selectedFood;
  const basePortionGrams =
    recognitionResult.suggestedPortion?.grams ||
    foodDetails.servingSize?.grams ||
    100;

  // Calculate nutrition based on portion
  const calculateNutrition = () => {
    // Get base nutrition from foodDetails (mock) or recognitionResult (AI)
    const baseNutrition = foodDetails?.nutrition || recognitionResult.nutrition;

    // multiplier = (number of portions) * (grams per portion) / 100
    // Example: 2 portions * 100g per portion / 100 = multiplier of 2
    const quantity = parseFloat(portionAmount) || 1;
    const multiplier = quantity * basePortionGrams / 100; // Base nutrition is per 100g

    return {
      calories: baseNutrition.calories * multiplier,
      protein: baseNutrition.protein * multiplier,
      carbs: baseNutrition.carbs * multiplier,
      fat: baseNutrition.fat * multiplier,
      fiber: (baseNutrition.fiber || 0) * multiplier,
      sugar: (baseNutrition.sugar || 0) * multiplier,
      sodium: (baseNutrition.sodium || 0) * multiplier,
      cholesterol: (baseNutrition.cholesterol || 0) * multiplier,
      saturatedFat: (baseNutrition.saturatedFat || 0) * multiplier,
      transFat: (baseNutrition.transFat || 0) * multiplier,
      potassium: (baseNutrition.potassium || 0) * multiplier,
      calcium: (baseNutrition.calcium || 0) * multiplier,
      iron: (baseNutrition.iron || 0) * multiplier,
      vitaminA: (baseNutrition.vitaminA || 0) * multiplier,
      vitaminC: (baseNutrition.vitaminC || 0) * multiplier,
    };
  };

  const currentNutrition = calculateNutrition();

  const handleSaveFood = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para salvar alimentos');
      return;
    }

    setIsLoading(true);

    try {
      const quantity = parseFloat(portionAmount) || 1;

      const foodEntry: Omit<FoodEntry, 'id'> = {
        userId: user.id,
        foodId: selectedFood.id,
        food: selectedFood,
        quantity: quantity,
        servingSize: {
          amount: quantity,
          unit: portionUnit,
          grams: basePortionGrams * quantity,
        },
        nutrition: currentNutrition,
        mealType: selectedMealType,
        date: new Date(),
        imageUrl: imageUri,
        ...(notes.trim() && { notes: notes.trim() }),
      };

      // Save entry (foodStore will handle persistence and stats update)
      await addFoodEntry(foodEntry);

      console.log('✅ Food entry saved successfully');

      Alert.alert(
        'Sucesso! 🎉',
        `${selectedFood.name} foi adicionado ao seu histórico nutricional.`,
        [
          {
            text: 'Ver histórico',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Camera' }],
              });
            },
          },
          {
            text: 'Adicionar outro',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Camera' }],
              });
            },
            style: 'default',
          },
        ]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar o alimento. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternativeFood = (alternativeFood: RecognizedFoodAlternative) => {
    setSelectedFood(alternativeFood.food);
    setPortionUnit(alternativeFood.food.servingSize?.unit || portionUnit);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return COLORS.success;
    if (confidence >= 0.8) return COLORS.primary;
    if (confidence >= 0.7) return COLORS.secondary;
    return COLORS.error;
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Muito alta';
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.7) return 'Média';
    return 'Baixa';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.title}>Confirme sua refeição</Heading2>
          <Caption color="textSecondary">
            Revise e edite as informações antes de salvar
          </Caption>
        </View>

        {/* Detection Result */}
        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Image
              source={{ uri: imageUri }}
              style={styles.resultImage}
              resizeMode="cover"
            />
            <View style={styles.resultInfo}>
              <View style={styles.detectionBadge}>
                <BodyText style={styles.detectionEmoji}>🍽️</BodyText>
                <BodyText style={styles.detectionName}>
                  {selectedFood.name}
                </BodyText>
              </View>
              <View style={styles.confidenceContainer}>
                <View style={[
                  styles.confidenceBadge,
                  { backgroundColor: getConfidenceColor(recognitionResult.confidence) }
                ]}>
                  <Caption style={styles.confidenceText}>
                    {getConfidenceLabel(recognitionResult.confidence)} • {Math.round(recognitionResult.confidence * 100)}%
                  </Caption>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Alternatives */}
        {recognitionResult.alternatives.length > 0 && (
          <Card style={styles.alternativesCard}>
            <Heading3 style={styles.sectionTitle}>
              Não está correto? Experimente estas opções:
            </Heading3>
            <ScrollView horizontal showsHorizontalScrollIndicator={Boolean(false)}>
              <View style={styles.alternatives}>
                {recognitionResult.alternatives.map((alt, index) => {
                  const altDetails = CameraService.getFoodById(alt.food.id);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.alternativeItem}
                      onPress={() => handleAlternativeFood(alt)}
                    >
                        <BodyText style={styles.alternativeEmoji}>🍽️</BodyText>
                      <Caption style={styles.alternativeName}>
                        {alt.food.name}
                      </Caption>
                      <Caption color="textSecondary" style={styles.alternativeConfidence}>
                        {Math.round(alt.confidence * 100)}%
                      </Caption>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Card>
        )}

        {/* Portion Editor */}
        <Card style={styles.portionCard}>
          <Heading3 style={styles.sectionTitle}>Quantidade consumida</Heading3>
          <View style={styles.portionEditor}>
            <View style={styles.portionInputs}>
              <View style={styles.portionInput}>
                <Caption color="textSecondary">Quantidade</Caption>
                <TextInput
                  value={portionAmount}
                  onChangeText={setPortionAmount}
                  placeholder="1"
                  keyboardType="numeric"
                  style={styles.amountInput}
                />
              </View>
              <View style={styles.portionUnit}>
                <Caption color="textSecondary">Unidade</Caption>
                <BodyText style={styles.unitText}>{portionUnit}</BodyText>
              </View>
            </View>
            <Caption color="textSecondary" style={styles.portionNote}>
              ≈ {Math.round(basePortionGrams * (parseFloat(portionAmount) || 1))}g total
            </Caption>
          </View>
        </Card>

        {/* Meal Type Selector */}
        <Card style={styles.mealTypeCard}>
          <Heading3 style={styles.sectionTitle}>Tipo de refeição</Heading3>
          <View style={styles.mealTypes}>
            {MEAL_TYPES.map((mealType) => (
              <TouchableOpacity
                key={mealType.value}
                style={[
                  styles.mealTypeButton,
                  selectedMealType === mealType.value && styles.mealTypeButtonActive
                ]}
                onPress={() => setSelectedMealType(mealType.value)}
              >
                <BodyText style={styles.mealTypeEmoji}>
                  {mealType.emoji}
                </BodyText>
                <Caption style={[
                  styles.mealTypeLabel,
                  selectedMealType === mealType.value && styles.mealTypeLabelActive
                ]}>
                  {mealType.label}
                </Caption>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Nutrition Summary */}
        <Card style={styles.nutritionCard}>
          <Heading3 style={styles.sectionTitle}>Informações nutricionais</Heading3>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.calories)}
              </BodyText>
              <Caption color="textSecondary">Calorias</Caption>
            </View>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.protein)}g
              </BodyText>
              <Caption color="textSecondary">Proteína</Caption>
            </View>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.carbs)}g
              </BodyText>
              <Caption color="textSecondary">Carboidratos</Caption>
            </View>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.fat)}g
              </BodyText>
              <Caption color="textSecondary">Gorduras</Caption>
            </View>
          </View>
          
          {currentNutrition.fiber > 0 && (
            <View style={styles.additionalNutrition}>
              <Caption color="textSecondary">
                Fibra: {Math.round(currentNutrition.fiber)}g • 
                Açúcar: {Math.round(currentNutrition.sugar)}g • 
                Sódio: {Math.round(currentNutrition.sodium)}mg
              </Caption>
            </View>
          )}
        </Card>

        {/* Notes */}
        <Card style={styles.notesCard}>
          <Heading3 style={styles.sectionTitle}>Notas (opcional)</Heading3>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Adicionar observações sobre esta refeição..."
            multiline={true}
            numberOfLines={3}
            inputStyle={styles.notesInput}
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Tirar outra foto"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title={isLoading ? "Salvando..." : "Salvar refeição"}
            onPress={handleSaveFood}
            disabled={isLoading}
            style={[styles.actionButton, styles.saveButton]}
          />
        </View>
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
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  resultCard: {
    marginBottom: SPACING.md,
  },
  resultHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detectionEmoji: {
    fontSize: 24,
  },
  detectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  confidenceContainer: {
    alignItems: 'flex-start',
  },
  confidenceBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  confidenceText: {
    color: COLORS.surface,
    fontWeight: '500',
    fontSize: 12,
  },
  alternativesCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  alternatives: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  alternativeItem: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    minWidth: 80,
  },
  alternativeEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  alternativeName: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontSize: 12,
  },
  alternativeConfidence: {
    fontSize: 10,
  },
  portionCard: {
    marginBottom: SPACING.md,
  },
  portionEditor: {
    gap: SPACING.md,
  },
  portionInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  portionInput: {
    flex: 1,
  },
  amountInput: {
    marginTop: SPACING.xs,
  },
  portionUnit: {
    flex: 2,
  },
  unitText: {
    marginTop: SPACING.sm,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  portionNote: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mealTypeCard: {
    marginBottom: SPACING.md,
  },
  mealTypes: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  mealTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  mealTypeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  mealTypeEmoji: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  mealTypeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  mealTypeLabelActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  nutritionCard: {
    marginBottom: SPACING.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  additionalNutrition: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notesCard: {
    marginBottom: SPACING.lg,
  },
  notesInput: {
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});