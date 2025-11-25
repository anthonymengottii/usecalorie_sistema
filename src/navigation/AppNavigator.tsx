/**
 * CalorIA - Main App Navigator
 * Root navigation structure with authentication flow
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

import { useUserStore } from '../store/userStore';
import { COLORS } from '../utils/constants';
import type { RootStackParamList, MainTabParamList } from '../types';
import { CustomTabBar } from '../components/Navigation/CustomTabBar';

// Import screens
import { OnboardingCarousel } from '../screens/Onboarding/OnboardingCarousel';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { OnboardingStackNavigator } from './OnboardingStackNavigator';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { CameraStackNavigator } from './CameraStackNavigator';
import { HistoryScreen } from '../screens/History/HistoryScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShown: Boolean(false),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          headerShown: Boolean(false),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraStackNavigator}
        options={{
          title: 'Escanear',
          headerShown: Boolean(false),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Historial',
          headerShown: Boolean(false),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: 'Perfil',
          headerShown: Boolean(false),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isOnboardingCompleted, isLoading, isInitialized, initialize } = useUserStore();

  useEffect(() => {
    console.log('🔄 AppNavigator state changed:', {
      isAuthenticated,
      isOnboardingCompleted,
      isLoading,
      isInitialized,
    });
  }, [isAuthenticated, isOnboardingCompleted, isLoading, isInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Show loading screen while initializing or loading
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Iniciando CalorIA...</Text>
      </View>
    );
  }

  // Determine initial route based on auth state
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isAuthenticated) return 'Landing';
    if (!isOnboardingCompleted) return 'Onboarding';
    return 'Main';
  };

  const navigatorKey = `${isAuthenticated}-${isOnboardingCompleted}`;

  return (
    <>
      <StatusBar style="light" />
      <Stack.Navigator
        key={navigatorKey}
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: Boolean(false),
        }}
      >
        <Stack.Screen 
          name="Landing" 
          component={OnboardingCarousel}
          options={{ headerShown: Boolean(false) }}
        />
        <Stack.Screen 
          name="Auth" 
          component={LoginScreen}
          options={{ headerShown: Boolean(false) }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingStackNavigator}
          options={{ headerShown: Boolean(false) }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{ headerShown: Boolean(false) }}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});