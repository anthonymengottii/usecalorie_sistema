/**
 * CalorIA - Onboarding Stack Navigator
 * First-time user experience flow
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../utils/constants';

import { WelcomeScreen } from '../screens/Onboarding/WelcomeScreen';
import { FeaturesScreen } from '../screens/Onboarding/FeaturesScreen';
import { ProfileSetupScreen } from '../screens/Onboarding/ProfileSetupScreen';
import { GoalsSetupScreen } from '../screens/Onboarding/GoalsSetupScreen';
import { CompletionScreen } from '../screens/Onboarding/CompletionScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Features: undefined;
  ProfileSetup: undefined;
  GoalsSetup: {
    userProfile: {
      age: number;
      weight: number;
      height: number;
      targetWeight: number;
      gender: 'male' | 'female' | 'other';
      activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    };
  };
  Completion: {
    userProfile: any;
    nutritionGoals: any;
  };
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export const OnboardingStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        gestureEnabled: Boolean(false), // Prevent swiping back during onboarding
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          headerShown: Boolean(false),
        }}
      />
      <Stack.Screen 
        name="Features" 
        component={FeaturesScreen}
        options={{
          title: 'Conheça o CalorIA',
          headerShown: Boolean(false),
        }}
      />
      <Stack.Screen 
        name="ProfileSetup" 
        component={ProfileSetupScreen}
        options={{
          title: 'Seu perfil',
        }}
      />
      <Stack.Screen 
        name="GoalsSetup" 
        component={GoalsSetupScreen}
        options={{
          title: 'Suas metas',
        }}
      />
      <Stack.Screen 
        name="Completion" 
        component={CompletionScreen}
        options={{
          headerShown: Boolean(false),
          gestureEnabled: Boolean(false),
        }}
      />
    </Stack.Navigator>
  );
};