/**
 * MediCaffe - AI-Powered Medication Interaction Checker
 * 
 * Main App entry point that sets up providers and navigation.
 * 
 * This app helps users:
 * - Manage their medications
 * - Check for drug interactions using AI
 * - Get AI-powered answers to medication questions
 * - Track their medication history
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Root App Component
 * Wraps the app with necessary providers:
 * - SafeAreaProvider: Handles safe area insets for notched devices
 * - AppProvider: Global state management context
 * - AppNavigator: Navigation container and routes
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
