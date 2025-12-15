/**
 * Header Component
 * 
 * Reusable header component for screens with title, subtitle, and optional actions.
 * Supports back navigation and right action buttons.
 * 🎨 Now with theme support!
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { TYPOGRAPHY, SPACING } from '../styles/theme';

const Header = ({
  title,
  emoji,
  subtitle,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  rightComponent,
  variant = 'default', // default, transparent, colored
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useApp();

  // Determine header styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'transparent':
        return {
          container: { backgroundColor: 'transparent' },
          title: { color: colors.textPrimary },
          subtitle: { color: colors.textSecondary },
          iconColor: colors.textPrimary,
        };
      case 'colored':
        return {
          container: { backgroundColor: colors.primary },
          title: { color: colors.textLight },
          subtitle: { color: colors.textLight, opacity: 0.8 },
          iconColor: colors.textLight,
        };
      default:
        return {
          container: { backgroundColor: colors.background },
          title: { color: colors.textPrimary },
          subtitle: { color: colors.textSecondary },
          iconColor: colors.textPrimary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        variantStyles.container,
        { paddingTop: insets.top + SPACING.sm },
        style,
      ]}
    >
      <StatusBar
        barStyle={variant === 'colored' || isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={variant === 'colored' ? colors.primary : colors.background}
      />
      
      <View style={styles.contentRow}>
        {/* Left side - Back button */}
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.backEmoji, { color: variantStyles.iconColor }]}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center - Title */}
        <View style={styles.centerContainer}>
          <View style={styles.titleRow}>
            {emoji && <Text style={styles.titleEmoji}>{emoji}</Text>}
            <Text
              style={[styles.title, variantStyles.title]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          {subtitle && (
            <Text
              style={[styles.subtitle, variantStyles.subtitle]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side - Action button */}
        <View style={styles.rightContainer}>
          {rightComponent ? (
            rightComponent
          ) : rightIcon ? (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.rightButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={rightIcon}
                size={24}
                color={variantStyles.iconColor}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
  },
  
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  
  backButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  backEmoji: {
    fontSize: 24,
  },
  rightButton: {
    padding: SPACING.xs,
    marginRight: -SPACING.xs,
  },
  
  // Title styles
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleEmoji: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
  },
  
  // Subtitle styles
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default Header;
