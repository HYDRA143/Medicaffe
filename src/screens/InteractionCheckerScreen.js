/**
 * Interaction Checker Screen
 * 
 * AI-powered drug interaction checker that analyzes selected medications
 * for potential interactions and displays results with severity levels.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import {
  Header,
  Button,
  Card,
  MedicationCard,
  InteractionAlert,
  LoadingSpinner,
  EmptyState,
} from '../components';
import { useApp } from '../context/AppContext';
import { useAI } from '../hooks';

const InteractionCheckerScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { activeMedications, interactionHistory, refreshInteractionHistory } = useApp();
  const { checkInteractions, loading, error, clearError } = useAI();
  
  // Selected medications for checking
  const [selectedMedications, setSelectedMedications] = useState([]);
  
  // Interaction check results
  const [results, setResults] = useState(null);
  
  // Expanded interaction index
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // View mode: 'select' or 'results' or 'history'
  const [viewMode, setViewMode] = useState('select');

  // Handle preselected medication from route params
  useEffect(() => {
    if (route.params?.preselectedMed) {
      setSelectedMedications([route.params.preselectedMed]);
    }
  }, [route.params?.preselectedMed]);

  // Load interaction history
  useEffect(() => {
    refreshInteractionHistory();
  }, [refreshInteractionHistory]);

  /**
   * Toggle medication selection
   */
  const toggleMedication = (medication) => {
    setSelectedMedications((prev) => {
      const isSelected = prev.some((m) => m.id === medication.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== medication.id);
      }
      return [...prev, medication];
    });
    // Clear previous results when selection changes
    setResults(null);
  };

  /**
   * Check for interactions
   */
  const handleCheckInteractions = async () => {
    if (selectedMedications.length < 2) {
      Alert.alert(
        'Select Medications',
        'Please select at least 2 medications to check for interactions.'
      );
      return;
    }

    clearError();
    
    try {
      const interactionResults = await checkInteractions(selectedMedications);
      setResults(interactionResults);
      setViewMode('results');
    } catch (err) {
      Alert.alert('Error', 'Failed to check interactions. Please try again.');
    }
  };

  /**
   * Select all medications
   */
  const handleSelectAll = () => {
    setSelectedMedications(activeMedications);
  };

  /**
   * Clear selection
   */
  const handleClearSelection = () => {
    setSelectedMedications([]);
    setResults(null);
    setViewMode('select');
  };

  /**
   * Get severity color
   */
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'none':
        return COLORS.success;
      case 'mild':
        return COLORS.info;
      case 'moderate':
        return COLORS.warning;
      case 'severe':
        return COLORS.danger;
      default:
        return COLORS.textSecondary;
    }
  };

  /**
   * Render selection view
   */
  const renderSelectionView = () => (
    <>
      {/* Selection Header */}
      <View style={styles.selectionHeader}>
        <Text style={styles.selectionTitle}>
          Select medications to check for interactions
        </Text>
        <View style={styles.selectionActions}>
          <TouchableOpacity
            style={styles.actionLink}
            onPress={handleSelectAll}
          >
            <Text style={styles.actionLinkText}>Select All</Text>
          </TouchableOpacity>
          {selectedMedications.length > 0 && (
            <>
              <Text style={styles.actionDivider}>|</Text>
              <TouchableOpacity
                style={styles.actionLink}
                onPress={handleClearSelection}
              >
                <Text style={styles.actionLinkText}>Clear</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Selected count badge */}
      {selectedMedications.length > 0 && (
        <View style={styles.selectedBadge}>
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.selectedBadgeText}>
            {selectedMedications.length} medication{selectedMedications.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      {/* Medications List */}
      {activeMedications.length === 0 ? (
        <EmptyState
          icon="pill"
          title="No Medications"
          description="Add medications to your list to check for interactions"
          actionLabel="Add Medication"
          onAction={() => navigation.navigate('AddMedication')}
        />
      ) : (
        activeMedications.map((medication) => {
          const isSelected = selectedMedications.some((m) => m.id === medication.id);
          return (
            <TouchableOpacity
              key={medication.id}
              style={[
                styles.medicationSelectItem,
                isSelected && styles.medicationSelectItemSelected,
              ]}
              onPress={() => toggleMedication(medication)}
              activeOpacity={0.7}
            >
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}>
                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color={COLORS.white}
                    />
                  )}
                </View>
              </View>
              <MedicationCard
                medication={medication}
                compact
                style={styles.medicationCardInSelect}
              />
            </TouchableOpacity>
          );
        })
      )}

      {/* Check Button */}
      {activeMedications.length >= 2 && (
        <Button
          title="Check for Interactions"
          onPress={handleCheckInteractions}
          loading={loading}
          disabled={selectedMedications.length < 2}
          fullWidth
          size="large"
          icon="shield-check"
          iconPosition="left"
          style={styles.checkButton}
        />
      )}
    </>
  );

  /**
   * Render results view
   */
  const renderResultsView = () => (
    <>
      {/* Results Header */}
      <Card style={styles.resultsHeader}>
        <View style={styles.resultsHeaderContent}>
          <MaterialCommunityIcons
            name={results?.hasInteractions ? 'alert-circle' : 'check-circle'}
            size={48}
            color={results?.hasInteractions ? COLORS.warning : COLORS.success}
          />
          <View style={styles.resultsHeaderText}>
            <Text style={styles.resultsTitle}>
              {results?.hasInteractions
                ? 'Interactions Found'
                : 'No Interactions Found'}
            </Text>
            <Text style={styles.resultsSubtitle}>
              Checked {selectedMedications.length} medications
            </Text>
          </View>
        </View>
        
        {results?.summary && (
          <Text style={styles.resultsSummary}>{results.summary}</Text>
        )}
      </Card>

      {/* Interactions List */}
      {results?.interactions && results.interactions.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Interaction Details ({results.interactions.length})
          </Text>
          {results.interactions.map((interaction, index) => (
            <InteractionAlert
              key={index}
              interaction={interaction}
              expanded={expandedIndex === index}
              onPress={() => setExpandedIndex(
                expandedIndex === index ? null : index
              )}
            />
          ))}
        </>
      )}

      {/* Checked Medications */}
      <Text style={styles.sectionTitle}>Medications Checked</Text>
      <View style={styles.checkedMedicationsGrid}>
        {selectedMedications.map((med) => (
          <View key={med.id} style={styles.checkedMedChip}>
            <MaterialCommunityIcons
              name="pill"
              size={14}
              color={COLORS.primary}
            />
            <Text style={styles.checkedMedText}>{med.name}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.resultsActions}>
        <Button
          title="Check Different Medications"
          onPress={handleClearSelection}
          variant="outline"
          fullWidth
          icon="arrow-left"
          style={styles.backButton}
        />
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <MaterialCommunityIcons
          name="information"
          size={16}
          color={COLORS.textTertiary}
        />
        <Text style={styles.disclaimerText}>
          This information is AI-generated and for educational purposes only.
          Always consult your healthcare provider or pharmacist about potential drug interactions.
        </Text>
      </View>
    </>
  );

  /**
   * Render history view
   */
  const renderHistoryView = () => (
    <>
      <Text style={styles.sectionTitle}>Recent Checks</Text>
      {interactionHistory.length === 0 ? (
        <EmptyState
          icon="history"
          title="No History Yet"
          description="Your interaction check history will appear here"
        />
      ) : (
        interactionHistory.slice(0, 10).map((item, index) => (
          <Card
            key={item.id || index}
            style={styles.historyCard}
            onPress={() => {
              setResults(item);
              setSelectedMedications(
                activeMedications.filter((m) =>
                  item.medicationsChecked?.includes(m.name)
                )
              );
              setViewMode('results');
            }}
          >
            <View style={styles.historyHeader}>
              <MaterialCommunityIcons
                name={item.hasInteractions ? 'alert-circle' : 'check-circle'}
                size={24}
                color={item.hasInteractions ? COLORS.warning : COLORS.success}
              />
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>
                  {item.medicationsChecked?.join(', ') || 'Interaction Check'}
                </Text>
                <Text style={styles.historyDate}>
                  {new Date(item.checkedAt).toLocaleDateString()}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={COLORS.textTertiary}
              />
            </View>
          </Card>
        ))
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Interaction Checker"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      
      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode !== 'history' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode(results ? 'results' : 'select')}
        >
          <Text style={[
            styles.toggleText,
            viewMode !== 'history' && styles.toggleTextActive,
          ]}>
            Check
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'history' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('history')}
        >
          <Text style={[
            styles.toggleText,
            viewMode === 'history' && styles.toggleTextActive,
          ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <LoadingSpinner
            message="Checking for interactions..."
          />
        ) : viewMode === 'history' ? (
          renderHistoryView()
        ) : viewMode === 'results' && results ? (
          renderResultsView()
        ) : (
          renderSelectionView()
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
  },
  
  // View toggle
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    ...SHADOWS.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.base,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  
  // Selection styles
  selectionHeader: {
    marginBottom: SPACING.md,
  },
  selectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLink: {
    padding: SPACING.xs,
  },
  actionLinkText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  actionDivider: {
    color: COLORS.textTertiary,
    marginHorizontal: SPACING.sm,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  selectedBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.sm,
  },
  
  // Medication selection item
  medicationSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  medicationSelectItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  checkboxContainer: {
    padding: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  medicationCardInSelect: {
    flex: 1,
    marginBottom: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Check button
  checkButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  
  // Results styles
  resultsHeader: {
    marginBottom: SPACING.lg,
  },
  resultsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  resultsHeaderText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  resultsTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  resultsSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  resultsSummary: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  
  // Section title
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  
  // Checked medications
  checkedMedicationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  checkedMedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  checkedMedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  
  // Results actions
  resultsActions: {
    marginTop: SPACING.xl,
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  
  // History styles
  historyCard: {
    marginBottom: SPACING.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  historyTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  historyDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  
  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
  },
  disclaimerText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    marginLeft: SPACING.sm,
    lineHeight: TYPOGRAPHY.fontSize.xs * TYPOGRAPHY.lineHeight.relaxed,
  },
});

export default InteractionCheckerScreen;
