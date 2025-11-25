/**
 * CalorIA - Chart Components
 * Professional charts for nutrition data visualization
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart, ProgressChart, BarChart } from 'react-native-chart-kit';
import { BodyText, Caption } from './Typography';
import { COLORS, SPACING } from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

interface CalorieProgressChartProps {
  data: {
    calories: { current: number; goal: number; percentage: number };
    protein: { current: number; goal: number; percentage: number };
    carbs: { current: number; goal: number; percentage: number };
    fat: { current: number; goal: number; percentage: number };
  };
}

interface WeeklyChartProps {
  weeklyData: {
    labels: string[];
    calories: number[];
    target: number;
  };
}

interface MacroDistributionProps {
  data: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const CalorieProgressChart: React.FC<CalorieProgressChartProps> = ({ data }) => {
  const progressItems = [
    {
      label: 'Calorias',
      current: data.calories.current,
      goal: data.calories.goal,
      percentage: data.calories.percentage,
      color: '#FF6B35',
      emoji: '🔥',
    },
    {
      label: 'Proteína',
      current: data.protein.current,
      goal: data.protein.goal,
      percentage: data.protein.percentage,
      color: COLORS.primary,
      emoji: '🥩',
    },
    {
      label: 'Carbs',
      current: data.carbs.current,
      goal: data.carbs.goal,
      percentage: data.carbs.percentage,
      color: COLORS.secondary,
      emoji: '🍞',
    },
    {
      label: 'Gorduras',
      current: data.fat.current,
      goal: data.fat.goal,
      percentage: data.fat.percentage,
      color: COLORS.success,
      emoji: '🥑',
    },
  ];

  return (
    <View style={styles.chartContainer}>
      <BodyText style={styles.chartTitle}>Progresso nutricional diário</BodyText>
      <View style={styles.progressList}>
        {progressItems.map((item, index) => (
          <View key={index} style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelContainer}>
                <BodyText style={styles.progressEmoji}>{item.emoji}</BodyText>
                <View style={styles.progressLabelText}>
                  <BodyText style={styles.progressLabel}>{item.label}</BodyText>
                  <Caption color="textSecondary" style={styles.progressSubLabel}>
                    {Math.round(item.current)}{item.label === 'Calorias' ? '' : 'g'} / {Math.round(item.goal)}{item.label === 'Calorias' ? ' cal' : 'g'}
                  </Caption>
                </View>
              </View>
              <BodyText style={[styles.progressPercentage, { color: item.color }]}>
                {Math.round(item.percentage)}%
              </BodyText>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const WeeklyCaloriesChart: React.FC<WeeklyChartProps> = ({ weeklyData }) => {
  const totalCalories = weeklyData.calories.reduce((sum, cal) => sum + cal, 0);
  const averageCalories = Math.round(totalCalories / weeklyData.calories.length);
  const daysWithData = weeklyData.calories.filter(cal => cal > 0).length;
  const averageTarget = weeklyData.target;
  const targetAchievement = Math.round((averageCalories / averageTarget) * 100);

  const chartData = {
    labels: weeklyData.labels,
    datasets: [
      {
        data: weeklyData.calories,
        color: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
        strokeWidth: 4,
      },
      {
        data: Array(7).fill(weeklyData.target),
        color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
        strokeWidth: 2,
        strokeDashArray: [8, 4],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '3',
      stroke: COLORS.primary,
      fill: COLORS.surface,
    },
    fillShadowGradient: COLORS.primary,
    fillShadowGradientOpacity: 0.1,
  };

  return (
    <View style={styles.chartContainer}>
      <BodyText style={styles.chartTitle}>Calorias nesta semana</BodyText>
      
      {/* Stats Summary */}
      <View style={styles.weeklyStatsContainer}>
        <View style={styles.weeklyStatItem}>
          <BodyText style={styles.weeklyStatValue}>{averageCalories}</BodyText>
          <Caption color="textSecondary" style={styles.weeklyStatLabel}>Média diária</Caption>
        </View>
        <View style={styles.weeklyStatDivider} />
        <View style={styles.weeklyStatItem}>
          <BodyText style={styles.weeklyStatValue}>{totalCalories}</BodyText>
          <Caption color="textSecondary" style={styles.weeklyStatLabel}>Total semanal</Caption>
        </View>
        <View style={styles.weeklyStatDivider} />
        <View style={styles.weeklyStatItem}>
          <BodyText style={[styles.weeklyStatValue, { color: targetAchievement >= 100 ? COLORS.success : COLORS.primary }]}>
            {targetAchievement}%
          </BodyText>
          <Caption color="textSecondary" style={styles.weeklyStatLabel}>vs. Meta</Caption>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={screenWidth - 60}
        height={240}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero
        segments={5}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
      />
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Caption style={styles.legendText}>Consumido</Caption>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B35', borderStyle: 'dashed', borderWidth: 1 }]} />
          <Caption style={styles.legendText}>Meta diária ({Math.round(weeklyData.target)} cal)</Caption>
        </View>
      </View>
    </View>
  );
};

export const MacroDistributionChart: React.FC<MacroDistributionProps> = ({ data }) => {
  const total = data.protein + data.carbs + data.fat;
  
  const chartData = {
    labels: ['Proteína', 'Carboidratos', 'Gorduras'],
    datasets: [
      {
        data: [
          Math.round((data.protein / total) * 100),
          Math.round((data.carbs / total) * 100),
          Math.round((data.fat / total) * 100),
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1, index?: number) => {
      const colors = [COLORS.primary, COLORS.secondary, COLORS.success];
      return colors[index || 0] || `rgba(0, 200, 150, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`,
  };

  return (
    <View style={styles.chartContainer}>
      <BodyText style={styles.chartTitle}>Distribuição de macros</BodyText>
      <BarChart
        data={chartData}
        width={screenWidth - 60}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
        verticalLabelRotation={0}
        showValuesOnTopOfBars
        fromZero
        yAxisLabel=""
        yAxisSuffix="%"
      />
      <View style={styles.macroStats}>
        <View style={styles.macroStatItem}>
          <Caption color="textSecondary">Proteína</Caption>
          <BodyText style={styles.macroValue}>{Math.round(data.protein)}g</BodyText>
        </View>
        <View style={styles.macroStatItem}>
          <Caption color="textSecondary">Carboidratos</Caption>
          <BodyText style={styles.macroValue}>{Math.round(data.carbs)}g</BodyText>
        </View>
        <View style={styles.macroStatItem}>
          <Caption color="textSecondary">Gorduras</Caption>
          <BodyText style={styles.macroValue}>{Math.round(data.fat)}g</BodyText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartTitle: {
    fontWeight: '600',
    marginBottom: SPACING.lg,
    fontSize: 18,
    color: COLORS.text,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: 16,
  },
  progressList: {
    gap: SPACING.md,
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
  progressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  progressEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  progressLabelText: {
    flex: 1,
  },
  progressLabel: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
  progressSubLabel: {
    fontSize: 12,
  },
  progressPercentage: {
    fontWeight: '700',
    fontSize: 16,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  weeklyStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weeklyStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  weeklyStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  weeklyStatLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  weeklyStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.lg,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  macroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroStatItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontWeight: '600',
    marginTop: SPACING.xs,
    color: COLORS.primary,
  },
});