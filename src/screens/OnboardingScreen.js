/**
 * Onboarding Screen
 * 
 * Introduces the app to new users with animated slides and collects
 * basic profile information for personalization.
 * 🎨 Now with theme support and emojis!
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/theme';
import { ONBOARDING_SLIDES, DISCLAIMER } from '../utils/constants';
import { Button, Input, Card } from '../components';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { updateUserProfile, completeOnboarding, colors } = useApp();
  
  // Current slide index
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Profile form state (shown on last slide)
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    healthConditions: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation values
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  /**
   * Handle slide change
   */
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  /**
   * Navigate to next slide
   */
  const goToNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Last slide - show profile form
      setShowProfileForm(true);
    }
  };

  /**
   * Skip onboarding
   */
  const handleSkip = () => {
    setShowProfileForm(true);
  };

  /**
   * Validate profile form
   */
  const validateProfile = () => {
    const errors = {};
    
    if (!profile.name.trim()) {
      errors.name = 'Please enter your name';
    }
    
    if (profile.age && (isNaN(profile.age) || profile.age < 1 || profile.age > 150)) {
      errors.age = 'Please enter a valid age';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Complete onboarding and save profile
   */
  const handleComplete = async () => {
    if (!validateProfile()) return;
    
    setIsSubmitting(true);
    
    try {
      // Save profile if user entered data
      if (profile.name.trim()) {
        await updateUserProfile({
          name: profile.name.trim(),
          age: profile.age ? parseInt(profile.age) : null,
          healthConditions: profile.healthConditions.trim() || null,
          createdAt: new Date().toISOString(),
        });
      }
      
      // Mark onboarding as complete
      await completeOnboarding();
      
      // Navigation will be handled by AppNavigator detecting onboarding complete
    } catch (error) {
      console.error('[Onboarding] Error completing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Render a single onboarding slide
   */
  const renderSlide = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.slide,
          { transform: [{ scale }], opacity },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.slideEmoji}>{item.emoji}</Text>
        </View>
        
        <Text style={[styles.slideTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.slideDescription, { color: colors.textSecondary }]}>{item.description}</Text>
      </Animated.View>
    );
  };

  /**
   * Render pagination dots
   */
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: ONBOARDING_SLIDES[index].color,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Show profile form after slides
  if (showProfileForm) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.profileContainer,
            { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + SPACING.xl },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profileHeader}>
            <Text style={styles.profileEmoji}>👤</Text>
            <Text style={[styles.profileTitle, { color: colors.textPrimary }]}>
              Let's Get Started 🚀
            </Text>
            <Text style={[styles.profileSubtitle, { color: colors.textSecondary }]}>
              Tell us a bit about yourself to personalize your experience
            </Text>
          </View>

          <Card style={styles.formCard}>
            <Input
              label="Your Name"
              emoji="👤"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your name"
              error={formErrors.name}
              autoCapitalize="words"
            />

            <Input
              label="Age (Optional)"
              emoji="🎂"
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
              placeholder="Enter your age"
              keyboardType="numeric"
              error={formErrors.age}
            />

            <Input
              label="Health Conditions (Optional)"
              emoji="🏥"
              value={profile.healthConditions}
              onChangeText={(text) => setProfile({ ...profile, healthConditions: text })}
              placeholder="e.g., Diabetes, High Blood Pressure"
              multiline
              numberOfLines={3}
              helperText="This helps AI provide more relevant recommendations"
            />
          </Card>

          <View style={[styles.disclaimerBox, { backgroundColor: colors.infoLight }]}>
            <Text style={styles.infoEmoji}>ℹ️</Text>
            <Text style={[styles.disclaimerText, { color: colors.info }]}>
              {DISCLAIMER.short}
            </Text>
          </View>

          <Button
            title="Get Started"
            emoji="✨"
            onPress={handleComplete}
            loading={isSubmitting}
            fullWidth
            size="large"
            style={styles.completeButton}
          />

          <TouchableOpacity
            onPress={handleComplete}
            disabled={isSubmitting}
            style={styles.skipButton}
          >
            <Text style={[styles.skipButtonText, { color: colors.textTertiary }]}>
              Skip for now ⏭️
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Show onboarding slides
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Skip button */}
      <TouchableOpacity
        style={styles.skipContainer}
        onPress={handleSkip}
      >
        <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip ⏭️</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Next/Get Started button */}
      <View style={styles.bottomContainer}>
        <Button
          title={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started ✨' : 'Next →'}
          onPress={goToNext}
          fullWidth
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Skip button
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: SPACING.xl,
    zIndex: 10,
  },
  skipText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  
  // Slide styles
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['2xl'],
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING['2xl'],
  },
  slideEmoji: {
    fontSize: 72,
  },
  slideTitle: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  slideDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.relaxed,
    paddingHorizontal: SPACING.lg,
  },
  
  // Pagination
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  
  // Bottom button
  bottomContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  
  // Profile form styles
  profileContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  profileEmoji: {
    fontSize: 64,
  },
  profileTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  profileSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  formCard: {
    marginBottom: SPACING.lg,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
  },
  completeButton: {
    marginBottom: SPACING.md,
  },
  skipButton: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  skipButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
});

export default OnboardingScreen;
