/**
 * CalorIA - Subscription Screen
 * Premium plans and subscription management
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Heading1, Heading2, BodyText, Caption } from '../../components/UI';
import { subscriptionService, SubscriptionPlan, SubscriptionStatus } from '../../services/SubscriptionService';
import { COLORS, SPACING } from '../../utils/constants';

export const SubscriptionScreen = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      await subscriptionService.initialize();
      
      const [availablePlans, subscriptionStatus] = await Promise.all([
        subscriptionService.getAvailablePlans(),
        subscriptionService.getSubscriptionStatus(),
      ]);

      setPlans(availablePlans);
      setStatus(subscriptionStatus);
    } catch (error) {
      console.error('❌ Error loading subscription data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os planos de assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    try {
      setPurchasing(true);
      const result = await subscriptionService.purchasePlan(planId);
      
      if (result.success) {
        Alert.alert(
          'Assinatura concluída!', 
          'Você agora tem acesso a todos os recursos premium do CalorIA',
          [{ text: 'Continuar', onPress: () => loadSubscriptionData() }]
        );
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível concluir a compra');
      }
    } catch (error) {
      console.error('❌ Purchase error:', error);
      Alert.alert('Erro', 'Falha ao processar a compra');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setPurchasing(true);
      const result = await subscriptionService.restorePurchases();
      
      if (result.success) {
        Alert.alert('Compras restauradas', 'Suas compras anteriores foram recuperadas');
        loadSubscriptionData();
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível restaurar as compras');
      }
    } catch (error) {
      console.error('❌ Restore error:', error);
      Alert.alert('Erro', 'Falha ao restaurar compras');
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (price: number, currency: string, period: 'monthly' | 'yearly') => {
    const periodText = period === 'monthly' ? '/mês' : '/ano';
    const formattedPrice = price.toFixed(2).replace('.', ',');
    return `R$ ${formattedPrice} ${periodText}`;
  };

  const getTrialInfo = () => {
    if (!status?.isTrial || !status.trialEndsAt) return null;
    
    const daysLeft = Math.max(0, Math.ceil(
      (status.trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    ));
    
    return `${daysLeft} dias restantes de teste gratuito`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <BodyText>Carregando planos...</BodyText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Heading1 style={styles.title}>Desbloqueie o CalorIA</Heading1>
          
          {status?.isTrial && (
            <Card style={styles.trialCard}>
              <BodyText style={styles.trialText}>
                🎉 {getTrialInfo()}
              </BodyText>
            </Card>
          )}
          
          <BodyText align="center" color="textSecondary" style={styles.subtitle}>
            Ten acesso a todos os recursos premium e transforme sua relação com a comida
          </BodyText>
        </View>

        {/* Pricing Comparison */}
        <Card style={styles.comparisonCard}>
          <Heading2 style={styles.comparisonTitle}>
            💰 Mais acessível que a concorrência
          </Heading2>
          <BodyText style={styles.comparisonText}>
            • <Text style={styles.bold}>Cal AI</Text>: R$ 30/mês → CalorIA: R$ 19,90/mês (33% menos)
          </BodyText>
          <BodyText style={styles.comparisonText}>
            • <Text style={styles.bold}>MyFitnessPal</Text>: R$ 50/mês → CalorIA: R$ 19,90/mês (60% menos)
          </BodyText>
        </Card>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              style={[
                styles.planCard,
                plan.popular ? styles.popularPlan : undefined,
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Caption style={styles.popularText}>MAIS POPULAR</Caption>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Heading2 style={styles.planName}>{plan.name}</Heading2>
                <BodyText style={styles.planPrice}>
                  {formatPrice(plan.price, plan.currency, plan.period)}
                </BodyText>
                <Caption color="textSecondary">{plan.description}</Caption>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <BodyText style={styles.featureIcon}>✅</BodyText>
                    <BodyText style={styles.featureText}>{feature}</BodyText>
                  </View>
                ))}
              </View>

              <Button
                title={status?.isActive ? 'Plano atual' : 'Iniciar teste gratuito'}
                onPress={() => handlePurchase(plan.id)}
                disabled={purchasing || status?.isActive}
                style={[
                  styles.planButton,
                  plan.popular ? styles.popularButton : undefined,
                ]}
              />
            </Card>
          ))}
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <Heading2 style={styles.featuresTitle}>O que inclui o CalorIA Premium?</Heading2>
          
          <View style={styles.featuresRow}>
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>📸</BodyText>
              <BodyText style={styles.featureCardTitle}>Escaneamento ilimitado</BodyText>
              <Caption>Reconheça qualquer alimento com IA</Caption>
            </Card>
            
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>📊</BodyText>
              <BodyText style={styles.featureCardTitle}>Análises avançadas</BodyText>
              <Caption>Relatórios nutricionais detalhados</Caption>
            </Card>
          </View>

          <View style={styles.featuresRow}>
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>☁️</BodyText>
              <BodyText style={styles.featureCardTitle}>Sincronização na nuvem</BodyText>
              <Caption>Seus dados seguros e sincronizados</Caption>
            </Card>
            
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>🎯</BodyText>
              <BodyText style={styles.featureCardTitle}>Metas personalizadas</BodyText>
              <Caption>Objetivos adaptados a você</Caption>
            </Card>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            title="Restaurar compras"
            onPress={handleRestorePurchases}
            disabled={purchasing}
            variant="secondary"
            style={styles.restoreButton}
          />
          
          <Caption align="center" color="textSecondary" style={styles.disclaimer}>
            • Cancele quando quiser pela loja de apps{'\n'}
            • Nenhuma cobrança durante o período de teste{'\n'}
            • Sujeito a termos e condições
          </Caption>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  trialCard: {
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  trialText: {
    color: COLORS.surface,
    textAlign: 'center',
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
  },
  comparisonTitle: {
    color: COLORS.surface,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  comparisonText: {
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  bold: {
    fontWeight: '600',
  },
  plansContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  planCard: {
    padding: SPACING.lg,
    position: 'relative',
  },
  popularPlan: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  popularText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 12,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  planName: {
    marginBottom: SPACING.xs,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  featuresContainer: {
    marginBottom: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    marginRight: SPACING.sm,
  },
  featureText: {
    flex: 1,
  },
  trialInfo: {
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  planButton: {
    marginTop: 'auto',
  },
  popularButton: {
    backgroundColor: COLORS.primary,
  },
  featuresGrid: {
    marginBottom: SPACING.xl,
  },
  featuresTitle: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  featureCardTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  restoreButton: {
    paddingHorizontal: SPACING.xl,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.md,
  },
});

export default SubscriptionScreen;