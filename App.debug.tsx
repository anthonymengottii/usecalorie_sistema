/**
 * Debug App - Minimal version to isolate the boolean casting error
 * Use this temporarily to identify which component is causing the issue
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.text}>Debug App - No Navigation</Text>
        <Text style={styles.subtext}>If you see this without errors, the problem is in Navigation or other components</Text>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

