/**
 * CalorIA - Camera Stack Navigator
 * Navigation flow for camera and food recognition
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../utils/constants';
import type { FoodRecognitionResult } from '../types';

import { CameraScreen } from '../screens/Camera/CameraScreen';
import { ProcessingScreen } from '../screens/Camera/ProcessingScreen';
import { ConfirmationScreen } from '../screens/Camera/ConfirmationScreen';

type CameraStackParamList = {
  Camera: undefined;
  Processing: {
    imageUri: string;
  };
  Confirmation: {
    imageUri: string;
    recognitionResult: FoodRecognitionResult;
  };
};

const Stack = createStackNavigator<CameraStackParamList>();

export const CameraStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          title: 'Escanear refeição',
          headerShown: Boolean(false), // Camera screen handles its own header
        }}
      />
      <Stack.Screen 
        name="Processing" 
        component={ProcessingScreen}
        options={{
          title: 'Processando...',
          headerLeft: () => null, // Prevent going back during processing
          gestureEnabled: Boolean(false),
        }}
      />
      <Stack.Screen 
        name="Confirmation" 
        component={ConfirmationScreen}
        options={{
          title: 'Confirmar Comida',
        }}
      />
    </Stack.Navigator>
  );
};