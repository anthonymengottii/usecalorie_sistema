/**
 * CalorIA - Home Screen (Dashboard)
 * Main dashboard with daily nutrition overview
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// BlurView removed to avoid Android casting errors
import { useNavigation } from '../../utils/navigation';

import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { CalorieProgressChart, WeeklyCaloriesChart } from '../../components/UI/CaloriaChart';
import { DashboardSkeleton } from '../../components/UI/LoadingSkeleton';
import { useFoodStore } from '../../store/foodStore';
import { useUserStore } from '../../store/userStore';
import { COLORS, SPACING } from '../../utils/constants';
import { selectionFeedback } from '../../utils/haptics';


export const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const {
    todayStats,
    calculateDailyNutrition,
    getTodayEntries,
    waterIntake,
    addWaterIntake,
    loadWaterIntake,
    isLoading,
    foodEntries,
    nutritionGoals,
  } = useFoodStore();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    calculateDailyNutrition();

    if (user?.id) {
      loadWaterIntake(user.id);
    }
  }, [user?.id, calculateDailyNutrition, loadWaterIntake]);

  const handleRefresh = () => {
    calculateDailyNutrition();
  };

  const todayEntries = getTodayEntries();
  const hasEntries = todayEntries.length > 0;

  const weeklyData = useMemo(() => {
    if (!foodEntries.length || !nutritionGoals?.calories) {
      return null;
    }

    const sorted = [...foodEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const recent = sorted.slice(-7);

    if (!recent.length) return null;

    const labels = recent.map((entry) =>
      new Date(entry.date)
        .toLocaleDateString('pt-BR', { weekday: 'short' })
        .slice(0, 1)
        .toUpperCase()
    );
    const calories = recent.map((entry) => Math.round(entry.nutrition.calories));

    return {
      labels,
      calories,
      target: nutritionGoals.calories,
    };
  }, [foodEntries, nutritionGoals]);

  const getNutritionColor = (percentage: number) => {
    if (percentage < 90) return COLORS.error;
    if (percentage > 110) return COLORS.secondary;
    return COLORS.success;
  };

  // Show skeleton on initial load
  if (isLoading && !todayStats && todayEntries.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <StatusBar barStyle="dark-content" translucent={Boolean(true)} backgroundColor="transparent" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 0 + 20 }]}
        >
          <DashboardSkeleton
            showWaterWidget={Boolean(true)}
          />
        </ScrollView>
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.background }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="dark-content" translucent={Boolean(true)} backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Heading2 style={styles.headerTitle}>
            Olá, {user?.displayName || 'Usuário'}!
          </Heading2>
          <Caption color="textSecondary" style={styles.headerDate}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Caption>
        </View>

        {/* Nutrition Highlights */}
        {nutritionGoals && (
          <View style={styles.nutritionHighlights}>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionCard}>
                <BodyText style={styles.nutritionEmoji}>🔥</BodyText>
                <BodyText style={styles.nutritionValue}>
                  {hasEntries && todayStats 
                    ? Math.round(todayStats.progress.calories.current)
                    : nutritionGoals.calories
                  }
                </BodyText>
                <Caption color="textSecondary" style={styles.nutritionLabel}>
                  {hasEntries && todayStats 
                    ? `de ${todayStats.goals.calories} cal`
                    : 'Calorias/dia'
                  }
                </Caption>
              </View>
              <View style={styles.nutritionCard}>
                <BodyText style={styles.nutritionEmoji}>🥩</BodyText>
                <BodyText style={styles.nutritionValue}>
                  {hasEntries && todayStats
                    ? Math.round(todayStats.progress.protein.current)
                    : nutritionGoals.protein
                  }g
                </BodyText>
                <Caption color="textSecondary" style={styles.nutritionLabel}>Proteína</Caption>
              </View>
            </View>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionCard}>
                <BodyText style={styles.nutritionEmoji}>🍞</BodyText>
                <BodyText style={styles.nutritionValue}>
                  {hasEntries && todayStats
                    ? Math.round(todayStats.progress.carbs.current)
                    : nutritionGoals.carbs
                  }g
                </BodyText>
                <Caption color="textSecondary" style={styles.nutritionLabel}>Carbs</Caption>
              </View>
              <View style={styles.nutritionCard}>
                <BodyText style={styles.nutritionEmoji}>🥑</BodyText>
                <BodyText style={styles.nutritionValue}>
                  {hasEntries && todayStats
                    ? Math.round(todayStats.progress.fat.current)
                    : nutritionGoals.fat
                  }g
                </BodyText>
                <Caption color="textSecondary" style={styles.nutritionLabel}>Gorduras</Caption>
              </View>
            </View>
          </View>
        )}

        {/* Quick Action Button */}
        <Button
          title="Escanear refeição"
          onPress={() => navigation.navigate('Camera')}
          fullWidth
          style={styles.scanButton}
          icon={<MaterialIcons name="photo-camera" size={20} color={COLORS.surface} />}
        />

        {/* View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'daily' && styles.viewModeButtonActive
            ]}
            onPress={() => {
              selectionFeedback();
              setViewMode('daily');
            }}
          >
            <BodyText style={[
              styles.viewModeText,
              viewMode === 'daily' && styles.viewModeTextActive
            ]}>
              Diário
            </BodyText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'weekly' && styles.viewModeButtonActive
            ]}
            onPress={() => {
              selectionFeedback();
              setViewMode('weekly');
            }}
          >
            <BodyText style={[
              styles.viewModeText,
              viewMode === 'weekly' && styles.viewModeTextActive
            ]}>
              Semanal
            </BodyText>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {user?.stats && (
            <View style={styles.statsCard}>
              <BodyText style={styles.statsEmoji}>🔥</BodyText>
              <BodyText style={styles.statsValue}>{user.stats.currentStreak}</BodyText>
              <Caption color="textSecondary" style={styles.statsLabel}>Dias seguidos</Caption>
            </View>
          )}
          <View style={styles.waterCard}>
            <View style={styles.waterHeader}>
              <BodyText style={styles.waterEmoji}>💧</BodyText>
              <View style={styles.waterInfo}>
                <BodyText style={styles.waterValue}>
                  {Math.round(waterIntake)}ml
                </BodyText>
                <Caption color="textSecondary" style={styles.waterGoal}>
                  de 2000ml
                </Caption>
              </View>
            </View>
            <Button
              title="+ 200ml"
              onPress={() => user?.id && addWaterIntake(200, user.id)}
              size="small"
              variant="outline"
              style={styles.waterButton}
            />
          </View>
        </View>

        {/* Charts Section */}
        {viewMode === 'daily' && hasEntries && todayStats ? (
          <CalorieProgressChart 
            data={{
              calories: todayStats.progress.calories,
              protein: todayStats.progress.protein,
              carbs: todayStats.progress.carbs,
              fat: todayStats.progress.fat,
            }}
          />
        ) : viewMode === 'weekly' ? (
          weeklyData ? (
            <WeeklyCaloriesChart weeklyData={weeklyData} />
          ) : (
            <View style={styles.emptyChartCard}>
              <Caption color="textSecondary" style={styles.emptyChartText}>
                Ainda não há dados suficientes para exibir o gráfico semanal. Registre refeições ao longo da semana para acompanhar sua evolução.
              </Caption>
            </View>
          )
        ) : null}

        {/* Daily Progress */}
        {hasEntries && todayStats ? (
          <View style={styles.progressCard}>
            <Heading3 style={styles.sectionTitle}>
              Progresso de hoje
            </Heading3>
            
            {/* Calories */}
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <BodyText style={styles.progressLabel}>Calorias</BodyText>
                <BodyText style={[
                  styles.progressValue,
                  { color: getNutritionColor(todayStats.progress.calories.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.calories.current)} / {todayStats.goals.calories}
                </BodyText>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(todayStats.progress.calories.percentage, 100)}%`,
                      backgroundColor: getNutritionColor(todayStats.progress.calories.percentage),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Macros */}
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <BodyText style={styles.macroEmoji}>🥩</BodyText>
                <BodyText style={[
                  styles.macroValue,
                  { color: getNutritionColor(todayStats.progress.protein.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.protein.current)}g
                </BodyText>
                <Caption color="textSecondary" style={styles.macroLabel}>Proteína</Caption>
              </View>
              <View style={styles.macroItem}>
                <BodyText style={styles.macroEmoji}>🍞</BodyText>
                <BodyText style={[
                  styles.macroValue,
                  { color: getNutritionColor(todayStats.progress.carbs.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.carbs.current)}g
                </BodyText>
                <Caption color="textSecondary" style={styles.macroLabel}>Carbs</Caption>
              </View>
              <View style={styles.macroItem}>
                <BodyText style={styles.macroEmoji}>🥑</BodyText>
                <BodyText style={[
                  styles.macroValue,
                  { color: getNutritionColor(todayStats.progress.fat.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.fat.current)}g
                </BodyText>
                <Caption color="textSecondary" style={styles.macroLabel}>Gorduras</Caption>
              </View>
            </View>
          </View>
        ) : (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyContent}>
              <MaterialIcons name="restaurant" size={64} color={COLORS.textSecondary} style={styles.emptyIcon} />
              <Heading3 align="center" style={styles.emptyTitle}>
                Registre sua primeira refeição!
              </Heading3>
              <BodyText align="center" color="textSecondary" style={styles.emptyDescription}>
                Use a câmera para escanear sua refeição ou adicione manualmente para começar a acompanhar suas calorias.
              </BodyText>
              <Button
                title="Começar agora"
                onPress={() => navigation.navigate('Camera')}
                style={styles.emptyButton}
              />
            </View>
          </View>
        )}

        {/* Recent Meals */}
        {hasEntries && (
          <View style={styles.recentMeals}>
            <View style={styles.sectionHeader}>
              <Heading3>Refeições recentes</Heading3>
              <Button
                title="Ver tudo"
                onPress={() => navigation.navigate('History')}
                variant="ghost"
                size="small"
              />
            </View>
            {todayEntries.slice(0, 3).map((entry, index) => (
              <View key={entry.id} style={styles.mealItem}>
                <View style={styles.mealInfo}>
                  <BodyText style={styles.mealName}>
                    {entry.food.name}
                  </BodyText>
                  <Caption color="textSecondary">
                    {entry.mealType} • {Math.round(entry.nutrition.calories)} cal
                  </Caption>
                </View>
                <BodyText style={styles.mealCalories}>
                  {Math.round(entry.nutrition.calories)}
                </BodyText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.background }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  headerDate: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  nutritionHighlights: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  nutritionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 110,
    justifyContent: 'center',
  },
  nutritionEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
    lineHeight: 30,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  nutritionLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xs,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: '#E6F7F3',
  },
  viewModeText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  viewModeTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  scanButton: {
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statsCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
    justifyContent: 'center',
  },
  statsEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
    lineHeight: 35,
  },
  statsValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  waterCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  waterEmoji: {
    fontSize: 28,
    lineHeight: 35,
  },
  waterInfo: {
    flex: 1,
  },
  waterValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  waterGoal: {
    fontSize: 11,
    fontWeight: '500',
  },
  waterButton: {
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    fontSize: 18,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyChartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyChartText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  progressItem: {
    marginBottom: SPACING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    fontWeight: '500',
  },
  progressValue: {
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.lg,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
    lineHeight: 30,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  emptyButton: {
    minWidth: 150,
  },
  recentMeals: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  mealCalories: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});