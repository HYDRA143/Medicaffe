/**
 * Input Component
 * 
 * A customizable text input component with label, error handling, and icons.
 * Supports various input types and states.
 * 🎨 Now with theme support!
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/theme';

const Input = ({
  label,
  emoji,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  maxLength,
  style,
  inputStyle,
  containerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useApp();

  // Handle password visibility toggle
  const isPassword = secureTextEntry;
  const shouldHideText = isPassword && !showPassword;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={[
          styles.label, 
          { color: error ? colors.danger : colors.textSecondary }
        ]}>
          {emoji && <Text>{emoji} </Text>}{label}
        </Text>
      )}

      {/* Input container */}
      <View
        style={[
          styles.inputContainer,
          { 
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : isFocused ? colors.primary : colors.border,
          },
          isFocused && { backgroundColor: colors.background },
          error && { backgroundColor: colors.dangerLight },
          !editable && { backgroundColor: colors.background, borderColor: colors.borderLight },
          multiline && styles.inputContainerMultiline,
          style,
        ]}
      >
        {/* Left icon */}
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={error ? colors.danger : isFocused ? colors.primary : colors.textTertiary}
            style={styles.leftIcon}
          />
        )}

        {/* Text input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={shouldHideText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: editable ? colors.textPrimary : colors.textDisabled },
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
        />

        {/* Right icon - either custom or password toggle */}
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIconButton}
          >
            <Text style={styles.passwordToggle}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconButton}
            disabled={!onRightIconPress}
          >
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Error or helper text */}
      {(error || helperText) && (
        <Text style={[
          styles.helperText, 
          { color: error ? colors.danger : colors.textTertiary }
        ]}>
          {error ? '⚠️ ' : '💡 '}{error || helperText}
        </Text>
      )}

      {/* Character count for maxLength */}
      {maxLength && (
        <Text style={[styles.charCount, { color: colors.textTertiary }]}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.sm,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    minHeight: 100,
  },
  
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    paddingVertical: SPACING.md,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIconButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  passwordToggle: {
    fontSize: 18,
  },
  
  helperText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
  
  charCount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
});

export default Input;
