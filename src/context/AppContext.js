/**
 * App Context
 * 
 * Global state management for the MediCaffe app using React Context.
 * Manages user profile, medications list, theme settings, and provides methods for state updates.
 * Handles data persistence through AsyncStorage.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  getUserProfile,
  saveUserProfile,
  getMedications,
  saveMedications,
  addMedication as addMedicationToStorage,
  updateMedication as updateMedicationInStorage,
  deleteMedication as deleteMedicationFromStorage,
  isOnboardingComplete,
  completeOnboarding as markOnboardingComplete,
  getInteractionHistory,
  getAIChatHistory,
  getAppSettings,
  saveAppSettings,
} from '../utils/storage';
import { LIGHT_COLORS, DARK_COLORS } from '../styles/theme';

// Create the context
const AppContext = createContext(null);

/**
 * App Context Provider
 * Wraps the app and provides global state and methods
 */
export const AppProvider = ({ children }) => {
  // System color scheme
  const systemColorScheme = useColorScheme();
  
  // Theme state: 'light', 'dark', or 'system'
  const [themeMode, setThemeMode] = useState('system');
  
  // User profile state
  const [userProfile, setUserProfile] = useState(null);
  
  // Medications list state
  const [medications, setMedications] = useState([]);
  
  // Onboarding status
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  // Interaction history
  const [interactionHistory, setInteractionHistory] = useState([]);
  
  // Chat history
  const [chatHistory, setChatHistory] = useState([]);
  
  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  
  // Error state
  const [error, setError] = useState(null);

  // Calculate actual theme based on mode
  const isDarkMode = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Get current theme colors
  const colors = useMemo(() => {
    return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  }, [isDarkMode]);

  /**
   * Load all data from AsyncStorage on app start
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('[AppContext] Loading initial data...');
        
        // Load all data in parallel for efficiency
        const [
          profile,
          meds,
          onboarding,
          interactions,
          chat,
          settings,
        ] = await Promise.all([
          getUserProfile(),
          getMedications(),
          isOnboardingComplete(),
          getInteractionHistory(),
          getAIChatHistory(),
          getAppSettings(),
        ]);

        setUserProfile(profile);
        setMedications(meds || []);
        setOnboardingComplete(onboarding);
        setInteractionHistory(interactions || []);
        setChatHistory(chat || []);
        
        // Load theme from settings
        if (settings?.themeMode) {
          setThemeMode(settings.themeMode);
        }
        
        console.log('[AppContext] Initial data loaded successfully');
        console.log('[AppContext] Onboarding complete:', onboarding);
        console.log('[AppContext] Medications count:', meds?.length || 0);
      } catch (err) {
        console.error('[AppContext] Error loading initial data:', err);
        setError('Failed to load app data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  /**
   * Toggle theme mode
   */
  const toggleTheme = useCallback(async () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setThemeMode(newMode);
    try {
      const settings = await getAppSettings() || {};
      await saveAppSettings({ ...settings, themeMode: newMode });
    } catch (err) {
      console.error('[AppContext] Error saving theme:', err);
    }
  }, [isDarkMode]);

  /**
   * Set specific theme mode
   */
  const setTheme = useCallback(async (mode) => {
    setThemeMode(mode);
    try {
      const settings = await getAppSettings() || {};
      await saveAppSettings({ ...settings, themeMode: mode });
    } catch (err) {
      console.error('[AppContext] Error saving theme:', err);
    }
  }, []);

  /**
   * Update user profile
   * @param {Object} profile - Updated profile data
   */
  const updateUserProfile = useCallback(async (profile) => {
    try {
      await saveUserProfile(profile);
      setUserProfile(profile);
      console.log('[AppContext] User profile updated');
      return true;
    } catch (err) {
      console.error('[AppContext] Error updating profile:', err);
      setError('Failed to update profile');
      return false;
    }
  }, []);

  /**
   * Add a new medication
   * @param {Object} medication - Medication data
   */
  const addMedication = useCallback(async (medication) => {
    try {
      const newMedication = await addMedicationToStorage(medication);
      setMedications((prev) => [...prev, newMedication]);
      console.log('[AppContext] Medication added:', newMedication.name);
      return newMedication;
    } catch (err) {
      console.error('[AppContext] Error adding medication:', err);
      setError('Failed to add medication');
      return null;
    }
  }, []);

  /**
   * Update an existing medication
   * @param {string} id - Medication ID
   * @param {Object} updates - Updated fields
   */
  const updateMedication = useCallback(async (id, updates) => {
    try {
      const updated = await updateMedicationInStorage(id, updates);
      if (updated) {
        setMedications((prev) =>
          prev.map((med) => (med.id === id ? updated : med))
        );
        console.log('[AppContext] Medication updated:', id);
        return updated;
      }
      return null;
    } catch (err) {
      console.error('[AppContext] Error updating medication:', err);
      setError('Failed to update medication');
      return null;
    }
  }, []);

  /**
   * Delete a medication
   * @param {string} id - Medication ID
   */
  const deleteMedication = useCallback(async (id) => {
    try {
      await deleteMedicationFromStorage(id);
      setMedications((prev) => prev.filter((med) => med.id !== id));
      console.log('[AppContext] Medication deleted:', id);
      return true;
    } catch (err) {
      console.error('[AppContext] Error deleting medication:', err);
      setError('Failed to delete medication');
      return false;
    }
  }, []);

  /**
   * Mark onboarding as complete
   */
  const completeOnboarding = useCallback(async () => {
    try {
      await markOnboardingComplete();
      setOnboardingComplete(true);
      console.log('[AppContext] Onboarding marked as complete');
      return true;
    } catch (err) {
      console.error('[AppContext] Error completing onboarding:', err);
      setError('Failed to complete onboarding');
      return false;
    }
  }, []);

  /**
   * Refresh interaction history from storage
   */
  const refreshInteractionHistory = useCallback(async () => {
    try {
      const history = await getInteractionHistory();
      setInteractionHistory(history || []);
      return history;
    } catch (err) {
      console.error('[AppContext] Error refreshing interaction history:', err);
      return [];
    }
  }, []);

  /**
   * Refresh chat history from storage
   */
  const refreshChatHistory = useCallback(async () => {
    try {
      const history = await getAIChatHistory();
      setChatHistory(history || []);
      return history;
    } catch (err) {
      console.error('[AppContext] Error refreshing chat history:', err);
      return [];
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get active medications only
   */
  const activeMedications = medications.filter((med) => med.isActive !== false);

  /**
   * Get inactive medications only
   */
  const inactiveMedications = medications.filter((med) => med.isActive === false);

  // Context value object
  const value = {
    // State
    userProfile,
    medications,
    activeMedications,
    inactiveMedications,
    onboardingComplete,
    interactionHistory,
    chatHistory,
    isLoading,
    error,
    
    // Theme
    isDarkMode,
    themeMode,
    colors,
    toggleTheme,
    setTheme,
    
    // Methods
    updateUserProfile,
    addMedication,
    updateMedication,
    deleteMedication,
    completeOnboarding,
    refreshInteractionHistory,
    refreshChatHistory,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to use the App Context
 * Throws error if used outside of AppProvider
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
