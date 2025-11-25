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
import { COLORS, SPACING } from '../../utils/constants';
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
              canPreventDefault: true,
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
          const accessibilityState = isFocused ? { selected: true } : undefined;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={accessibilityState}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
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
    zIndex: 1000,
  },
  blurContainer: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    ...Platform.select({
      ios: {
        backgroundColor: COLORS.surface,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        backgroundColor: COLORS.surface,
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    minWidth: 56,
    minHeight: 44,
  },
  tabContentFocused: {
    backgroundColor: '#E6F7F3',
    borderRadius: 18,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});

