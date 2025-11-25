/**
 * CalorIA - Custom Tab Bar Component
 * Custom bottom tab bar with icons and labels
 */

import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
// BlurView completely removed for Android to avoid casting errors
// import { BlurView } from 'expo-blur';
import { COLORS } from '../../utils/constants';
import { logger } from '../../utils/logger';

const getTabIcon = (routeName: string, focused: boolean) => {
  const iconSize = 24;
  const iconColor = focused ? COLORS.primary : COLORS.textSecondary;

  switch (routeName) {
    case 'Home':
      return <MaterialIcons name="home" size={iconSize} color={iconColor} />;
    case 'Camera':
      return <MaterialIcons name="camera-alt" size={iconSize} color={iconColor} />;
    case 'History':
      return <MaterialIcons name="history" size={iconSize} color={iconColor} />;
    case 'Profile':
      return <MaterialIcons name="person" size={iconSize} color={iconColor} />;
    default:
      return <MaterialIcons name="circle" size={iconSize} color={iconColor} />;
  }
};

const getTabLabel = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'Início';
    case 'Camera':
      return 'Escanear';
    case 'History':
      return 'Histórico';
    case 'Profile':
      return 'Perfil';
    default:
      return routeName;
  }
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  useEffect(() => {
    logger.logComponentRender('CustomTabBar', {
      platform: Platform.OS,
      routesCount: state.routes.length,
      currentIndex: state.index,
    });
  }, [state.index, state.routes.length]);

  // Use View instead of BlurView to avoid Android casting errors
  return (
    <View style={styles.container}>
      <View style={styles.blurContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = getTabLabel(route.name);
          const isFocused = Boolean(state.index === index);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: Boolean(true),
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Normalize accessibilityState
          const accessibilityState = isFocused ? { selected: Boolean(true) } : { selected: Boolean(false) };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={accessibilityState}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={[styles.tabContent, isFocused && styles.tabContentFocused]}>
                {getTabIcon(route.name, isFocused)}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        paddingBottom: 20,
      },
      android: {
        paddingBottom: 10,
      },
    }),
  },
  blurContainer: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
      android: {
        backgroundColor: COLORS.surface,
      },
    }),
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  tabContentFocused: {
    backgroundColor: `${COLORS.primary}15`,
  },
});

