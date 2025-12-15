/**
 * Profile Screen
 * 
 * User profile management, settings, and app information.
 * Allows users to update their profile and manage app preferences.
 * 🎨 Now with theme support and emojis!
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import { DISCLAIMER } from '../utils/constants';
import { Header, Button, Input, Card } from '../components';
import { useApp } from '../context/AppContext';
import { clearAllData } from '../utils/storage';

// Profile menu emojis
const MENU_EMOJIS = {
  medications: '💊',
  interactions: '🛡️',
  assistant: '🤖',
  notifications: '🔔',
  about: 'ℹ️',
  privacy: '🔒',
  terms: '📋',
  danger: '⚠️',
};

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    userProfile,
    updateUserProfile,
    medications,
    activeMedications,
    interactionHistory,
    colors,
    isDarkMode,
    themeMode,
    setThemeMode,
  } = useApp();
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age?.toString() || '',
    healthConditions: userProfile?.healthConditions || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);

  /**
   * Save profile changes
   */
  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      await updateUserProfile({
        ...userProfile,
        name: editedProfile.name.trim(),
        age: editedProfile.age ? parseInt(editedProfile.age) : null,
        healthConditions: editedProfile.healthConditions.trim() || null,
      });
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditedProfile({
      name: userProfile?.name || '',
      age: userProfile?.age?.toString() || '',
      healthConditions: userProfile?.healthConditions || '',
    });
    setIsEditing(false);
  };

  /**
   * Clear all app data
   */
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your medications, interaction history, and profile data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            // Restart app logic would go here in production
            Alert.alert('Data Cleared', 'Please restart the app.');
          },
        },
      ]
    );
  };

  /**
   * Render menu item
   */
  const renderMenuItem = (emoji, title, subtitle, onPress, showArrow = true, rightComponent = null) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.borderLight }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.menuEmoji}>{emoji}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {rightComponent || (showArrow && (
        <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>→</Text>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Profile"
        emoji="👤"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarEmoji}>
                {userProfile?.name ? userProfile.name[0].toUpperCase() : '👤'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              {isEditing ? (
                <Input
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                  placeholder="Your name"
                  autoCapitalize="words"
                  containerStyle={styles.editInput}
                />
              ) : (
                <>
                  <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                    {userProfile?.name || 'Guest User'} 👋
                  </Text>
                  {userProfile?.age && (
                    <Text style={[styles.profileAge, { color: colors.textSecondary }]}>
                      🎂 {userProfile.age} years old
                    </Text>
                  )}
                </>
              )}
            </View>
            {!isEditing && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editEmoji}>✏️</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing && (
            <>
              <Input
                label="Age"
                value={editedProfile.age}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, age: text })}
                placeholder="Your age"
                keyboardType="numeric"
                containerStyle={styles.editInput}
              />
              <Input
                label="Health Conditions"
                value={editedProfile.healthConditions}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, healthConditions: text })}
                placeholder="e.g., Diabetes, High Blood Pressure"
                multiline
                numberOfLines={2}
                containerStyle={styles.editInput}
              />
              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  onPress={handleCancelEdit}
                  variant="outline"
                  style={styles.editActionButton}
                />
                <Button
                  title="Save"
                  onPress={handleSaveProfile}
                  loading={isSaving}
                  style={styles.editActionButton}
                />
              </View>
            </>
          )}
          
          {!isEditing && userProfile?.healthConditions && (
            <View style={[styles.healthConditions, { borderTopColor: colors.border }]}>
              <Text style={[styles.healthConditionsLabel, { color: colors.textSecondary }]}>
                🏥 Health Conditions:
              </Text>
              <Text style={[styles.healthConditionsText, { color: colors.textPrimary }]}>
                {userProfile.healthConditions}
              </Text>
            </View>
          )}
        </Card>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>📊 Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {medications.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                💊 Total{'\n'}Medications
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {activeMedications.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                ✅ Active{'\n'}Medications
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {interactionHistory.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                🔍 Interaction{'\n'}Checks
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.menuCard}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>⚡ Quick Actions</Text>
          {renderMenuItem(
            MENU_EMOJIS.medications,
            'My Medications',
            `${activeMedications.length} active medications`,
            () => navigation.navigate('Home')
          )}
          {renderMenuItem(
            MENU_EMOJIS.interactions,
            'Check Interactions',
            'Analyze your medications',
            () => navigation.navigate('InteractionChecker')
          )}
          {renderMenuItem(
            MENU_EMOJIS.assistant,
            'AI Assistant',
            'Ask medication questions',
            () => navigation.navigate('AIAssistant')
          )}
        </Card>

        {/* Settings */}
        <Card style={styles.menuCard}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>⚙️ Settings</Text>
          {renderMenuItem(
            MENU_EMOJIS.notifications,
            'Notifications',
            'Medication reminders',
            () => setNotifications(!notifications),
            false,
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notifications ? colors.primary : colors.textTertiary}
            />
          )}
          {renderMenuItem(
            isDarkMode ? '🌙' : '☀️',
            'Theme',
            `${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} mode`,
            () => {
              const modes = ['light', 'dark', 'system'];
              const currentIndex = modes.indexOf(themeMode);
              const nextMode = modes[(currentIndex + 1) % modes.length];
              setThemeMode(nextMode);
            },
            true
          )}
        </Card>

        {/* About */}
        <Card style={styles.menuCard}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>📱 About</Text>
          {renderMenuItem(
            MENU_EMOJIS.about,
            'About MediCaffe',
            'Version 1.0.0',
            () => Alert.alert('☕ MediCaffe', 'AI-Powered Medication Interaction Checker\n\nVersion 1.0.0\n\n💊 Stay safe with your medications!')
          )}
          {renderMenuItem(
            MENU_EMOJIS.privacy,
            'Privacy Policy',
            'How we handle your data',
            () => Alert.alert('🔒 Privacy', 'Your data is stored locally on your device. We do not collect or share personal information. Your health data stays with you! 🛡️')
          )}
          {renderMenuItem(
            MENU_EMOJIS.terms,
            'Terms of Service',
            'Usage guidelines',
            () => Alert.alert('📋 Terms', DISCLAIMER.full)
          )}
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.menuCard, styles.dangerCard, { borderColor: colors.danger + '30' }]}>
          <Text style={[styles.cardTitle, { color: colors.danger }]}>⚠️ Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerItem}
            onPress={handleClearData}
          >
            <Text style={styles.dangerEmoji}>🗑️</Text>
            <View style={styles.menuContent}>
              <Text style={[styles.dangerItemTitle, { color: colors.danger }]}>Clear All Data</Text>
              <Text style={[styles.dangerItemSubtitle, { color: colors.textSecondary }]}>
                Delete all medications and history
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerEmoji}>ℹ️</Text>
          <Text style={[styles.disclaimerText, { color: colors.textTertiary }]}>
            {DISCLAIMER.short}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
  },
  
  // Profile card
  profileCard: {
    marginBottom: SPACING.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarEmoji: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  profileAge: {
    fontSize: TYPOGRAPHY.fontSize.base,
    marginTop: 2,
  },
  editButton: {
    padding: SPACING.sm,
  },
  editEmoji: {
    fontSize: 20,
  },
  editInput: {
    marginBottom: SPACING.sm,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
  },
  editActionButton: {
    marginLeft: SPACING.sm,
    minWidth: 100,
  },
  healthConditions: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
  },
  healthConditionsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.xs,
  },
  healthConditionsText: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  
  // Stats card
  statsCard: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
  
  // Menu card
  menuCard: {
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuEmoji: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 16,
  },
  
  // Danger zone
  dangerCard: {
    borderWidth: 1,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  dangerEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  dangerItemTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  dangerItemSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 2,
  },
  
  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  disclaimerEmoji: {
    fontSize: 14,
    marginRight: SPACING.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.fontSize.xs * TYPOGRAPHY.lineHeight.relaxed,
  },
});

export default ProfileScreen;
