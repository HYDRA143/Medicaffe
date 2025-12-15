/**
 * EmptyState Component
 * 
 * Displays a friendly empty state with emoji, message, and optional action.
 * Used when lists are empty or no data is available.
 * Supports light and dark themes.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING } from '../styles/theme';
import { useApp } from '../context/AppContext';
import Button from './Button';

const EmptyState = ({
  icon = 'inbox-outline',
  emoji = '📭',
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors } = useApp();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      
      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING['3xl'],
  },
  
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  
  emoji: {
    fontSize: 40,
  },
  
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    marginBottom: SPACING.xl,
  },
  
  button: {
    marginTop: SPACING.md,
    minWidth: 180,
  },
});

export default EmptyState;
