/**
 * CalorIA - Login Screen
 * Authentication screen with email/password and social login
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, TextInput, Heading1, Heading2, BodyText, Caption } from '../../components/UI';
import { useUserStore } from '../../store/userStore';
import { useFoodStore } from '../../store/foodStore';
import { AuthServiceUnified as AuthService } from '../../services/AuthServiceUnified';
import { firebaseService } from '../../services/FirebaseService';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const { setUser, setLoading, setError, isLoading, updateUser, user } = useUserStore();
  const { loadFoodEntries } = useFoodStore();

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    return strength;
  }, [password]);

  const passwordStrengthLabel = useMemo(() => {
    if (passwordStrength <= 1) return { text: 'Fraca', color: COLORS.error };
    if (passwordStrength <= 3) return { text: 'Média', color: COLORS.secondary };
    return { text: 'Forte', color: COLORS.success };
  }, [passwordStrength]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Name validation
  const validateName = (name: string) => {
    if (!name) {
      setNameError('');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('O nome deve ter pelo menos 2 caracteres');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email || !password) {
      if (!email) setEmailError('Campo obrigatório');
      if (!password) setPasswordError('Campo obrigatório');
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.signInWithEmail(email, password);

      if (result.success && result.user) {
        await setUser(result.user);
        console.log('✅ Login successful for:', result.user.email);

        try {
          const firestoreData = await firebaseService.getUserData(result.user.id);

          if (firestoreData.profile || firestoreData.onboardingCompleted) {
            await updateUser({
              onboardingCompleted: firestoreData.onboardingCompleted,
              profile: firestoreData.profile || result.user.profile,
              stats: firestoreData.stats || result.user.stats,
            });

            loadFoodEntries(result.user.id);
          }

          // Navigate based on onboarding status
          const onboardingCompleted = firestoreData.onboardingCompleted ?? result.user.onboardingCompleted;
          if (onboardingCompleted) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        } catch (syncError) {
          console.warn('⚠️  Firestore sync failed after login');
          // Navigate based on user's onboarding status
          if (result.user.onboardingCompleted) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        }
      } else {
        Alert.alert('Erro de login', result.error || 'Erro ao iniciar sessão');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert('Erro', 'Erro inesperado ao iniciar sessão');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setEmailError('');
    setPasswordError('');
    setNameError('');

    if (!email || !password || !displayName.trim()) {
      if (!displayName.trim()) setNameError('Campo obrigatório');
      if (!email) setEmailError('Campo obrigatório');
      if (!password) setPasswordError('Campo obrigatório');
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!validateName(displayName) || !validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.signUpWithEmail(email, password, displayName.trim());

      if (result.success && result.user) {
        await setUser(result.user);
        console.log('✅ Registration successful for:', result.user.email);
        
        // New users go to onboarding
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      } else {
        Alert.alert('Erro no cadastro', result.error || 'Não foi possível concluir o cadastro');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      Alert.alert('Erro', 'Erro inesperado ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.signInWithGoogle();
      
      if (result.success && result.user) {
        await setUser(result.user);
        console.log('✅ Google login successful for:', result.user.email);
        
        // Navigate based on onboarding status
        try {
          const firestoreData = await firebaseService.getUserData(result.user.id);
          const onboardingCompleted = firestoreData.onboardingCompleted ?? result.user.onboardingCompleted;
          
          if (onboardingCompleted) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        } catch (syncError) {
          // Navigate based on user's onboarding status
          if (result.user.onboardingCompleted) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        }
      } else {
        Alert.alert('Erro de login', result.error || 'Erro ao entrar com o Google');
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      Alert.alert('Erro', 'Erro inesperado ao entrar com o Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.signInWithApple();
      
      if (result.success && result.user) {
        await setUser(result.user);
        console.log('✅ Apple login successful for:', result.user.email);
        
        // Navigate based on onboarding status
        try {
          const firestoreData = await firebaseService.getUserData(result.user.id);
          const onboardingCompleted = firestoreData.onboardingCompleted ?? result.user.onboardingCompleted;
          
          if (onboardingCompleted) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        } catch (syncError) {
          // Navigate based on user's onboarding status
          if (result.user.onboardingCompleted) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        }
      } else {
        Alert.alert('Erro de login', result.error || 'Erro ao entrar com a Apple');
      }
    } catch (error) {
      console.error('❌ Apple login error:', error);
      Alert.alert('Erro', 'Erro inesperado ao entrar com a Apple');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Heading1 align="center" color="primary" style={styles.logoTitle}>
              CalorIA
            </Heading1>
            <BodyText align="center" color="textSecondary" style={styles.subtitle}>
              {isRegisterMode ? 'Crie sua conta e comece sua jornada' : 'Seu assistente inteligente de nutrição'}
            </BodyText>
          </View>

          <View style={styles.authContainer}>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, !isRegisterMode && styles.modeButtonActive]}
                onPress={() => setIsRegisterMode(false)}
              >
                <BodyText style={[styles.modeButtonText, !isRegisterMode && styles.modeButtonTextActive]}>
                  Entrar
                </BodyText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, isRegisterMode && styles.modeButtonActive]}
                onPress={() => setIsRegisterMode(true)}
              >
                <BodyText style={[styles.modeButtonText, isRegisterMode && styles.modeButtonTextActive]}>
                  Criar conta
                </BodyText>
              </TouchableOpacity>
            </View>

            {isRegisterMode && (
              <View style={styles.inputWrapper}>
                <TextInput
                  label="Nome completo"
                  value={displayName}
                  onChangeText={(text) => {
                    setDisplayName(text);
                    if (text) validateName(text);
                  }}
                  placeholder="Digite seu nome"
                  autoCapitalize="words"
                  autoCorrect={false}
                  variant="filled"
                  error={nameError}
                  leftIcon={<MaterialIcons name="person" size={20} color={COLORS.textSecondary} />}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (text) validateEmail(text);
                }}
                placeholder="seu-email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                variant="filled"
                error={emailError}
                leftIcon={<MaterialIcons name="email" size={20} color={COLORS.textSecondary} />}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Senha"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (text) validatePassword(text);
                }}
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                variant="filled"
                error={passwordError}
                leftIcon={<MaterialIcons name="lock" size={20} color={COLORS.textSecondary} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={20} 
                      color={COLORS.textSecondary} 
                    />
                  </TouchableOpacity>
                }
              />
              {isRegisterMode && password ? (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBar}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.passwordStrengthSegment,
                          passwordStrength >= level && {
                            backgroundColor: passwordStrengthLabel.color,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Caption color="textSecondary" style={styles.passwordStrengthText}>
                    Força da senha: <BodyText style={{ color: passwordStrengthLabel.color }}>
                      {passwordStrengthLabel.text}
                    </BodyText>
                  </Caption>
                </View>
              ) : null}
            </View>

            <Button
              title={isRegisterMode ? 'Criar conta' : 'Entrar'}
              onPress={isRegisterMode ? handleRegister : handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <BodyText color="textSecondary" style={styles.dividerText}>
                ou continue com
              </BodyText>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Google"
              onPress={handleGoogleLogin}
              variant="outline"
              fullWidth
              style={styles.socialButton}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  subtitle: {
    marginTop: SPACING.sm,
  },
  authContainer: {
    gap: SPACING.md,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  modeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: COLORS.surface,
  },
  formArea: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
  },
  socialButton: {
    marginBottom: SPACING.sm,
  },
  logoTitle: {
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    marginBottom: SPACING.sm,
  },
  passwordStrengthContainer: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  passwordStrengthBar: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: SPACING.xs,
  },
  passwordStrengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  passwordStrengthText: {
    fontSize: 12,
  },
});