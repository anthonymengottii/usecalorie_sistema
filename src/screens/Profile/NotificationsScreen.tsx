/**
 * CalorIA - Notifications Settings Screen
 * Configure push notifications and reminders
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '../../utils/navigation';

import { Card } from '../../components/UI/Card';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';

export const NotificationsScreen = () => {
  const navigation = useNavigation();

  const [mealReminders, setMealReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);
  const [goalAchievements, setGoalAchievements] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={Boolean(true)} backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={COLORS.text}
            onPress={() => navigation.goBack()}
          />
          <Heading2 style={styles.screenTitle}>Notificações</Heading2>
        </View>

        <Card style={styles.infoCard}>
          <BodyText color="textSecondary">
            Configure lembretes para se manter no caminho das suas metas.
          </BodyText>
        </Card>

        {/* Meal Reminders */}
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <MaterialIcons name="restaurant" size={24} color={COLORS.primary} />
                <Heading3 style={styles.settingTitle}>Lembretes de refeições</Heading3>
              </View>
              <Caption color="textSecondary">
                Receba notificações para registrar suas refeições diárias
              </Caption>
            </View>
            <Switch
              value={mealReminders}
              onValueChange={setMealReminders}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          </View>
        </Card>

        {/* Water Reminders */}
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <MaterialIcons name="water-drop" size={24} color="#2196F3" />
                <Heading3 style={styles.settingTitle}>Lembretes de água</Heading3>
              </View>
              <Caption color="textSecondary">
                Fique hidratado com lembretes a cada 2 horas
              </Caption>
            </View>
            <Switch
              value={waterReminders}
              onValueChange={setWaterReminders}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          </View>
        </Card>

        {/* Goal Achievements */}
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
                <Heading3 style={styles.settingTitle}>Conquistas e metas</Heading3>
              </View>
              <Caption color="textSecondary">
                Receba alertas quando atingir suas metas diárias
              </Caption>
            </View>
            <Switch
              value={goalAchievements}
              onValueChange={setGoalAchievements}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          </View>
        </Card>

        {/* Weekly Reports */}
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <MaterialIcons name="insert-chart" size={24} color="#9C27B0" />
                <Heading3 style={styles.settingTitle}>Relatórios semanais</Heading3>
              </View>
              <Caption color="textSecondary">
                Receba um resumo do seu progresso toda semana
              </Caption>
            </View>
            <Switch
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          </View>
        </Card>

        <Card style={styles.noteCard}>
          <MaterialIcons name="info-outline" size={20} color={COLORS.textSecondary} />
          <Caption color="textSecondary" style={styles.noteText}>
            As notificações dependem das permissões do sistema. Gerencie-as nas configurações do seu dispositivo.
          </Caption>
        </Card>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.background }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  screenTitle: {
    flex: 1,
  },
  infoCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#E3F2FD',
  },
  settingCard: {
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  settingTitle: {
    fontSize: 16,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#FFF9E6',
    marginTop: SPACING.lg,
  },
  noteText: {
    flex: 1,
  },
});
