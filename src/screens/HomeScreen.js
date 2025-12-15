/**
 * Home Screen
 * 
 * Main dashboard displaying medication overview, quick actions,
 * and recent interaction alerts with emojis and theme support.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, EMOJIS } from '../styles/theme';
import { QUICK_ACTIONS, GREETINGS, STAT_LABELS, EMPTY_STATES } from '../utils/constants';
import {
  Card,
  MedicationCard,
  InteractionAlert,
  EmptyState,
  LoadingSpinner,
} from '../components';
import { useApp } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    userProfile,
    activeMedications,
    interactionHistory,
    isLoading,
    refreshInteractionHistory,
    colors,
    isDarkMode,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [bounceAnim] = useState(new Animated.Value(1));

  // Get greeting based on time of day with emoji
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return GREETINGS.morning;
    if (hour < 17) return GREETINGS.afternoon;
    if (hour < 21) return GREETINGS.evening;
    return GREETINGS.night;
  };

  const greeting = getGreeting();

  // Get recent interactions with warnings
  const recentWarnings = interactionHistory
    .filter((item) => item.hasInteractions)
    .slice(0, 3);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshInteractionHistory();
    setRefreshing(false);
  }, [refreshInteractionHistory]);

  /**
   * Navigate to quick action screen with bounce animation
   */
  const handleQuickAction = (action) => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    navigation.navigate(action.screen);
  };

  /**
   * Navigate to medication detail
   */
  const handleMedicationPress = (medication) => {
    navigation.navigate('MedicationDetail', { medication });
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    greeting: { color: colors.textSecondary },
    userName: { color: colors.textPrimary },
    statValue: { color: colors.primary },
    statLabel: { color: colors.textSecondary },
    sectionTitle: { color: colors.textPrimary },
    seeAllText: { color: colors.primary },
    quickActionCard: { backgroundColor: colors.surface },
    quickActionText: { color: colors.textPrimary },
    viewAllButton: { backgroundColor: colors.primarySoft },
    viewAllText: { color: colors.primary },
    promoTitle: { color: colors.textPrimary },
    promoDescription: { color: colors.textSecondary },
  };

  if (isLoading) {
    return <LoadingSpinner message={`${EMOJIS.pill} Loading your medications...`} />;
  }

  return (
    <ScrollView
      style={[styles.container, dynamicStyles.container]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + 100 },
      ]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, dynamicStyles.greeting]}>
            {greeting.emoji} {greeting.text}
          </Text>
          <Text style={[styles.userName, dynamicStyles.userName]}>
            {userProfile?.name || '👋 Welcome'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.profileIconBg, { backgroundColor: colors.primarySoft }]}>
            <Text style={styles.profileEmoji}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Stats Card */}
      <Card style={styles.statsCard} variant="elevated">
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>{STAT_LABELS.medications.emoji}</Text>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{activeMedications.length}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{STAT_LABELS.medications.label}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>{STAT_LABELS.alerts.emoji}</Text>
            <Text style={[styles.statValue, recentWarnings.length > 0 && { color: colors.warning }]}>
              {recentWarnings.length}
            </Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{STAT_LABELS.alerts.label}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>{STAT_LABELS.checks.emoji}</Text>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{interactionHistory.length}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{STAT_LABELS.checks.label}</Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>⚡ Quick Actions</Text>
      <View style={styles.quickActionsContainer}>
        {QUICK_ACTIONS.map((action) => (
          <Animated.View key={action.id} style={{ transform: [{ scale: bounceAnim }] }}>
            <TouchableOpacity
              style={[styles.quickActionCard, dynamicStyles.quickActionCard]}
              onPress={() => handleQuickAction(action)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
              </View>
              <Text style={[styles.quickActionText, dynamicStyles.quickActionText]}>{action.title}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Recent Interaction Alerts */}
      {recentWarnings.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>🔔 Recent Alerts</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('InteractionChecker')}
            >
              <Text style={[styles.seeAllText, dynamicStyles.seeAllText]}>See All →</Text>
            </TouchableOpacity>
          </View>
          {recentWarnings.map((interaction, index) => (
            <InteractionAlert
              key={interaction.id || index}
              interaction={{
                severity: interaction.interactions?.[0]?.severity || 'moderate',
                medications: interaction.medicationsChecked || [],
                description: interaction.summary,
              }}
              onPress={() => navigation.navigate('InteractionChecker')}
            />
          ))}
        </>
      )}

      {/* My Medications Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>💊 My Medications</Text>
        {activeMedications.length > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddMedication')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>➕</Text>
          </TouchableOpacity>
        )}
      </View>

      {activeMedications.length === 0 ? (
        <EmptyState
          icon="pill"
          emoji={EMPTY_STATES.medications.emoji}
          title={EMPTY_STATES.medications.title}
          description={EMPTY_STATES.medications.description}
          actionLabel={EMPTY_STATES.medications.action}
          onAction={() => navigation.navigate('AddMedication')}
        />
      ) : (
        <>
          {activeMedications.slice(0, 5).map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onPress={() => handleMedicationPress(medication)}
              showInteractionWarning={true}
              interactionCount={0}
            />
          ))}
          {activeMedications.length > 5 && (
            <TouchableOpacity
              style={[styles.viewAllButton, dynamicStyles.viewAllButton]}
              onPress={() => navigation.navigate('AllMedications')}
            >
              <Text style={[styles.viewAllText, dynamicStyles.viewAllText]}>
                📋 View All {activeMedications.length} Medications
              </Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* AI Assistant Promo Card */}
      <Card
        style={styles.promoCard}
        variant="outlined"
        onPress={() => navigation.navigate('AIAssistant')}
      >
        <View style={styles.promoContent}>
          <View style={[styles.promoIconContainer, { backgroundColor: colors.secondaryLight + '20' }]}>
            <Text style={styles.promoEmoji}>🤖</Text>
          </View>
          <View style={styles.promoText}>
            <Text style={[styles.promoTitle, dynamicStyles.promoTitle]}>✨ Ask AI Assistant</Text>
            <Text style={[styles.promoDescription, dynamicStyles.promoDescription]}>
              Have questions about your medications? Ask our AI for help!
            </Text>
          </View>
          <Text style={styles.promoArrow}>→</Text>
        </View>
      </Card>

      {/* Theme Toggle Hint */}
      <TouchableOpacity
        style={[styles.themeHint, { backgroundColor: colors.cardAccent }]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={[styles.themeHintText, { color: colors.textSecondary }]}>
          {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark Mode' : 'Light Mode'} • Tap Profile to change
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.base,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.base,
    marginBottom: 4,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  profileIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 24,
  },
  
  // Stats card
  statsCard: {
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
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
  statDivider: {
    width: 1,
    height: 50,
  },
  
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
  },
  
  // Quick actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.sm,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: 'center',
  },
  
  // View all button
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  viewAllText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  viewAllArrow: {
    fontSize: 16,
    marginLeft: SPACING.sm,
  },
  
  // Promo card
  promoCard: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoEmoji: {
    fontSize: 28,
  },
  promoText: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  promoTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
  },
  promoArrow: {
    fontSize: 20,
  },
  
  // Theme hint
  themeHint: {
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.xl,
  },
  themeHintText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
});

export default HomeScreen;
