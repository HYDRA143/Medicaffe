/**
 * App Navigator
 * 
 * Main navigation configuration using React Navigation.
 * Handles onboarding flow and main app navigation with tab bar.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING } from '../styles/theme';
import { useApp } from '../context/AppContext';
import {
  OnboardingScreen,
  HomeScreen,
  AddMedicationScreen,
  MedicationDetailScreen,
  InteractionCheckerScreen,
  AIAssistantScreen,
  ProfileScreen,
} from '../screens';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Home Stack Navigator
 * Contains home screen and related nested screens
 */
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="MedicationDetail" component={MedicationDetailScreen} />
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main Tab Navigator
 * Bottom tab navigation for main app sections
 */
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'InteractionChecker':
              iconName = focused ? 'shield-check' : 'shield-check-outline';
              break;
            case 'AIAssistant':
              iconName = focused ? 'robot' : 'robot-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: SPACING.sm,
          paddingBottom: SPACING.sm,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.fontSize.xs,
          fontWeight: TYPOGRAPHY.fontWeight.medium,
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="InteractionChecker"
        component={InteractionCheckerScreen}
        options={{
          tabBarLabel: 'Check',
        }}
      />
      <Tab.Screen
        name="AIAssistant"
        component={AIAssistantScreen}
        options={{
          tabBarLabel: 'AI Help',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Navigator
 * Handles onboarding vs main app flow
 */
const RootNavigator = () => {
  const { isLoading, onboardingComplete } = useApp();

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {!onboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
      
      {/* Modal screens accessible from anywhere */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="AddMedication"
          component={AddMedicationScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

/**
 * App Navigator with Navigation Container
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;
