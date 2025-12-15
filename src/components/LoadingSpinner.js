/**
 * LoadingSpinner Component
 * 
 * A customizable loading indicator with optional message.
 * Supports different sizes and can be overlaid or inline.
 * 🎨 Now with theme support and fun emojis!
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/theme';

// Fun loading emojis that rotate
const LOADING_EMOJIS = ['💊', '💉', '🩺', '🏥', '⚕️', '🔬', '🧪', '❤️'];

const LoadingSpinner = ({
  size = 'large', // small, large
  message,
  overlay = false,
  showEmoji = false,
  style,
}) => {
  const { colors } = useApp();
  const [emojiIndex, setEmojiIndex] = useState(0);

  // Rotate through emojis for fun loading animation
  useEffect(() => {
    if (showEmoji) {
      const interval = setInterval(() => {
        setEmojiIndex((prev) => (prev + 1) % LOADING_EMOJIS.length);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [showEmoji]);

  const content = (
    <View style={[styles.container, style]}>
      {showEmoji ? (
        <Text style={styles.loadingEmoji}>{LOADING_EMOJIS[emojiIndex]}</Text>
      ) : (
        <ActivityIndicator size={size} color={colors.primary} />
      )}
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );

  // If overlay mode, wrap in full-screen overlay
  if (overlay) {
    return (
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.overlayContent, { backgroundColor: colors.surface }]}>
          {content}
        </View>
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  
  loadingEmoji: {
    fontSize: 40,
  },
  
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  overlayContent: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    minWidth: 150,
    alignItems: 'center',
  },
});

export default LoadingSpinner;
