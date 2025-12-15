/**
 * AsyncStorage Utility Functions
 * 
 * Provides a clean abstraction layer over AsyncStorage for data persistence.
 * Includes error handling and JSON serialization/deserialization.
 * 
 * IMPORTANT: All data is stored locally on the device. No data is sent to external
 * servers except for AI API calls which are handled separately.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Store data in AsyncStorage
 * Automatically serializes objects to JSON strings
 * 
 * @param {string} key - Storage key from STORAGE_KEYS
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {Promise<boolean>} - Success status
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`[Storage] Saved data for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`[Storage] Error saving data for key ${key}:`, error);
    return false;
  }
};

/**
 * Retrieve data from AsyncStorage
 * Automatically deserializes JSON strings to objects
 * 
 * @param {string} key - Storage key from STORAGE_KEYS
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {Promise<any>} - Retrieved value or default
 */
export const getData = async (key, defaultValue = null) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      console.log(`[Storage] No data found for key: ${key}, returning default`);
      return defaultValue;
    }
    const parsedValue = JSON.parse(jsonValue);
    console.log(`[Storage] Retrieved data for key: ${key}`);
    return parsedValue;
  } catch (error) {
    console.error(`[Storage] Error retrieving data for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove data from AsyncStorage
 * 
 * @param {string} key - Storage key to remove
 * @returns {Promise<boolean>} - Success status
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`[Storage] Removed data for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing data for key ${key}:`, error);
    return false;
  }
};

/**
 * Clear all app data from AsyncStorage
 * Use with caution - this removes all stored data
 * 
 * @returns {Promise<boolean>} - Success status
 */
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    console.log('[Storage] Cleared all app data');
    return true;
  } catch (error) {
    console.error('[Storage] Error clearing all data:', error);
    return false;
  }
};

// ============================================
// Specialized functions for specific data types
// ============================================

/**
 * Save user profile data
 * @param {Object} profile - User profile object
 */
export const saveUserProfile = async (profile) => {
  return await storeData(STORAGE_KEYS.USER_PROFILE, {
    ...profile,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Get user profile data
 * @returns {Promise<Object|null>} - User profile or null
 */
export const getUserProfile = async () => {
  return await getData(STORAGE_KEYS.USER_PROFILE, null);
};

/**
 * Save medications list
 * @param {Array} medications - Array of medication objects
 */
export const saveMedications = async (medications) => {
  return await storeData(STORAGE_KEYS.MEDICATIONS, medications);
};

/**
 * Get medications list
 * @returns {Promise<Array>} - Array of medications or empty array
 */
export const getMedications = async () => {
  return await getData(STORAGE_KEYS.MEDICATIONS, []);
};

/**
 * Add a single medication to the list
 * @param {Object} medication - Medication object to add
 */
export const addMedication = async (medication) => {
  const medications = await getMedications();
  const newMedication = {
    ...medication,
    id: Date.now().toString(), // Simple unique ID
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  medications.push(newMedication);
  await saveMedications(medications);
  return newMedication;
};

/**
 * Update an existing medication
 * @param {string} id - Medication ID to update
 * @param {Object} updates - Fields to update
 */
export const updateMedication = async (id, updates) => {
  const medications = await getMedications();
  const index = medications.findIndex((med) => med.id === id);
  if (index !== -1) {
    medications[index] = {
      ...medications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await saveMedications(medications);
    return medications[index];
  }
  return null;
};

/**
 * Delete a medication from the list
 * @param {string} id - Medication ID to delete
 */
export const deleteMedication = async (id) => {
  const medications = await getMedications();
  const filteredMedications = medications.filter((med) => med.id !== id);
  await saveMedications(filteredMedications);
  return true;
};

/**
 * Save interaction check history
 * @param {Object} interaction - Interaction check result
 */
export const saveInteractionHistory = async (interaction) => {
  const history = await getData(STORAGE_KEYS.INTERACTIONS_HISTORY, []);
  const newEntry = {
    ...interaction,
    id: Date.now().toString(),
    checkedAt: new Date().toISOString(),
  };
  // Keep only last 50 interactions to prevent storage bloat
  const updatedHistory = [newEntry, ...history].slice(0, 50);
  await storeData(STORAGE_KEYS.INTERACTIONS_HISTORY, updatedHistory);
  return newEntry;
};

/**
 * Get interaction check history
 * @returns {Promise<Array>} - Array of past interaction checks
 */
export const getInteractionHistory = async () => {
  return await getData(STORAGE_KEYS.INTERACTIONS_HISTORY, []);
};

/**
 * Save AI chat history
 * @param {Array} messages - Array of chat messages
 */
export const saveAIChatHistory = async (messages) => {
  // Keep only last 100 messages to prevent storage bloat
  const trimmedMessages = messages.slice(-100);
  return await storeData(STORAGE_KEYS.AI_CHAT_HISTORY, trimmedMessages);
};

/**
 * Get AI chat history
 * @returns {Promise<Array>} - Array of chat messages
 */
export const getAIChatHistory = async () => {
  return await getData(STORAGE_KEYS.AI_CHAT_HISTORY, []);
};

/**
 * Add a message to AI chat history
 * @param {Object} message - Message object with role and content
 */
export const addAIChatMessage = async (message) => {
  const history = await getAIChatHistory();
  const newMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  history.push(newMessage);
  await saveAIChatHistory(history);
  return newMessage;
};

/**
 * Check if onboarding is complete
 * @returns {Promise<boolean>} - Whether onboarding is complete
 */
export const isOnboardingComplete = async () => {
  return await getData(STORAGE_KEYS.ONBOARDING_COMPLETE, false);
};

/**
 * Mark onboarding as complete
 */
export const completeOnboarding = async () => {
  return await storeData(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
};

/**
 * Get app settings
 * @returns {Promise<Object>} - App settings object
 */
export const getAppSettings = async () => {
  const defaultSettings = {
    notifications: true,
    themeMode: 'system',
    fontSize: 'medium',
    hapticFeedback: true,
  };
  return await getData(STORAGE_KEYS.APP_SETTINGS, defaultSettings);
};

/**
 * Save app settings
 * @param {Object} settings - Settings object to save
 */
export const saveAppSettings = async (settings) => {
  return await storeData(STORAGE_KEYS.APP_SETTINGS, settings);
};

// Keep old function names for backwards compatibility
export const getSettings = getAppSettings;
export const saveSettings = saveAppSettings;
