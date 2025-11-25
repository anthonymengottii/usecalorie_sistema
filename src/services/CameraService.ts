/**
 * CalorIA - Camera Service
 * Handles camera operations and food recognition
 */

import type { FoodRecognitionResult, Food } from '../types';

const MOCK_FOODS: Food[] = [
  {
    id: 'food_grilled_chicken',
    name: 'Frango grelhado',
    brand: 'CalorIA Kitchen',
    barcode: undefined,
    nutrition: {
      calories: 250,
      protein: 30,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 450,
      cholesterol: 85,
      saturatedFat: 2,
      transFat: 0,
      potassium: 300,
      calcium: 20,
      iron: 1.2,
      vitaminA: 0,
      vitaminC: 0,
    },
    servingSize: {
      amount: 150,
      unit: 'g',
      grams: 150,
    },
    category: 'protein',
    verified: false,
  },
  {
    id: 'food_chicken_breast',
    name: 'Peito de frango',
    brand: 'CalorIA Kitchen',
    barcode: undefined,
    nutrition: {
      calories: 231,
      protein: 43,
      carbs: 0,
      fat: 5,
      fiber: 0,
      sugar: 0,
      sodium: 400,
      cholesterol: 80,
      saturatedFat: 1.2,
      transFat: 0,
      potassium: 330,
      calcium: 15,
      iron: 1,
      vitaminA: 0,
      vitaminC: 0,
    },
    servingSize: {
      amount: 150,
      unit: 'g',
      grams: 150,
    },
    category: 'protein',
    verified: true,
  },
];

export class CameraService {
  private static foodCatalog = new Map<string, Food>(
    MOCK_FOODS.map((food) => [food.id, food])
  );

  /**
   * Recognize food from image
   * Demo version - returns mock data
   */
  static async recognizeFood(imageUri: string): Promise<FoodRecognitionResult> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const detectedFood = CameraService.foodCatalog.get('food_grilled_chicken') || MOCK_FOODS[0];
      const alternativeFood = CameraService.foodCatalog.get('food_chicken_breast') || MOCK_FOODS[1];

      const mockResult: FoodRecognitionResult = {
        id: `recognition_${Date.now()}`,
        detectedFood,
        nutrition: detectedFood.nutrition,
        imageUrl: imageUri,
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        suggestedPortion: {
          amount: 1,
          unit: 'porção (150g)',
          grams: detectedFood.servingSize.grams || 150,
        },
        alternatives: [
          {
            id: alternativeFood.id,
            food: alternativeFood,
            confidence: 0.72,
          },
        ],
      };

      return mockResult;
    } catch (error) {
      console.error('❌ Error recognizing food:', error);
      throw error;
    }
  }

  /**
   * Process image for recognition
   */
  static async processImage(imageUri: string): Promise<FoodRecognitionResult> {
    return this.recognizeFood(imageUri);
  }

  static getFoodById(foodId: string): Food | undefined {
    return this.foodCatalog.get(foodId);
  }
}

