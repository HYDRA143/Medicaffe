/**
 * Button Component
 * 
 * A customizable button component with multiple variants, sizes, and states.
 * Supports loading state, disabled state, and icon integration.
 * 🎨 Now with theme support!
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/theme';

// Button emojis for visual feedback
const BUTTON_EMOJIS = {
  primary: '✨',
  secondary: '🌟',
  danger: '⚠️',
  success: '✅',
  ghost: '👻',
};

const Button = ({
  title,
  emoji,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'medium', // small, medium, large
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors } = useApp();
  
  // Determine button styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: colors.secondary },
          text: { color: colors.textLight },
          iconColor: colors.textLight,
        };
      case 'outline':
        return {
          container: { 
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
          iconColor: colors.primary,
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: colors.primary },
          iconColor: colors.primary,
        };
      case 'danger':
        return {
          container: { backgroundColor: colors.danger },
          text: { color: colors.textLight },
          iconColor: colors.textLight,
        };
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: colors.textLight },
          iconColor: colors.textLight,
        };
    }
  };

  // Determine button size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText,
          emoji: styles.smallEmoji,
          iconSize: 16,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText,
          emoji: styles.largeEmoji,
          iconSize: 24,
        };
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
          emoji: styles.mediumEmoji,
          iconSize: 20,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <MaterialCommunityIcons
        name={icon}
        size={sizeStyles.iconSize}
        color={isDisabled ? colors.textDisabled : variantStyles.iconColor}
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.baseContainer,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && { backgroundColor: colors.border },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textLight}
        />
      ) : (
        <View style={styles.contentContainer}>
          {emoji && <Text style={[styles.emoji, sizeStyles.emoji]}>{emoji}</Text>}
          {icon && iconPosition === 'left' && renderIcon()}
          <Text
            style={[
              styles.baseText,
              variantStyles.text,
              sizeStyles.text,
              isDisabled && { color: colors.textDisabled },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  emoji: {
    marginRight: SPACING.sm,
  },
  
  // Size styles
  smallContainer: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 36,
  },
  smallText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  smallEmoji: {
    fontSize: 14,
  },
  mediumContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 48,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  mediumEmoji: {
    fontSize: 16,
  },
  largeContainer: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    minHeight: 56,
  },
  largeText: {
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  largeEmoji: {
    fontSize: 20,
  },
  
  // State styles
  fullWidth: {
    width: '100%',
  },
  
  // Icon styles
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});

export default Button;
