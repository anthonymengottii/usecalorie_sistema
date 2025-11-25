/**
 * CalorIA - Unified Authentication Service
 * Handles all authentication methods (Email, Google, Apple)
 */

import { AuthService } from './firebase';
import type { AuthResult, User } from '../types';

export class AuthServiceUnified {
  /**
   * Sign in with email and password
   */
  static async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const authResult = await AuthService.signInWithEmail(email, password);
      
      const user: User = {
        id: authResult.id,
        email: authResult.email,
        displayName: authResult.displayName,
        photoURL: authResult.photoURL,
        createdAt: authResult.createdAt,
      };

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao iniciar sessão',
      };
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthResult> {
    try {
      const authResult = await AuthService.signUpWithEmail(email, password, displayName);
      
      const user: User = {
        id: authResult.id,
        email: authResult.email,
        displayName: displayName || authResult.displayName,
        photoURL: authResult.photoURL,
        createdAt: authResult.createdAt,
      };

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao realizar cadastro',
      };
    }
  }

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      const authResult = await AuthService.signInWithGoogle();
      
      const user: User = {
        id: authResult.id,
        email: authResult.email,
        displayName: authResult.displayName,
        photoURL: authResult.photoURL,
        createdAt: authResult.createdAt,
      };

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao entrar com o Google',
      };
    }
  }

  /**
   * Sign in with Apple
   */
  static async signInWithApple(): Promise<AuthResult> {
    try {
      const authResult = await AuthService.signInWithApple();
      
      const user: User = {
        id: authResult.id,
        email: authResult.email,
        displayName: authResult.displayName,
        photoURL: authResult.photoURL,
        createdAt: authResult.createdAt,
      };

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('❌ Apple sign in error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao entrar com a Apple',
      };
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  }
}

