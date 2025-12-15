/**
 * InteractionAlert Component
 * 
 * Displays drug interaction warnings with severity levels.
 * Shows affected medications and recommendations.
 * 🎨 Now with theme support and emojis!
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/theme';
import { INTERACTION_SEVERITY } from '../utils/constants';

// Severity emojis
const SEVERITY_EMOJIS = {
  low: '✅',
  minor: 'ℹ️',
  moderate: '⚠️',
  severe: '🚨',
  high: '🔴',
};

const InteractionAlert = ({
  interaction,
  onPress,
  expanded = false,
  style,
}) => {
  const { colors } = useApp();
  
  const {
    severity = 'moderate',
    medications = [],
    description,
    recommendation,
  } = interaction;

  // Get severity configuration
  const severityConfig = INTERACTION_SEVERITY[severity.toUpperCase()] || INTERACTION_SEVERITY.MODERATE;
  const severityEmoji = SEVERITY_EMOJIS[severity.toLowerCase()] || '⚠️';
  
  // Get colors based on severity
  const getSeverityColors = () => {
    switch (severityConfig.color) {
      case 'success':
        return {
          background: colors.successLight,
          border: colors.success,
          text: colors.success,
        };
      case 'info':
        return {
          background: colors.infoLight,
          border: colors.info,
          text: colors.info,
        };
      case 'warning':
        return {
          background: colors.warningLight,
          border: colors.warning,
          text: colors.warning,
        };
      case 'danger':
        return {
          background: colors.dangerLight,
          border: colors.danger,
          text: colors.danger,
        };
      default:
        return {
          background: colors.warningLight,
          border: colors.warning,
          text: colors.warning,
        };
    }
  };

  const severityColors = getSeverityColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.container,
        {
          backgroundColor: severityColors.background,
          borderLeftColor: severityColors.border,
        },
        style,
      ]}
    >
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.severityEmoji}>{severityEmoji}</Text>
        <View style={styles.headerContent}>
          <Text style={[styles.severityLabel, { color: severityColors.text }]}>
            {severityConfig.label}
          </Text>
          {medications.length > 0 && (
            <Text style={[styles.medicationNames, { color: colors.textSecondary }]} numberOfLines={1}>
              💊 {medications.join(' + ')}
            </Text>
          )}
        </View>
        {onPress && (
          <Text style={[styles.expandIcon, { color: colors.textTertiary }]}>
            {expanded ? '⬆️' : '⬇️'}
          </Text>
        )}
      </View>

      {/* Description - always visible */}
      {description && (
        <Text 
          style={[styles.description, { color: colors.textPrimary }]} 
          numberOfLines={expanded ? undefined : 2}
        >
          {description}
        </Text>
      )}

      {/* Expanded content */}
      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: colors.border }]}>
          {/* Severity explanation */}
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>ℹ️</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {severityConfig.description}
            </Text>
          </View>

          {/* Recommendation */}
          {recommendation && (
            <View style={[styles.recommendationBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.recommendationLabel, { color: colors.textSecondary }]}>
                💡 Recommendation:
              </Text>
              <Text style={[styles.recommendationText, { color: colors.textPrimary }]}>
                {recommendation}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    padding: SPACING.base,
    marginBottom: SPACING.md,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityEmoji: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  severityLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  medicationNames: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 16,
  },
  
  description: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
    marginTop: SPACING.md,
  },
  
  expandedContent: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
  },
  
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  infoEmoji: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginLeft: SPACING.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
  },
  
  recommendationBox: {
    borderRadius: BORDER_RADIUS.base,
    padding: SPACING.md,
  },
  recommendationLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  recommendationText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
  },
});

export default InteractionAlert;
