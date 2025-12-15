/**
 * MedicationCard Component
 * 
 * Displays medication information in a card format.
 * Shows medication name, dosage, form, frequency, and timing.
 * Supports different states: active, inactive, warning.
 * Features emojis and theme support.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import { useApp } from '../context/AppContext';

// Emoji mapping for medication forms
const FORM_EMOJIS = {
  tablet: '💊',
  capsule: '💊',
  liquid: '🧪',
  injection: '💉',
  cream: '🧴',
  inhaler: '🌬️',
  drops: '💧',
  patch: '🩹',
  other: '🏥',
};

// Icon mapping for medication forms (fallback)
const FORM_ICONS = {
  tablet: 'pill',
  capsule: 'pill',
  liquid: 'flask-outline',
  injection: 'needle',
  cream: 'lotion-outline',
  inhaler: 'lungs',
  drops: 'water-outline',
  patch: 'bandage',
  other: 'medical-bag',
};

const MedicationCard = ({
  medication,
  onPress,
  onLongPress,
  showInteractionWarning = false,
  interactionCount = 0,
  compact = false,
  style,
}) => {
  const { colors } = useApp();
  
  const {
    name,
    dosage,
    unit,
    form,
    frequency,
    timing,
    notes,
    isActive = true,
  } = medication;

  // Get emoji for medication form
  const formEmoji = FORM_EMOJIS[form] || FORM_EMOJIS.other;
  const formIcon = FORM_ICONS[form] || FORM_ICONS.other;

  // Format frequency for display
  const formatFrequency = (freq) => {
    const frequencyMap = {
      once_daily: '☀️ Once daily',
      twice_daily: '🔄 Twice daily',
      three_times_daily: '🔄 3x daily',
      four_times_daily: '⏰ 4x daily',
      every_4_hours: '⏱️ Every 4h',
      every_6_hours: '⏱️ Every 6h',
      every_8_hours: '⏱️ Every 8h',
      every_12_hours: '⏱️ Every 12h',
      once_weekly: '📅 Weekly',
      as_needed: '📋 As needed',
    };
    return frequencyMap[freq] || freq;
  };

  // Format timing for display
  const formatTiming = (time) => {
    const timingMap = {
      morning: '🌅 Morning',
      afternoon: '☀️ Afternoon',
      evening: '🌆 Evening',
      bedtime: '🌙 Bedtime',
      with_breakfast: '🍳 With breakfast',
      with_lunch: '🥗 With lunch',
      with_dinner: '🍽️ With dinner',
      before_meals: '⏰ Before meals',
      after_meals: '🍴 After meals',
      empty_stomach: '🚫 Empty stomach',
    };
    return timingMap[time] || time;
  };

  if (compact) {
    // Compact version for lists and selection
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
        style={[
          styles.compactContainer,
          { backgroundColor: colors.surface },
          !isActive && [styles.inactiveContainer, { opacity: 0.6 }],
          style,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.formEmoji}>{formEmoji}</Text>
        </View>
        <View style={styles.compactContent}>
          <Text style={[styles.compactName, { color: colors.textPrimary }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.compactDosage, { color: colors.textSecondary }]}>
            {dosage} {unit}
          </Text>
        </View>
        {showInteractionWarning && interactionCount > 0 && (
          <View style={[styles.warningBadge, { backgroundColor: colors.warning }]}>
            <Text style={styles.warningEmoji}>⚠️</Text>
          </View>
        )}
        <Text style={[styles.chevron, { color: colors.textTertiary }]}>→</Text>
      </TouchableOpacity>
    );
  }

  // Full card version
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        !isActive && [styles.inactiveContainer, { opacity: 0.6 }],
        style,
      ]}
    >
      {/* Header row with icon and name */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.formEmoji}>{formEmoji}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.dosage, { color: colors.textSecondary }]}>
            {dosage} {unit} · {form}
          </Text>
        </View>
        
        {/* Interaction warning badge */}
        {showInteractionWarning && interactionCount > 0 && (
          <View style={styles.warningContainer}>
            <View style={[styles.warningBadge, { backgroundColor: colors.warning }]}>
              <Text style={styles.warningEmoji}>⚠️</Text>
              <Text style={[styles.warningCount, { color: colors.textLight }]}>{interactionCount}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Schedule info */}
      <View style={styles.scheduleRow}>
        <View style={[styles.scheduleItem, { backgroundColor: colors.cardAccent }]}>
          <Text style={[styles.scheduleText, { color: colors.textSecondary }]}>
            {formatFrequency(frequency)}
          </Text>
        </View>
        {timing && (
          <View style={[styles.scheduleItem, { backgroundColor: colors.cardAccent }]}>
            <Text style={[styles.scheduleText, { color: colors.textSecondary }]}>
              {formatTiming(timing)}
            </Text>
          </View>
        )}
      </View>

      {/* Notes preview if available */}
      {notes && (
        <Text style={[styles.notes, { color: colors.textTertiary }]} numberOfLines={2}>
          📝 {notes}
        </Text>
      )}

      {/* Inactive badge */}
      {!isActive && (
        <View style={[styles.inactiveBadge, { backgroundColor: colors.border }]}>
          <Text style={[styles.inactiveBadgeText, { color: colors.textTertiary }]}>💤 Inactive</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.base,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  inactiveContainer: {
    opacity: 0.6,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  formEmoji: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: 2,
  },
  dosage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  
  // Compact styles
  compactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  compactEmoji: {
    fontSize: 20,
  },
  compactContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  compactName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  compactDosage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 2,
  },
  
  // Schedule styles
  scheduleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.base,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  scheduleText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  
  // Notes styles
  notes: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  
  // Warning badge
  warningContainer: {
    marginLeft: SPACING.sm,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  warningEmoji: {
    fontSize: 12,
  },
  warningCount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginLeft: 4,
  },
  
  // Inactive badge
  inactiveBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  inactiveBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default MedicationCard;
