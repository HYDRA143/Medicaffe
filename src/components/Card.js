/**
 * Card Component
 * 
 * A flexible card container with shadow, padding, and optional press handling.
 * Used throughout the app for consistent card-based layouts.
 * Supports light and dark themes.
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import { useApp } from '../context/AppContext';

const Card = ({
  children,
  onPress,
  style,
  variant = 'default', // default, elevated, outlined, flat
  padding = 'medium', // none, small, medium, large
  disabled = false,
}) => {
  const { colors } = useApp();

  // Determine card variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return { ...styles.elevated, backgroundColor: colors.surface };
      case 'outlined':
        return { ...styles.outlined, backgroundColor: colors.surface, borderColor: colors.border };
      case 'flat':
        return { backgroundColor: colors.background };
      default:
        return { ...styles.default, backgroundColor: colors.surface };
    }
  };

  // Determine padding styles
  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return styles.paddingNone;
      case 'small':
        return styles.paddingSmall;
      case 'large':
        return styles.paddingLarge;
      default:
        return styles.paddingMedium;
    }
  };

  const cardStyles = [
    styles.base,
    getVariantStyles(),
    getPaddingStyles(),
    disabled && styles.disabled,
    style,
  ];

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={cardStyles}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  
  // Variant styles
  default: {
    ...SHADOWS.base,
  },
  elevated: {
    ...SHADOWS.md,
  },
  outlined: {
    borderWidth: 1,
  },
  
  // Padding styles
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: SPACING.md,
  },
  paddingMedium: {
    padding: SPACING.base,
  },
  paddingLarge: {
    padding: SPACING.xl,
  },
  
  // State styles
  disabled: {
    opacity: 0.6,
  },
});

export default Card;
