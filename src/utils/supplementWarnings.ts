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
        message: 'La testosterona es una sustancia controlada que requiere prescripción médica.',
        recommendation: 'Solo debe usarse bajo supervisión médica estricta. El uso sin prescripción es ilegal y peligroso.',
        learnMoreUrl: 'https://www.fda.gov/drugs/information-drug-class/testosterone-information',
      });
      warnings.push({
        level: 'danger',
        message: 'Puede causar efectos secundarios graves: acné, cambios de humor, problemas cardíacos, daño hepático.',
        recommendation: 'Requiere monitoreo médico regular de niveles hormonales, función hepática y cardiovascular.',
      });
      break;

    case 'anabolic_steroid':
      warnings.push({
        level: 'critical',
        message: 'Los esteroides anabólicos son sustancias controladas y altamente peligrosas.',
        recommendation: 'NUNCA deben usarse sin prescripción médica. El uso recreativo es ilegal y puede causar daños irreversibles.',
        learnMoreUrl: 'https://www.drugabuse.gov/publications/drugfacts/anabolic-steroids',
      });
      warnings.push({
        level: 'critical',
        message: 'Riesgos graves: daño hepático, problemas cardíacos, infertilidad, cambios de personalidad, dependencia.',
        recommendation: 'Si estás considerando usar esteroides, consulta primero con un endocrinólogo o médico deportivo.',
      });
      break;

    case 'sarm':
      warnings.push({
        level: 'danger',
        message: 'Los SARMs (Selective Androgen Receptor Modulators) no están aprobados para uso humano.',
        recommendation: 'No están regulados por la FDA. Pueden causar efectos secundarios graves similares a los esteroides.',
        learnMoreUrl: 'https://www.fda.gov/news-events/public-health-focus/fda-investigating-presence-sarms-dietary-supplements',
      });
      warnings.push({
        level: 'caution',
        message: 'Pueden causar supresión hormonal, problemas hepáticos y efectos secundarios desconocidos a largo plazo.',
        recommendation: 'Evita su uso hasta que sean aprobados y regulados adecuadamente.',
      });
      break;

    case 'growth_hormone':
      warnings.push({
        level: 'critical',
        message: 'La hormona de crecimiento (HGH) es una sustancia controlada que requiere prescripción médica.',
        recommendation: 'Solo debe usarse para condiciones médicas específicas bajo supervisión médica. El uso recreativo es ilegal.',
        learnMoreUrl: 'https://www.fda.gov/drugs/information-drug-class/human-growth-hormone-hgh',
      });
      warnings.push({
        level: 'danger',
        message: 'Puede causar: acromegalia, diabetes, problemas cardíacos, síndrome del túnel carpiano, dolor articular.',
        recommendation: 'Requiere monitoreo médico continuo de niveles hormonales y función metabólica.',
      });
      break;

    case 'creatine':
      warnings.push({
        level: 'info',
        message: 'La creatina es generalmente segura cuando se usa en dosis recomendadas (3-5g/día).',
        recommendation: 'Mantente hidratado. Puede causar molestias estomacales en algunas personas.',
      });
      if (dosage && dosage.amount > 10 && dosage.unit === 'g') {
        warnings.push({
          level: 'caution',
          message: `Dosis alta detectada (${dosage.amount}${dosage.unit}). Dosis superiores a 10g/día no proporcionan beneficios adicionales.`,
          recommendation: 'Considera reducir a 3-5g/día para uso a largo plazo.',
        });
      }
      break;

    case 'pre_workout':
      warnings.push({
        level: 'caution',
        message: 'Los pre-entrenos suelen contener altas dosis de cafeína y estimulantes.',
        recommendation: 'Evita usar más de una vez al día. No combines con otras fuentes de cafeína. Monitorea tu frecuencia cardíaca.',
      });
      warnings.push({
        level: 'info',
        message: 'Puede causar insomnio si se toma tarde en el día.',
        recommendation: 'Toma al menos 6 horas antes de dormir.',
      });
      break;

    case 'protein_powder':
      warnings.push({
        level: 'info',
        message: 'La proteína en polvo es generalmente segura cuando se usa según las instrucciones.',
        recommendation: 'No excedas 2g de proteína por kg de peso corporal al día de todas las fuentes combinadas.',
      });
      break;

    case 'bcaa':
      warnings.push({
        level: 'info',
        message: 'Los BCAA son generalmente seguros, pero la evidencia de beneficios es limitada.',
        recommendation: 'Si consumes suficiente proteína completa, los BCAA pueden ser innecesarios.',
      });
      break;

    case 'vitamins':
      warnings.push({
        level: 'caution',
        message: 'Algunas vitaminas pueden ser tóxicas en exceso (especialmente A, D, E, K).',
        recommendation: 'No excedas las dosis recomendadas. Consulta con un médico si tomas múltiples suplementos vitamínicos.',
      });
      break;

    case 'minerals':
      warnings.push({
        level: 'caution',
        message: 'Los minerales en exceso pueden causar toxicidad y problemas de salud.',
        recommendation: 'Sigue las dosis recomendadas. Algunos minerales compiten por la absorción (ej: hierro y zinc).',
      });
      break;

    case 'omega3':
      warnings.push({
        level: 'info',
        message: 'El omega-3 es generalmente seguro, pero dosis muy altas pueden aumentar el riesgo de sangrado.',
        recommendation: 'No excedas 3g/día sin supervisión médica, especialmente si tomas anticoagulantes.',
      });
      break;

    default:
      warnings.push({
        level: 'info',
        message: 'Consulta siempre con un profesional de salud antes de usar cualquier suplemento.',
        recommendation: 'Lee las etiquetas cuidadosamente y sigue las instrucciones de dosificación.',
      });
  }

  return warnings;
};

/**
 * Get human-readable label for supplement type
 */
export const getSupplementLabel = (supplementType: SupplementType): string => {
  const labels: Record<SupplementType, string> = {
    protein_powder: 'Proteína en Polvo',
    creatine: 'Creatina',
    pre_workout: 'Pre-entreno',
    post_workout: 'Post-entreno',
    bcaa: 'Aminoácidos Ramificados (BCAA)',
    vitamins: 'Vitaminas',
    minerals: 'Minerales',
    omega3: 'Omega-3',
    testosterone: 'Testosterona',
    anabolic_steroid: 'Esteroides Anabólicos',
    sarm: 'SARMs',
    growth_hormone: 'Hormona de Crecimiento (HGH)',
    other: 'Otro Suplemento',
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

