/**
 * CalorIA - History Screen
 * Food history and nutrition analytics
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useFoodStore } from '../../store/foodStore';
import { COLORS, SPACING } from '../../utils/constants';
import type { FoodEntry, MealType } from '../../types';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export const HistoryScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    foodEntries, 
    getTodayEntries, 
    calculateDailyNutrition,
    isLoading 
  } = useFoodStore();

  const mealTypes: { value: MealType | 'all'; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'breakfast', label: 'Café da manhã' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'dinner', label: 'Jantar' },
    { value: 'snack', label: 'Lanche' },
    { value: 'supplement', label: 'Suplementos' },
  ];

  // Get entries based on view mode and filters
  const filteredEntries = useMemo(() => {
    let entries: FoodEntry[] = [];
    const now = new Date();

    switch (viewMode) {
      case 'daily':
        entries = getTodayEntries();
        break;
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        entries = foodEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= weekStart;
        });
        break;
      case 'monthly':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        entries = foodEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= monthStart;
        });
        break;
    }

    // Filter by meal type
    if (selectedMealType !== 'all') {
      entries = entries.filter(entry => entry.mealType === selectedMealType);
    }

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [viewMode, selectedMealType, foodEntries, getTodayEntries]);

  // Calculate summary stats for filtered entries
  const summaryStats = useMemo(() => {
    const totalCalories = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
    const totalProtein = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.protein, 0);
    const totalCarbs = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.carbs, 0);
    const totalFat = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.fat, 0);

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      meals: filteredEntries.length,
    };
  }, [filteredEntries]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    calculateDailyNutrition();
    // Simulate API call delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getMealTypeIcon = (mealType: MealType) => {
    const iconProps = { size: 20 };
    switch (mealType) {
      case 'breakfast': return <MaterialIcons name="wb-sunny" color="#FFA500" {...iconProps} />;
      case 'lunch': return <MaterialIcons name="restaurant" color="#4CAF50" {...iconProps} />;
      case 'dinner': return <MaterialIcons name="nights-stay" color="#9C27B0" {...iconProps} />;
      case 'snack': return <MaterialIcons name="cookie" color="#FF6B35" {...iconProps} />;
      case 'supplement': return <MaterialIcons name="medication" color="#2196F3" {...iconProps} />;
      default: return <MaterialIcons name="restaurant-menu" color={COLORS.textSecondary} {...iconProps} />;
    }
  };

  const getMealTypeLabel = (mealType: MealType) => {
    switch (mealType) {
      case 'breakfast': return 'Café da manhã';
      case 'lunch': return 'Almoço';
      case 'dinner': return 'Jantar';
      case 'snack': return 'Lanche';
      case 'supplement': return 'Suplemento';
      default: return 'Refeição';
    }
  };

  const renderEntry = ({ item }: { item: FoodEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.entryInfo}>
          <View style={styles.entryTitleRow}>
            <View style={styles.entryIconContainer}>
              {getMealTypeIcon(item.mealType)}
            </View>
            <BodyText style={styles.entryName}>
              {item.food.name}
            </BodyText>
          </View>
          <Caption color="textSecondary">
            {getMealTypeLabel(item.mealType)} • {new Date(item.date).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })} • {item.servingSize?.amount || item.quantity} {item.servingSize?.unit || 'porção'}
          </Caption>
        </View>
        <View style={styles.entryStats}>
          <BodyText style={styles.entryCalories}>
            {Math.round(item.nutrition.calories)}
          </BodyText>
          <Caption color="textSecondary">cal</Caption>
        </View>
      </View>
      
      <View style={styles.entryMacros}>
        <View style={styles.macroItem}>
          <Caption color="textSecondary" style={styles.macroLabel}>Proteína</Caption>
          <BodyText style={styles.macroValue}>
            {Math.round(item.nutrition.protein)}g
          </BodyText>
        </View>
        <View style={styles.macroItem}>
          <Caption color="textSecondary" style={styles.macroLabel}>Carboidratos</Caption>
          <BodyText style={styles.macroValue}>
            {Math.round(item.nutrition.carbs)}g
          </BodyText>
        </View>
        <View style={styles.macroItem}>
          <Caption color="textSecondary" style={styles.macroLabel}>Gorduras</Caption>
          <BodyText style={styles.macroValue}>
            {Math.round(item.nutrition.fat)}g
          </BodyText>
        </View>
      </View>

      {item.nutrition.fiber > 0 && (
        <View style={styles.additionalNutrition}>
          <Caption color="textSecondary">
            Fibra: {Math.round(item.nutrition.fiber)}g • 
            Açúcar: {Math.round(item.nutrition.sugar)}g •
            Sódio: {Math.round(item.nutrition.sodium)}mg
          </Caption>
        </View>
      )}

      {item.notes && (
        <View style={styles.notesSection}>
          <Caption color="textSecondary" style={styles.notes}>
            💭 {item.notes}
          </Caption>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={Boolean(true)} backgroundColor="transparent" />
      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.screenTitle}>Histórico</Heading2>
        </View>

        {/* View Mode Selector */}
        <View style={styles.selectorCard}>
          <View style={styles.selectorButtons}>
            <TouchableOpacity
              style={[styles.selectorButton, viewMode === 'daily' && styles.selectorButtonActive]}
              onPress={() => setViewMode('daily')}
            >
              <BodyText style={[styles.selectorButtonText, viewMode === 'daily' && styles.selectorButtonTextActive]}>
                Diário
              </BodyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectorButton, viewMode === 'weekly' && styles.selectorButtonActive]}
              onPress={() => setViewMode('weekly')}
            >
              <BodyText style={[styles.selectorButtonText, viewMode === 'weekly' && styles.selectorButtonTextActive]}>
                Semanal
              </BodyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectorButton, viewMode === 'monthly' && styles.selectorButtonActive]}
              onPress={() => setViewMode('monthly')}
            >
              <BodyText style={[styles.selectorButtonText, viewMode === 'monthly' && styles.selectorButtonTextActive]}>
                Mensal
              </BodyText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meal Type Filter */}
        <View style={styles.filterCard}>
          <BodyText style={styles.filterTitle}>Filtrar por refeição</BodyText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={Boolean(false)}
            contentContainerStyle={styles.mealFilters}
          >
            {mealTypes.map((mealType) => (
              <TouchableOpacity
                key={mealType.value}
                style={[
                  styles.mealFilterButton,
                  selectedMealType === mealType.value && styles.mealFilterButtonActive
                ]}
                onPress={() => setSelectedMealType(mealType.value)}
              >
                <BodyText
                  style={
                    selectedMealType === mealType.value
                      ? [styles.mealFilterText, styles.mealFilterTextActive]
                      : styles.mealFilterText
                  }
                >
                  {mealType.label}
                </BodyText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryCard}>
          <BodyText style={styles.summaryTitle}>
            Resumo {viewMode === 'daily' ? 'do dia' : viewMode === 'weekly' ? 'semanal' : 'mensal'}
          </BodyText>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.calories}
              </BodyText>
              <Caption color="textSecondary">Calorias</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.meals}
              </BodyText>
              <Caption color="textSecondary">Refeições</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.protein}g
              </BodyText>
              <Caption color="textSecondary">Proteína</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.carbs}g
              </BodyText>
              <Caption color="textSecondary">Carboidratos</Caption>
            </View>
          </View>
        </View>

        {/* Entries List */}
        <View style={styles.entriesContainer}>
          <View style={styles.entriesHeader}>
            <Heading3>
              {viewMode === 'daily' ? 'Hoje' : viewMode === 'weekly' ? 'Esta semana' : 'Este mês'}
              {selectedMealType !== 'all' && ` • ${mealTypes.find(m => m.value === selectedMealType)?.label}`}
            </Heading3>
            <Caption color="textSecondary">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'registro' : 'registros'}
            </Caption>
          </View>

          {filteredEntries.length > 0 ? (
            <FlatList
              data={filteredEntries}
              renderItem={renderEntry}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={Boolean(false)}
              contentContainerStyle={styles.entriesList}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyContent}>
                <BodyText style={styles.emptyEmoji}>📝</BodyText>
                <BodyText align="center" style={styles.emptyTitle}>
                  Nenhum registro encontrado
                </BodyText>
                <BodyText align="center" color="textSecondary">
                  Comece a registrar suas refeições para visualizar seu histórico aqui.
                </BodyText>
              </View>
            </View>
          )}
        </View>
      </View>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.background }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'left',
  },
  selectorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xs,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectorButtons: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorButtonActive: {
    backgroundColor: '#E6F7F3',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  selectorButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  mealFilters: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  mealFilterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealFilterButtonActive: {
    backgroundColor: '#E6F7F3',
    borderColor: COLORS.primary,
  },
  mealFilterText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  mealFilterTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  entriesContainer: {
    flex: 1,
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  entriesList: {
    gap: SPACING.sm,
  },
  entryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  entryIconContainer: {
    marginRight: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  entryStats: {
    alignItems: 'flex-end',
  },
  entryCalories: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  entryMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  additionalNutrition: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notesSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notes: {
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
});