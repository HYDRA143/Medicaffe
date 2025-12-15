/**
 * useAI Custom Hook
 * 
 * Provides a clean interface for AI-related functionality throughout the app.
 * Handles loading states, error handling, and caching of AI responses.
 */

import { useState, useCallback } from 'react';
import {
  checkDrugInteractions,
  getMedicationInfo,
  askMedicationQuestion,
  getMedicationSuggestions,
} from '../utils/aiService';
import {
  saveInteractionHistory,
  addAIChatMessage,
} from '../utils/storage';

/**
 * Custom hook for AI interactions
 * Provides methods for drug interaction checking, medication info, and Q&A
 */
const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check for drug interactions between medications
   * Saves results to interaction history
   * 
   * @param {Array} medications - Array of medication objects to check
   * @returns {Promise<Object>} - Interaction check results
   */
  const checkInteractions = useCallback(async (medications) => {
    setLoading(true);
    setError(null);

    try {
      const result = await checkDrugInteractions(medications);
      
      // Save to history for future reference
      await saveInteractionHistory(result);
      
      console.log('[useAI] Interaction check completed:', result.hasInteractions);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to check drug interactions';
      setError(errorMessage);
      console.error('[useAI] Interaction check error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get detailed information about a medication
   * 
   * @param {Object} medication - Medication object
   * @returns {Promise<Object>} - Detailed medication information
   */
  const fetchMedicationInfo = useCallback(async (medication) => {
    setLoading(true);
    setError(null);

    try {
      const info = await getMedicationInfo(medication);
      console.log('[useAI] Medication info fetched for:', medication.name);
      return info;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get medication information';
      setError(errorMessage);
      console.error('[useAI] Medication info error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ask a question about medications
   * Saves Q&A to chat history
   * 
   * @param {string} question - User's question
   * @param {Array} userMedications - User's current medications for context
   * @returns {Promise<string>} - AI response
   */
  const askQuestion = useCallback(async (question, userMedications = []) => {
    setLoading(true);
    setError(null);

    try {
      // Save user question to history
      await addAIChatMessage({
        role: 'user',
        content: question,
      });

      const answer = await askMedicationQuestion(question, userMedications);
      
      // Save AI response to history
      await addAIChatMessage({
        role: 'assistant',
        content: answer,
      });

      console.log('[useAI] Question answered successfully');
      return answer;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get an answer';
      setError(errorMessage);
      console.error('[useAI] Question error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get AI suggestions for medication timing and best practices
   * 
   * @param {Object} medication - Medication object
   * @returns {Promise<Object>} - Suggestions and tips
   */
  const fetchSuggestions = useCallback(async (medication) => {
    setLoading(true);
    setError(null);

    try {
      const suggestions = await getMedicationSuggestions(medication);
      console.log('[useAI] Suggestions fetched for:', medication.name);
      return suggestions;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get suggestions';
      setError(errorMessage);
      console.error('[useAI] Suggestions error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,
    
    // Methods
    clearError,
    checkInteractions,
    fetchMedicationInfo,
    askQuestion,
    fetchSuggestions,
  };
};

export default useAI;
