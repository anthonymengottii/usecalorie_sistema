/**
 * CalorIA - Supplement Warnings Utility
 * Provides warnings, labels, and icons for different supplement types
 */

import type { SupplementType, SupplementWarning } from '../types';
import { COLORS } from './constants';

/**
 * Get warnings for a specific supplement type
 */
export const getSupplementWarnings = (
  supplementType: SupplementType,
  dosage?: { amount: number; unit: string }
): SupplementWarning[] => {
  const warnings: SupplementWarning[] = [];

  switch (supplementType) {
    case 'testosterone':
      warnings.push({
        level: 'critical',
        message: 'A testosterona é uma substância controlada que exige prescrição médica.',
        recommendation: 'Use apenas com supervisão médica rigorosa. O uso sem receita é ilegal e perigoso.',
        learnMoreUrl: 'https://www.fda.gov/drugs/information-drug-class/testosterone-information',
      });
      warnings.push({
        level: 'danger',
        message: 'Pode causar efeitos graves: acne, alterações de humor, problemas cardíacos e danos no fígado.',
        recommendation: 'Requer monitoramento frequente de níveis hormonais e das funções hepática e cardiovascular.',
      });
      break;

    case 'anabolic_steroid':
      warnings.push({
        level: 'critical',
        message: 'Os esteroides anabólicos são substâncias controladas e altamente perigosas.',
        recommendation: 'NUNCA utilize sem prescrição. O uso recreativo é ilegal e pode causar danos irreversíveis.',
        learnMoreUrl: 'https://www.drugabuse.gov/publications/drugfacts/anabolic-steroids',
      });
      warnings.push({
        level: 'critical',
        message: 'Riscos: dano hepático, problemas cardíacos, infertilidade e dependência.',
        recommendation: 'Antes de considerar o uso, consulte um endocrinologista ou médico esportivo.',
      });
      break;

    case 'sarm':
      warnings.push({
        level: 'danger',
        message: 'Os SARMs não são aprovados para uso humano.',
        recommendation: 'Não são regulamentados e podem causar efeitos graves semelhantes aos esteroides.',
        learnMoreUrl: 'https://www.fda.gov/news-events/public-health-focus/fda-investigating-presence-sarms-dietary-supplements',
      });
      warnings.push({
        level: 'caution',
        message: 'Podem causar supressão hormonal, problemas hepáticos e efeitos desconhecidos a longo prazo.',
        recommendation: 'Evite o uso até que sejam aprovados e regulamentados adequadamente.',
      });
      break;

    case 'growth_hormone':
      warnings.push({
        level: 'critical',
        message: 'O hormônio do crescimento (HGH) é uma substância controlada que exige prescrição.',
        recommendation: 'Somente para condições médicas específicas e sob supervisão. O uso recreativo é ilegal.',
        learnMoreUrl: 'https://www.fda.gov/drugs/information-drug-class/human-growth-hormone-hgh',
      });
      warnings.push({
        level: 'danger',
        message: 'Pode causar acromegalia, diabetes, problemas cardíacos e dores articulares.',
        recommendation: 'Necessita de monitoramento constante dos níveis hormonais e da função metabólica.',
      });
      break;

    case 'creatine':
      warnings.push({
        level: 'info',
        message: 'A creatina é segura quando usada em doses recomendadas (3-5g/dia).',
        recommendation: 'Mantenha-se hidratado. Pode causar desconforto gástrico em algumas pessoas.',
      });
      if (dosage && dosage.amount > 10 && dosage.unit === 'g') {
        warnings.push({
          level: 'caution',
          message: `Dose alta detectada (${dosage.amount}${dosage.unit}). Quantidades acima de 10g/dia não trazem benefícios extras.`,
          recommendation: 'Considere reduzir para 3-5g/dia para uso contínuo.',
        });
      }
      break;

    case 'pre_workout':
      warnings.push({
        level: 'caution',
        message: 'Pré-treinos costumam conter altas doses de cafeína e estimulantes.',
        recommendation: 'Evite usar mais de uma vez ao dia e não combine com outras fontes de cafeína.',
      });
      warnings.push({
        level: 'info',
        message: 'Pode causar insônia se tomado muito tarde.',
        recommendation: 'Consuma pelo menos 6 horas antes de dormir.',
      });
      break;

    case 'protein_powder':
      warnings.push({
        level: 'info',
        message: 'Proteína em pó é segura quando utilizada conforme as instruções.',
        recommendation: 'Não ultrapasse 2g de proteína por kg de peso corporal ao dia (de todas as fontes).',
      });
      break;

    case 'bcaa':
      warnings.push({
        level: 'info',
        message: 'BCAAs são seguros, mas a evidência de benefício é limitada.',
        recommendation: 'Se você já consome proteína suficiente, os BCAAs podem ser desnecessários.',
      });
      break;

    case 'vitamins':
      warnings.push({
        level: 'caution',
        message: 'Algumas vitaminas podem ser tóxicas em excesso (especialmente A, D, E e K).',
        recommendation: 'Não ultrapasse as doses recomendadas. Consulte um médico se usar múltiplos suplementos.',
      });
      break;

    case 'minerals':
      warnings.push({
        level: 'caution',
        message: 'Minerais em excesso podem causar toxicidade.',
        recommendation: 'Siga as doses recomendadas. Alguns minerais competem na absorção (ex.: ferro e zinco).',
      });
      break;

    case 'omega3':
      warnings.push({
        level: 'info',
        message: 'Ômega-3 é seguro, mas doses altas podem aumentar o risco de sangramento.',
        recommendation: 'Não ultrapasse 3g/dia sem orientação médica, principalmente se usar anticoagulantes.',
      });
      break;

    default:
      warnings.push({
        level: 'info',
        message: 'Consulte sempre um profissional de saúde antes de usar qualquer suplemento.',
        recommendation: 'Leia os rótulos com atenção e siga as instruções de dosagem.',
      });
  }

  return warnings;
};

/**
 * Get human-readable label for supplement type
 */
export const getSupplementLabel = (supplementType: SupplementType): string => {
  const labels: Record<SupplementType, string> = {
    protein_powder: 'Proteína em pó',
    creatine: 'Creatina',
    pre_workout: 'Pré-treino',
    post_workout: 'Pós-treino',
    bcaa: 'BCAA',
    vitamins: 'Vitaminas',
    minerals: 'Minerais',
    omega3: 'Ômega-3',
    testosterone: 'Testosterona',
    anabolic_steroid: 'Esteroides anabólicos',
    sarm: 'SARMs',
    growth_hormone: 'Hormônio do crescimento (HGH)',
    other: 'Outro suplemento',
  };

  return labels[supplementType] || 'Suplemento';
};

/**
 * Get icon/emoji for supplement type
 */
export const getSupplementIcon = (supplementType: SupplementType): string => {
  const icons: Record<SupplementType, string> = {
    protein_powder: '🥤',
    creatine: '💪',
    pre_workout: '⚡',
    post_workout: '🔄',
    bcaa: '🧬',
    vitamins: '💊',
    minerals: '⚗️',
    omega3: '🐟',
    testosterone: '⚠️',
    anabolic_steroid: '🚨',
    sarm: '⚠️',
    growth_hormone: '🚨',
    other: '💊',
  };

  return icons[supplementType] || '💊';
};

/**
 * Check if supplement requires medical supervision
 */
export const requiresMedicalSupervision = (supplementType: SupplementType): boolean => {
  const requiresSupervision: SupplementType[] = [
    'testosterone',
    'anabolic_steroid',
    'sarm',
    'growth_hormone',
  ];

  return requiresSupervision.includes(supplementType);
};

/**
 * Get color for warning level
 */
export const getWarningColor = (level: SupplementWarning['level']): string => {
  const colors: Record<SupplementWarning['level'], string> = {
    info: COLORS.primary,
    caution: '#F59E0B', // Amber
    danger: COLORS.error,
    critical: '#DC2626', // Dark red
  };

  return colors[level] || COLORS.textSecondary;
};

