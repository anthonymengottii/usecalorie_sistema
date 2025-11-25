// 🚀 DEMO VERSION - Limited functionality for portfolio showcase
/**
 * CalorIA - Profile Screen
 * User profile management and app settings
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '../../utils/navigation';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useUserStore } from '../../store/userStore';
import { firebaseService } from '../../services/FirebaseService';
import { COLORS, SPACING } from '../../utils/constants';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useUserStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');
  const [lastSyncText, setLastSyncText] = useState('Calculando...');

  const subscriptionInfo = useMemo(() => {
    const subscription = user?.subscription;

    const formatDate = (date?: Date) => {
      if (!date) return '';
      const parsed = date instanceof Date ? date : new Date(date);
      return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    if (!subscription) {
      return {
        label: 'Plano gratuito',
        detail: 'Faça upgrade na aba Assinaturas quando desejar.',
      };
    }

    const label =
      subscription.plan === 'annual'
        ? 'Plano anual'
        : 'Plano mensal';

    let detail = '';
    if (subscription.status === 'trial') {
      detail = `Período de teste até ${formatDate(subscription.trialEndsAt)}`;
    } else if (subscription.status === 'active') {
      detail = 'Assinatura ativa';
    } else if (subscription.status === 'expired') {
      detail = 'Plano expirado - renove para continuar usando recursos premium';
    } else if (subscription.status === 'cancelled') {
      detail = 'Assinatura cancelada';
    }

    return {
      label,
      detail,
    };
  }, [user?.subscription]);

  // Get app version from Constants
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  // Calculate last sync time dynamically
  useEffect(() => {
    const updateLastSync = () => {
      const lastActivity = user?.stats?.lastActivityDate;

      if (!lastActivity) {
        setLastSyncText('Sem atividade');
        return;
      }

      const now = new Date();
      const lastActivityDate = lastActivity instanceof Date ? lastActivity : new Date(lastActivity);
      const diffMs = now.getTime() - lastActivityDate.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) {
        setLastSyncText('Agora mesmo');
      } else if (diffMinutes < 60) {
        setLastSyncText(`Há ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`);
      } else if (diffHours < 24) {
        setLastSyncText(`Há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`);
      } else {
        setLastSyncText(`Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`);
      }
    };

    // Update immediately
    updateLastSync();

    // Update every minute
    const interval = setInterval(updateLastSync, 60000);

    return () => clearInterval(interval);
  }, [user?.stats?.lastActivityDate]);

  const handleEditProfile = () => {
    setIsEditingName(true);
    setEditedName(user?.displayName || '');
  };

  const handleSaveName = async () => {
    if (!user || !editedName.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar em branco');
      return;
    }

    try {
      await firebaseService.updateUserProfile(user.id, {
        displayName: editedName.trim()
      });

      await updateUser({ displayName: editedName.trim() });

      setIsEditingName(false);
      Alert.alert('Sucesso', 'Nome atualizado com sucesso');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(user?.displayName || '');
  };

  const handleNutritionGoals = () => {
    navigation.navigate('EditGoals');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleSubscription = () => {
    navigation.navigate('Subscription');
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza de que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={Boolean(true)} backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.screenTitle}>Perfil</Heading2>
        </View>

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.userHeader}>
              <View style={styles.avatar}>
                <BodyText style={styles.avatarText}>
                  {user?.displayName?.charAt(0) || 'U'}
                </BodyText>
              </View>
              <View style={styles.userInfo}>
                {isEditingName ? (
                  <View style={styles.editNameContainer}>
                    <TextInput
                      style={styles.nameInput}
                      value={editedName}
                      onChangeText={setEditedName}
                      placeholder="Digite seu nome"
                      autoFocus={true}
                      maxLength={50}
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity onPress={handleCancelEdit} style={styles.editActionButton}>
                        <MaterialIcons name="close" size={20} color={COLORS.error} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSaveName} style={styles.editActionButton}>
                        <MaterialIcons name="check" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Heading3>{user?.displayName || 'Usuário'}</Heading3>
                )}
                <Caption color="textSecondary">{user?.email}</Caption>
                <Caption color="primary">{subscriptionInfo.label}</Caption>
                {subscriptionInfo.detail ? (
                  <Caption color="textSecondary">{subscriptionInfo.detail}</Caption>
                ) : null}
              </View>
            </View>
            {!isEditingName && (
              <Button
                title="Editar perfil"
                onPress={handleEditProfile}
                variant="outline"
                size="small"
                style={styles.editButton}
              />
            )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Heading3 style={styles.statsTitle}>Estatísticas</Heading3>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.currentStreak || 0}
                  </BodyText>
                  <MaterialIcons name="local-fire-department" size={20} color={COLORS.secondary} />
                </View>
                <Caption color="textSecondary">Sequência atual</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.totalMealsLogged || 0}
                  </BodyText>
                  <MaterialIcons name="restaurant" size={20} color={COLORS.primary} />
                </View>
                <Caption color="textSecondary">Refeições registradas</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.profile?.targetWeight
                      ? `${Math.abs((user.profile.weight - user.profile.targetWeight)).toFixed(1)}kg`
                      : 'N/A'}
                  </BodyText>
                  <MaterialIcons name="flag" size={20} color="#FF6B35" />
                </View>
                <Caption color="textSecondary">Para atingir</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.totalDaysTracked || 0}
                  </BodyText>
                  <MaterialIcons name="calendar-today" size={20} color={COLORS.success} />
                </View>
                <Caption color="textSecondary">Dias acompanhados</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.longestStreak || 0}
                  </BodyText>
                  <MaterialIcons name="emoji-events" size={20} color={COLORS.primary} />
                </View>
                <Caption color="textSecondary">Melhor sequência</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.avgCaloriesPerDay
                      ? Math.round(user.stats.avgCaloriesPerDay)
                      : 0}
                  </BodyText>
                  <MaterialIcons name="trending-up" size={20} color="#9C27B0" />
                </View>
                <Caption color="textSecondary">Média calorias/dia</Caption>
              </View>
            </View>
        </View>

        {/* Conquistas */}
        <View style={styles.achievementsCard}>
          <Heading3 style={styles.achievementsTitle}>Conquistas desbloqueadas</Heading3>
            <View style={styles.achievementsGrid}>
              {/* Primera comida registrada */}
              <View style={[styles.achievementBadge, (user?.stats?.totalMealsLogged || 0) >= 1 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="restaurant-menu"
                  size={32}
                  color={(user?.stats?.totalMealsLogged || 0) >= 1 ? COLORS.primary : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>Primeira refeição</Caption>
              </View>

              {/* Sequência de 3 dias */}
              <View style={[styles.achievementBadge, (user?.stats?.currentStreak || 0) >= 3 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="whatshot"
                  size={32}
                  color={(user?.stats?.currentStreak || 0) >= 3 ? COLORS.secondary : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>Sequência de 3 dias</Caption>
              </View>

              {/* 10 comidas registradas */}
              <View style={[styles.achievementBadge, (user?.stats?.totalMealsLogged || 0) >= 10 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="emoji-events"
                  size={32}
                  color={(user?.stats?.totalMealsLogged || 0) >= 10 ? '#FFD700' : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>10 refeições</Caption>
              </View>

              {/* Sequência de 7 dias */}
              <View style={[styles.achievementBadge, (user?.stats?.currentStreak || 0) >= 7 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="local-fire-department"
                  size={32}
                  color={(user?.stats?.currentStreak || 0) >= 7 ? '#FF4500' : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>Semana perfeita</Caption>
              </View>
            </View>
        </View>

        {/* Nutrition Goals */}
        {user?.profile && (
          <View style={styles.goalsCard}>
            <Heading3 style={styles.goalsTitle}>Seu perfil nutricional</Heading3>
              <View style={styles.goalsGrid}>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">Peso atual</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.weight} kg</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">Peso objetivo</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.targetWeight} kg</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">Altura</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.height} cm</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">IMC</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.bmi.toFixed(1)}</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">TMB</Caption>
                  <BodyText style={styles.goalValue}>{Math.round(user.profile.bmr)} cal</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">TDEE</Caption>
                  <BodyText style={styles.goalValue}>{Math.round(user.profile.tdee)} cal</BodyText>
                </View>
              </View>

              <View style={styles.macroGoalsSection}>
                <Caption color="textSecondary" style={styles.macroGoalsTitle}>
                  Metas diárias
                </Caption>
                <View style={styles.macroGoalsRow}>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.calories}
                    </BodyText>
                    <Caption color="textSecondary">Calorias</Caption>
                  </View>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.protein}g
                    </BodyText>
                    <Caption color="textSecondary">Proteína</Caption>
                  </View>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.carbs}g
                    </BodyText>
                    <Caption color="textSecondary">Carboidratos</Caption>
                  </View>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.fat}g
                    </BodyText>
                    <Caption color="textSecondary">Gorduras</Caption>
                  </View>
                </View>
              </View>
          </View>
        )}

        {/* Settings Menu */}
        <View style={styles.menuCard}>
          <Heading3 style={styles.menuTitle}>Configurações</Heading3>
          
          <View style={styles.menuItems}>
            <Button
              title="Metas nutricionais"
              onPress={handleNutritionGoals}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="track-changes" size={20} color={COLORS.primary} />}
            />

            <Button
              title="Notificações"
              onPress={handleNotifications}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="notifications" size={20} color={COLORS.primary} />}
            />

            <Button
              title="Assinatura"
              onPress={handleSubscription}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="card-membership" size={20} color={COLORS.primary} />}
            />
            
            <Button
              title="Suporte"
              onPress={handleSupport}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="help-outline" size={20} color={COLORS.primary} />}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Heading3 style={styles.infoTitle}>Informações</Heading3>
          <View style={styles.infoItems}>
            <View style={styles.infoItem}>
              <Caption color="textSecondary">Versão</Caption>
              <Caption>{appVersion}</Caption>
            </View>
            <View style={styles.infoItem}>
              <Caption color="textSecondary">Última sincronização</Caption>
              <Caption>{lastSyncText}</Caption>
            </View>
          </View>
        </View>

        {/* Logout */}
        <Button
          title="Sair da conta"
          onPress={handleLogout}
          variant="outline"
          style={[styles.logoutButton, { borderColor: COLORS.error }] as any}
          textStyle={{ color: COLORS.error }}
        />
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
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 24,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  achievementsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-around',
  },
  achievementBadge: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    minWidth: 80,
    opacity: 0.4,
  },
  achievementUnlocked: {
    opacity: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  achievementLabel: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontSize: 11,
  },
  goalsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  goalsGrid: {
    gap: SPACING.sm,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  goalValue: {
    fontWeight: '600',
    color: COLORS.text,
  },
  macroGoalsSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
  },
  macroGoalsTitle: {
    marginBottom: SPACING.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  macroGoalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroGoalItem: {
    alignItems: 'center',
  },
  macroGoalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  menuItems: {
    gap: SPACING.xs,
  },
  menuItem: {
    justifyContent: 'flex-start',
    paddingLeft: 0,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  infoItems: {
    gap: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    marginBottom: SPACING.xl,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  nameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  editActionButton: {
    padding: SPACING.xs,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
});