/**
 * Medication Detail Screen
 * 
 * Displays detailed information about a specific medication.
 * Shows AI-generated medication info, usage tips, and management options.
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
import { Header, Button, Card, LoadingSpinner } from '../components';
import { useApp } from '../context/AppContext';
import { useAI } from '../hooks';

const MedicationDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { medication } = route.params;
  const { updateMedication, deleteMedication } = useApp();
  const { fetchMedicationInfo, loading: aiLoading, error: aiError } = useAI();
  
  const [medicationInfo, setMedicationInfo] = useState(null);
  const [isActive, setIsActive] = useState(medication.isActive !== false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch AI-powered medication info on mount
  useEffect(() => {
    loadMedicationInfo();
  }, []);

  /**
   * Load AI-powered medication information
   */
  const loadMedicationInfo = async () => {
    try {
      const info = await fetchMedicationInfo(medication);
      setMedicationInfo(info);
    } catch (error) {
      console.log('[MedicationDetail] Failed to load AI info:', error);
    }
  };

  /**
   * Toggle medication active status
   */
  const handleToggleActive = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    
    await updateMedication(medication.id, { isActive: newStatus });
    
    Alert.alert(
      'Status Updated',
      `${medication.name} is now ${newStatus ? 'active' : 'inactive'}.`
    );
  };

  /**
   * Delete medication
   */
  const handleDelete = () => {
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to delete ${medication.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMedication(medication.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  /**
   * Format frequency for display
   */
  const formatFrequency = (freq) => {
    const frequencyMap = {
      once_daily: 'Once daily',
      twice_daily: 'Twice daily',
      three_times_daily: 'Three times daily',
      four_times_daily: 'Four times daily',
      every_4_hours: 'Every 4 hours',
      every_6_hours: 'Every 6 hours',
      every_8_hours: 'Every 8 hours',
      every_12_hours: 'Every 12 hours',
      once_weekly: 'Once weekly',
      as_needed: 'As needed',
    };
    return frequencyMap[freq] || freq;
  };

  /**
   * Format timing for display
   */
  const formatTiming = (time) => {
    const timingMap = {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      bedtime: 'Bedtime',
      with_breakfast: 'With breakfast',
      with_lunch: 'With lunch',
      with_dinner: 'With dinner',
      before_meals: 'Before meals',
      after_meals: 'After meals',
      empty_stomach: 'Empty stomach',
    };
    return timingMap[time] || time;
  };

  /**
   * Render info section
   */
  const renderInfoSection = (title, content, icon) => {
    if (!content) return null;
    
    const items = Array.isArray(content) ? content : [content];
    
    return (
      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.infoTitle}>{title}</Text>
        </View>
        {items.map((item, index) => (
          <Text key={index} style={styles.infoText}>
            {Array.isArray(content) ? `• ${item}` : item}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Medication Details"
        showBack
        onBackPress={() => navigation.goBack()}
        rightIcon="dots-vertical"
        onRightPress={() => {
          Alert.alert(
            'Options',
            '',
            [
              {
                text: 'Edit',
                onPress: () => navigation.navigate('AddMedication', { medication }),
              },
              {
                text: isActive ? 'Mark as Inactive' : 'Mark as Active',
                onPress: handleToggleActive,
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: handleDelete,
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Medication Header Card */}
        <Card style={styles.headerCard} variant="elevated">
          <View style={styles.headerContent}>
            <View style={styles.medicationIcon}>
              <MaterialCommunityIcons
                name="pill"
                size={40}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.medicationDosage}>
                {medication.dosage} {medication.unit} · {medication.form}
              </Text>
              {!isActive && (
                <View style={styles.inactiveBadge}>
                  <Text style={styles.inactiveBadgeText}>Inactive</Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Schedule Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Schedule</Text>
          
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={COLORS.primary}
              />
              <View style={styles.scheduleText}>
                <Text style={styles.scheduleLabel}>Frequency</Text>
                <Text style={styles.scheduleValue}>
                  {formatFrequency(medication.frequency)}
                </Text>
              </View>
            </View>
            
            {medication.timing && (
              <View style={styles.scheduleItem}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={24}
                  color={COLORS.primary}
                />
                <View style={styles.scheduleText}>
                  <Text style={styles.scheduleLabel}>Timing</Text>
                  <Text style={styles.scheduleValue}>
                    {formatTiming(medication.timing)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* AI-Powered Information */}
        <Card style={styles.card}>
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons
              name="robot"
              size={24}
              color={COLORS.secondary}
            />
            <Text style={styles.aiTitle}>AI-Powered Information</Text>
            <TouchableOpacity
              onPress={loadMedicationInfo}
              disabled={aiLoading}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={aiLoading ? COLORS.textDisabled : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          
          {aiLoading ? (
            <LoadingSpinner message="Loading medication info..." />
          ) : aiError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Failed to load medication information.
              </Text>
              <Button
                title="Retry"
                onPress={loadMedicationInfo}
                variant="outline"
                size="small"
              />
            </View>
          ) : medicationInfo ? (
            <>
              {medicationInfo.genericName && (
                renderInfoSection('Generic Name', medicationInfo.genericName, 'tag')
              )}
              
              {medicationInfo.drugClass && (
                renderInfoSection('Drug Class', medicationInfo.drugClass, 'folder-medical')
              )}
              
              {renderInfoSection(
                'Common Uses',
                medicationInfo.commonUses,
                'medical-bag'
              )}
              
              {medicationInfo.howItWorks && (
                renderInfoSection('How It Works', medicationInfo.howItWorks, 'brain')
              )}
              
              {renderInfoSection(
                'Common Side Effects',
                medicationInfo.commonSideEffects,
                'alert-circle-outline'
              )}
              
              {renderInfoSection(
                'Serious Side Effects',
                medicationInfo.seriousSideEffects,
                'alert'
              )}
              
              {renderInfoSection(
                'Precautions',
                medicationInfo.precautions,
                'shield-alert'
              )}
              
              {renderInfoSection(
                'Food Interactions',
                medicationInfo.foodInteractions,
                'food-apple'
              )}
              
              {medicationInfo.storageInstructions && (
                renderInfoSection(
                  'Storage',
                  medicationInfo.storageInstructions,
                  'package-variant'
                )
              )}
              
              {medicationInfo.missedDoseGuidance && (
                renderInfoSection(
                  'Missed Dose',
                  medicationInfo.missedDoseGuidance,
                  'clock-alert'
                )
              )}
            </>
          ) : (
            <View style={styles.emptyInfo}>
              <Text style={styles.emptyInfoText}>
                Tap refresh to load AI-powered medication information.
              </Text>
            </View>
          )}
        </Card>

        {/* Notes Card */}
        {medication.notes && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Your Notes</Text>
            <Text style={styles.notesText}>{medication.notes}</Text>
          </Card>
        )}

        {/* Prescribed By */}
        {medication.prescribedBy && (
          <Card style={styles.card}>
            <View style={styles.prescribedRow}>
              <MaterialCommunityIcons
                name="doctor"
                size={24}
                color={COLORS.primary}
              />
              <View style={styles.prescribedText}>
                <Text style={styles.prescribedLabel}>Prescribed By</Text>
                <Text style={styles.prescribedValue}>{medication.prescribedBy}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Check Interactions"
            onPress={() => navigation.navigate('InteractionChecker', { preselectedMed: medication })}
            variant="primary"
            icon="shield-check"
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title={isActive ? 'Mark as Inactive' : 'Mark as Active'}
            onPress={handleToggleActive}
            variant="outline"
            icon={isActive ? 'pause-circle' : 'play-circle'}
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="Delete Medication"
            onPress={handleDelete}
            variant="ghost"
            icon="delete"
            fullWidth
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
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
            Always consult your healthcare provider for medical advice.
          </Text>
        </View>
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
  
  // Header card
  headerCard: {
    marginBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  medicationName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  inactiveBadge: {
    backgroundColor: COLORS.textTertiary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  inactiveBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  
  // Card styles
  card: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  
  // Schedule styles
  scheduleRow: {
    flexDirection: 'row',
  },
  scheduleItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    marginLeft: SPACING.sm,
  },
  scheduleLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
  scheduleValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  
  // AI info styles
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  aiTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.secondary,
    marginLeft: SPACING.sm,
  },
  infoSection: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.relaxed,
    marginLeft: SPACING.xl + SPACING.sm,
  },
  
  // Error and empty states
  errorContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyInfo: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyInfoText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  
  // Notes
  notesText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    fontStyle: 'italic',
  },
  
  // Prescribed by
  prescribedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prescribedText: {
    marginLeft: SPACING.md,
  },
  prescribedLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
  prescribedValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  
  // Actions
  actionsContainer: {
    marginTop: SPACING.md,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  deleteButton: {
    marginTop: SPACING.md,
  },
  deleteButtonText: {
    color: COLORS.danger,
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

export default MedicationDetailScreen;
