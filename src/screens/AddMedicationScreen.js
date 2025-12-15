/**
 * Add Medication Screen
 * 
 * Form for adding new medications with AI-powered suggestions.
 * Features interactive input with medication name suggestions and emojis.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, EMOJIS } from '../styles/theme';
import {
  MEDICATION_FORMS,
  FREQUENCY_OPTIONS,
  TIMING_OPTIONS,
  MEDICATION_CATEGORIES,
  MEDICATION_SUGGESTIONS,
  DOSAGE_SUGGESTIONS,
} from '../utils/constants';
import { Header, Button, Input, Card, LoadingSpinner } from '../components';
import { useApp } from '../context/AppContext';
import { useAI } from '../hooks';

const AddMedicationScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { addMedication, colors } = useApp();
  const { fetchSuggestions, loading: aiLoading } = useAI();
  
  // Check if editing existing medication
  const editingMedication = route.params?.medication;
  const isEditing = !!editingMedication;
  
  // Form state
  const [formData, setFormData] = useState({
    name: editingMedication?.name || '',
    dosage: editingMedication?.dosage || '',
    unit: editingMedication?.unit || 'mg',
    form: editingMedication?.form || 'tablet',
    frequency: editingMedication?.frequency || 'once_daily',
    timing: editingMedication?.timing || '',
    category: editingMedication?.category || '',
    notes: editingMedication?.notes || '',
    prescribedBy: editingMedication?.prescribedBy || '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showMedSuggestions, setShowMedSuggestions] = useState(false);
  const [showDosageSuggestions, setShowDosageSuggestions] = useState(false);

  // Common dosage units
  const DOSAGE_UNITS = ['mg', 'g', 'mcg', 'ml', 'IU', 'units', '%'];

  // Filter medication suggestions based on input
  const filteredMedSuggestions = useMemo(() => {
    if (!formData.name || formData.name.length < 1) return MEDICATION_SUGGESTIONS.slice(0, 8);
    return MEDICATION_SUGGESTIONS.filter(
      med => med.name.toLowerCase().includes(formData.name.toLowerCase())
    ).slice(0, 6);
  }, [formData.name]);

  /**
   * Update form field
   */
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    // Show suggestions when typing medication name
    if (field === 'name') {
      setShowMedSuggestions(value.length > 0);
    }
    if (field === 'dosage') {
      setShowDosageSuggestions(value.length === 0);
    }
  };

  /**
   * Select a medication suggestion
   */
  const selectMedSuggestion = (med) => {
    updateField('name', med.name);
    // Auto-select category if available
    if (med.category) {
      updateField('category', med.category);
    }
    setShowMedSuggestions(false);
  };

  /**
   * Select a dosage suggestion
   */
  const selectDosageSuggestion = (dosage) => {
    updateField('dosage', dosage.value);
    setShowDosageSuggestions(false);
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    } else if (isNaN(formData.dosage)) {
      newErrors.dosage = 'Dosage must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Get AI suggestions for medication
   */
  const handleGetSuggestions = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Enter Medication', 'Please enter a medication name first');
      return;
    }

    try {
      const suggestions = await fetchSuggestions({
        name: formData.name,
        dosage: formData.dosage || 'standard',
        unit: formData.unit,
        form: formData.form,
        frequency: formData.frequency,
      });
      
      setAiSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI suggestions. Please try again.');
    }
  };

  /**
   * Submit form
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const medication = {
        name: formData.name.trim(),
        dosage: formData.dosage.trim(),
        unit: formData.unit,
        form: formData.form,
        frequency: formData.frequency,
        timing: formData.timing || null,
        category: formData.category || null,
        notes: formData.notes.trim() || null,
        prescribedBy: formData.prescribedBy.trim() || null,
      };
      
      await addMedication(medication);
      
      Alert.alert(
        'Success',
        `${medication.name} has been added to your medications.`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setFormData({
                name: '',
                dosage: '',
                unit: 'mg',
                form: 'tablet',
                frequency: 'once_daily',
                timing: '',
                category: '',
                notes: '',
                prescribedBy: '',
              });
              setAiSuggestions(null);
              setShowSuggestions(false);
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add medication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Render option selector with emojis
   */
  const renderOptionSelector = (title, options, selectedValue, onSelect, columns = 3) => {
    return (
      <View style={styles.optionSection}>
        <Text style={[styles.optionTitle, { color: colors.textSecondary }]}>{title}</Text>
        <View style={[styles.optionGrid, { flexWrap: 'wrap' }]}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                { width: `${100 / columns - 2}%`, backgroundColor: colors.surface },
                selectedValue === option.value && [styles.optionItemSelected, { borderColor: colors.primary, backgroundColor: colors.primarySoft }],
              ]}
              onPress={() => onSelect(option.value)}
            >
              {option.emoji && <Text style={styles.optionEmoji}>{option.emoji}</Text>}
              <Text
                style={[
                  styles.optionText,
                  { color: colors.textPrimary },
                  selectedValue === option.value && [styles.optionTextSelected, { color: colors.primary }],
                ]}
                numberOfLines={1}
              >
                {option.label.replace(option.emoji + ' ', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Dynamic styles
  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    cardTitle: { color: colors.textPrimary },
    label: { color: colors.textSecondary },
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, dynamicStyles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title={isEditing ? '✏️ Edit Medication' : '➕ Add Medication'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING['3xl'] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>💊 Basic Information</Text>
          
          <Input
            label="Medication Name *"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="💊 e.g., Aspirin, Metformin"
            leftIcon="pill"
            error={errors.name}
            autoCapitalize="words"
            onFocus={() => setShowMedSuggestions(true)}
          />
          
          {/* Medication Name Suggestions */}
          {showMedSuggestions && filteredMedSuggestions.length > 0 && (
            <View style={[styles.suggestionsBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.suggestionsLabel, { color: colors.textSecondary }]}>
                ✨ Quick suggestions:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.suggestionsRow}>
                  {filteredMedSuggestions.map((med, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.suggestionChip, { backgroundColor: colors.primarySoft }]}
                      onPress={() => selectMedSuggestion(med)}
                    >
                      <Text style={styles.suggestionEmoji}>{med.emoji}</Text>
                      <Text style={[styles.suggestionText, { color: colors.primary }]}>{med.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          
          <View style={styles.row}>
            <View style={styles.dosageInput}>
              <Input
                label="Dosage *"
                value={formData.dosage}
                onChangeText={(text) => updateField('dosage', text)}
                placeholder="e.g., 500"
                keyboardType="numeric"
                error={errors.dosage}
                onFocus={() => setShowDosageSuggestions(true)}
              />
            </View>
            <View style={styles.unitSelector}>
              <Text style={[styles.label, dynamicStyles.label]}>Unit</Text>
              <View style={styles.unitButtons}>
                {DOSAGE_UNITS.slice(0, 4).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitButton,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      formData.unit === unit && [styles.unitButtonSelected, { backgroundColor: colors.primary }],
                    ]}
                    onPress={() => updateField('unit', unit)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        { color: colors.textPrimary },
                        formData.unit === unit && styles.unitButtonTextSelected,
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          {/* Dosage Suggestions */}
          {showDosageSuggestions && !formData.dosage && (
            <View style={styles.dosageSuggestions}>
              <Text style={[styles.suggestionsLabel, { color: colors.textSecondary }]}>
                💡 Common dosages:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.suggestionsRow}>
                  {DOSAGE_SUGGESTIONS.map((dosage, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.dosageChip, { backgroundColor: colors.cardAccent }]}
                      onPress={() => selectDosageSuggestion(dosage)}
                    >
                      <Text style={[styles.dosageChipText, { color: colors.textPrimary }]}>{dosage.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </Card>

        {/* Medication Form */}
        <Card style={styles.card}>
          <Text style={[styles.cardSectionTitle, { color: colors.textPrimary }]}>💊 Medication Form</Text>
          {renderOptionSelector(
            '',
            MEDICATION_FORMS,
            formData.form,
            (value) => updateField('form', value),
            3
          )}
        </Card>

        {/* Frequency */}
        <Card style={styles.card}>
          <Text style={[styles.cardSectionTitle, { color: colors.textPrimary }]}>⏰ Frequency</Text>
          {renderOptionSelector(
            '',
            FREQUENCY_OPTIONS,
            formData.frequency,
            (value) => updateField('frequency', value),
            2
          )}
        </Card>

        {/* Timing */}
        <Card style={styles.card}>
          <Text style={[styles.cardSectionTitle, { color: colors.textPrimary }]}>🕐 When to Take (Optional)</Text>
          {renderOptionSelector(
            '',
            TIMING_OPTIONS,
            formData.timing,
            (value) => updateField('timing', formData.timing === value ? '' : value),
            2
          )}
        </Card>

        {/* AI Suggestions Button */}
        <TouchableOpacity
          style={[styles.aiButton, { backgroundColor: colors.secondaryLight + '20', borderColor: colors.secondary }]}
          onPress={handleGetSuggestions}
          disabled={aiLoading}
        >
          <Text style={styles.aiButtonEmoji}>🤖</Text>
          <Text style={[styles.aiButtonText, { color: colors.secondary }]}>
            {aiLoading ? '⏳ Getting AI Suggestions...' : '✨ Get AI Suggestions'}
          </Text>
          {aiLoading && <LoadingSpinner size="small" />}
        </TouchableOpacity>

        {/* AI Suggestions Card */}
        {showSuggestions && aiSuggestions && (
          <Card style={[styles.suggestionsCard, { backgroundColor: colors.cardAccent }]}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionHeaderEmoji}>💡</Text>
              <Text style={[styles.suggestionsTitle, { color: colors.textPrimary }]}>AI Suggestions</Text>
              <TouchableOpacity
                onPress={() => setShowSuggestions(false)}
              >
                <Text style={styles.closeEmoji}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {aiSuggestions.bestTimeToTake && (
              <View style={styles.suggestionItem}>
                <Text style={[styles.suggestionLabel, { color: colors.textSecondary }]}>⏰ Best Time to Take:</Text>
                <Text style={[styles.suggestionText, { color: colors.textPrimary }]}>{aiSuggestions.bestTimeToTake}</Text>
              </View>
            )}
            
            {aiSuggestions.withFood && (
              <View style={styles.suggestionItem}>
                <Text style={[styles.suggestionLabel, { color: colors.textSecondary }]}>🍽️ With Food:</Text>
                <Text style={[styles.suggestionText, { color: colors.textPrimary }]}>{aiSuggestions.withFood}</Text>
              </View>
            )}
            
            {aiSuggestions.tips && aiSuggestions.tips.length > 0 && (
              <View style={styles.suggestionItem}>
                <Text style={[styles.suggestionLabel, { color: colors.textSecondary }]}>💡 Tips:</Text>
                {aiSuggestions.tips.map((tip, index) => (
                  <Text key={index} style={[styles.suggestionBullet, { color: colors.textPrimary }]}>• {tip}</Text>
                ))}
              </View>
            )}
            
            {aiSuggestions.warnings && aiSuggestions.warnings.length > 0 && (
              <View style={[styles.suggestionItem, styles.warningItem, { backgroundColor: colors.warningLight }]}>
                <Text style={[styles.suggestionLabel, { color: colors.warning }]}>⚠️ Warnings:</Text>
                {aiSuggestions.warnings.map((warning, index) => (
                  <Text key={index} style={[styles.warningBullet, { color: colors.warningDark }]}>• {warning}</Text>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Additional Information */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>📝 Additional Information</Text>
          
          <Input
            label="Prescribed By (Optional)"
            value={formData.prescribedBy}
            onChangeText={(text) => updateField('prescribedBy', text)}
            placeholder="👨‍⚕️ Doctor's name"
            leftIcon="doctor"
          />
          
          <Input
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(text) => updateField('notes', text)}
            placeholder="📋 Any additional notes or instructions"
            multiline
            numberOfLines={3}
            leftIcon="note-text"
          />
        </Card>

        {/* Submit Button */}
        <Button
          title={isEditing ? '✅ Save Changes' : '➕ Add Medication'}
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
          size="large"
          icon="check"
          iconPosition="right"
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
  },
  
  // Card styles
  card: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.md,
  },
  cardSectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.sm,
  },
  
  // Medication suggestions box
  suggestionsBox: {
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  suggestionsLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginBottom: SPACING.sm,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  suggestionEmoji: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  suggestionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  
  // Dosage suggestions
  dosageSuggestions: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  dosageChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  dosageChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  
  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dosageInput: {
    flex: 1,
    marginRight: SPACING.md,
  },
  unitSelector: {
    width: 140,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.sm,
  },
  unitButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  unitButtonSelected: {
    borderWidth: 0,
  },
  unitButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  unitButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  
  // Option selector styles
  optionSection: {
    marginBottom: SPACING.sm,
  },
  optionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.md,
  },
  optionGrid: {
    flexDirection: 'row',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: '1%',
    marginBottom: SPACING.sm,
  },
  optionItemSelected: {
    borderWidth: 1.5,
  },
  optionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  optionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
  optionTextSelected: {
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  
  // AI button
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  aiButtonEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  aiButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginRight: SPACING.sm,
  },
  
  // AI Suggestions card
  suggestionsCard: {
    marginBottom: SPACING.md,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  suggestionHeaderEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  suggestionsTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  closeEmoji: {
    fontSize: 18,
    opacity: 0.5,
  },
  suggestionItem: {
    marginBottom: SPACING.md,
  },
  suggestionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.xs,
  },
  suggestionBullet: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginLeft: SPACING.sm,
    marginBottom: 2,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.relaxed,
  },
  warningItem: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    marginTop: SPACING.sm,
  },
  warningBullet: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginLeft: SPACING.sm,
    marginBottom: 2,
  },
  
  // Submit button
  submitButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
});

export default AddMedicationScreen;
