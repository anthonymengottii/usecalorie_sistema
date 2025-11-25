/**
 * CalorIA - Camera Service
 * Handles camera operations and food recognition
 */

import type { FoodRecognitionResult } from '../types';

export class CameraService {
  /**
   * Recognize food from image
   * Demo version - returns mock data
   */
  static async recognizeFood(imageUri: string): Promise<FoodRecognitionResult> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock recognition result
      const mockResult: FoodRecognitionResult = {
        success: true,
        food: {
          id: `food_${Date.now()}`,
          name: 'Pollo a la Plancha',
          nutrition: {
            calories: 250,
            protein: 30,
            carbs: 0,
            fat: 12,
            fiber: 0,
            sugar: 0,
            sodium: 450,
          },
          servingSize: {
            amount: 150,
            unit: 'g',
          },
          category: 'protein',
          verified: false,
        },
        confidence: 0.85,
        alternatives: [
          {
            id: 'alt_1',
            name: 'Pechuga de Pollo',
            nutrition: {
              calories: 231,
              protein: 43,
              carbs: 0,
              fat: 5,
              fiber: 0,
              sugar: 0,
              sodium: 400,
            },
            servingSize: {
              amount: 150,
              unit: 'g',
            },
            category: 'protein',
            verified: true,
          },
        ],
      };

      return mockResult;
    } catch (error) {
      console.error('❌ Error recognizing food:', error);
      return {
        success: false,
        error: 'No se pudo reconocer el alimento',
      };
    }
  }

  /**
   * Process image for recognition
   */
  static async processImage(imageUri: string): Promise<string> {
    try {
      // Demo: Return the same URI
      return imageUri;
    } catch (error) {
      console.error('❌ Error processing image:', error);
      throw error;
    }
  }
}

