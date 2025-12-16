import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getCheckIns, getUserProfile, clearAllData } from '../../utils/storage';
import { analyzeMoodPatterns } from '../../utils/aiService';

const { width } = Dimensions.get('window');

const palette = {
  background: '#05080f',
  card: '#0f1726',
  cardAlt: '#121e31',
  text: '#e6edf7',
  muted: '#98a8c4',
  accent: '#7ef0ff',
  accentWarm: '#ff7ab3',
  accentPurple: '#a78bfa',
  accentGreen: '#34d399',
  border: '#1d283a',
  glow: '#12314a',
};

// Animated Chatbot Logo Component
const ChatbotLogo = ({ size = 80, isLoading = false }: { size?: number; isLoading?: boolean }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const eyeBlinkAnim = useRef(new Animated.Value(1)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Eye blink animation
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(eyeBlinkAnim, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(eyeBlinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (isLoading) {
      // Talking animation when loading
      Animated.loop(
        Animated.sequence([
          Animated.timing(mouthAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(mouthAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotate animation when loading
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      mouthAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [isLoading]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const mouthHeight = mouthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [size * 0.08, size * 0.15],
  });

  return (
    <Animated.View style={[
      styles.logoContainer,
      { transform: [{ translateY: floatAnim }] }
    ]}>
      {/* Glow ring */}
      <Animated.View style={[
        styles.logoGlowRing,
        { 
          width: size + 30,
          height: size + 30,
          borderRadius: (size + 30) / 2,
          opacity: glowAnim,
          transform: isLoading ? [{ rotate }] : [],
        }
      ]} />
      
      {/* Main body */}
      <LinearGradient
        colors={[palette.accent, palette.accentPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.logoBody,
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
          }
        ]}
      >
        {/* Face container */}
        <View style={styles.logoFace}>
          {/* Eyes */}
          <View style={styles.logoEyeContainer}>
            <Animated.View style={[
              styles.logoEye,
              { 
                width: size * 0.18,
                height: size * 0.18,
                borderRadius: size * 0.09,
                transform: [{ scaleY: eyeBlinkAnim }],
              }
            ]}>
              <View style={[
                styles.logoEyeInner,
                { 
                  width: size * 0.08,
                  height: size * 0.08,
                  borderRadius: size * 0.04,
                }
              ]} />
              <View style={[
                styles.logoEyeShine,
                {
                  width: size * 0.04,
                  height: size * 0.04,
                  borderRadius: size * 0.02,
                }
              ]} />
            </Animated.View>
            <Animated.View style={[
              styles.logoEye,
              { 
                width: size * 0.18,
                height: size * 0.18,
                borderRadius: size * 0.09,
                transform: [{ scaleY: eyeBlinkAnim }],
              }
            ]}>
              <View style={[
                styles.logoEyeInner,
                { 
                  width: size * 0.08,
                  height: size * 0.08,
                  borderRadius: size * 0.04,
                }
              ]} />
              <View style={[
                styles.logoEyeShine,
                {
                  width: size * 0.04,
                  height: size * 0.04,
                  borderRadius: size * 0.02,
                }
              ]} />
            </Animated.View>
          </View>
          
          {/* Mouth */}
          <Animated.View style={[
            styles.logoMouth,
            {
              width: size * 0.3,
              height: mouthHeight,
              borderRadius: size * 0.08,
            }
          ]} />
        </View>
      </LinearGradient>
      
      {/* Antenna */}
      <View style={[styles.logoAntenna, { height: size * 0.2, top: -size * 0.15 }]}>
        <Animated.View style={[
          styles.logoAntennaTop,
          {
            width: size * 0.12,
            height: size * 0.12,
            borderRadius: size * 0.06,
            opacity: glowAnim,
          }
        ]} />
      </View>
      
      {/* Ear decorations */}
      <View style={[styles.logoEar, styles.logoEarLeft, { width: size * 0.08, height: size * 0.2 }]} />
      <View style={[styles.logoEar, styles.logoEarRight, { width: size * 0.08, height: size * 0.2 }]} />
    </Animated.View>
  );
};

// Animated Card Component
const AnimatedCard = ({ children, delay = 0, style }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      {children}
    </Animated.View>
  );
};

export default function InsightsScreen() {
  const router = useRouter();
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkInsCount, setCheckInsCount] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profile = await getUserProfile();
      setUserName(profile?.name || 'Friend');

      const checkIns = await getCheckIns();
      setCheckInsCount(checkIns.length);

      // Generate insights regardless of check-in count
      if (checkIns.length > 0) {
        await generateInsights(checkIns, profile?.name || 'Friend');
      } else {
        // Show default insights for new users
        setInsights('Welcome to your VelaMind journey. Begin with your first check-in so we can map your mood rhythm and tailor guidance to you. A minute of reflection each night sets the tone for tomorrow.');
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const generateInsights = async (checkIns: any, name: string) => {
    setIsLoading(true);
    try {
      const response = await analyzeMoodPatterns(checkIns, name);

      if (response.success) {
        setInsights(response.text);
      } else {
        setInsights('Your patterns are yours alone. Keep tracking your mood to unlock sharper, personalized guidance.');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Keep logging your daily check-ins to surface meaningful recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    const checkIns = await getCheckIns();
    if (checkIns.length > 0) {
      await generateInsights(checkIns, userName);
    } else {
      setInsights('Start your VelaMind journey by completing your first check-in today!');
    }
  };

  // Add new user function
  const handleAddNewUser = () => {
    Alert.alert(
      'Add New User',
      'This will create a new user profile. The current user data will be cleared. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add New User',
          style: 'default',
          onPress: async () => {
            try {
              await clearAllData();
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to switch user. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Chatbot Logo */}
      <AnimatedCard delay={0}>
        <LinearGradient
          colors={['rgba(126, 240, 255, 0.1)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Atlas AI</Text>
              <Text style={styles.headerSubtitle}>
                Your personal wellness companion
              </Text>
            </View>
          </View>
          <View style={styles.logoWrapper}>
            <ChatbotLogo size={100} isLoading={isLoading} />
          </View>
        </LinearGradient>
      </AnimatedCard>

      {/* Greeting */}
      <AnimatedCard delay={100} style={styles.greetingSection}>
        <Text style={styles.greetingText}>
          Hello, <Text style={styles.greetingName}>{userName}</Text>! 👋
        </Text>
        <Text style={styles.greetingSubtext}>
          Here's what your wellness data reveals
        </Text>
      </AnimatedCard>

      {/* AI Insights Card */}
      <AnimatedCard delay={200}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={palette.accent} />
              <Text style={styles.loadingText}>Analyzing your wellness patterns...</Text>
              <View style={styles.loadingDots}>
                <Text style={styles.loadingDot}>●</Text>
                <Text style={styles.loadingDot}>●</Text>
                <Text style={styles.loadingDot}>●</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.insightCard}>
            <LinearGradient
              colors={['rgba(126, 240, 255, 0.1)', 'rgba(167, 139, 250, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightGradient}
            >
              <View style={styles.insightHeader}>
                <View style={styles.insightTitleRow}>
                  <Text style={styles.insightIcon}>🤖</Text>
                  <Text style={styles.insightTitle}>AI Analysis</Text>
                </View>
                <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                  <Text style={styles.refreshIcon}>🔄</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.insightContent}>{insights}</Text>
            </LinearGradient>
          </View>
        )}
      </AnimatedCard>

      {/* Wellness Tips */}
      <AnimatedCard delay={300} style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Wellness Tips</Text>
        {tipsData.map((tip, index) => (
          <AnimatedCard key={index} delay={350 + index * 50}>
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Text style={styles.tipEmoji}>{tip.emoji}</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          </AnimatedCard>
        ))}
      </AnimatedCard>

      {/* Quick Facts */}
      <AnimatedCard delay={600} style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Quick Facts</Text>
        <View style={styles.factsContainer}>
          <View style={[styles.factBox, { borderColor: palette.accent }]}>
            <Text style={styles.factLabel}>💬</Text>
            <Text style={styles.factValue}>Journal</Text>
            <Text style={styles.factDesc}>Share regularly</Text>
          </View>
          <View style={[styles.factBox, { borderColor: palette.accentPurple }]}>
            <Text style={styles.factLabel}>📈</Text>
            <Text style={styles.factValue}>Track</Text>
            <Text style={styles.factDesc}>See patterns</Text>
          </View>
          <View style={[styles.factBox, { borderColor: palette.accentGreen }]}>
            <Text style={styles.factLabel}>🎯</Text>
            <Text style={styles.factValue}>Goals</Text>
            <Text style={styles.factDesc}>Stay focused</Text>
          </View>
        </View>
      </AnimatedCard>

      {/* Tips Section */}
      <AnimatedCard delay={700} style={styles.section}>
        <Text style={styles.sectionTitle}>📱 How to use VelaMind</Text>
        <View style={styles.stepCard}>
          <LinearGradient
            colors={[palette.accent, palette.accentPurple]}
            style={styles.stepNumber}
          >
            <Text style={styles.stepNumberText}>1</Text>
          </LinearGradient>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Daily Check-in</Text>
            <Text style={styles.stepDescription}>Rate your mood and share what's on your mind</Text>
          </View>
        </View>
        <View style={styles.stepCard}>
          <LinearGradient
            colors={[palette.accentPurple, palette.accentWarm]}
            style={styles.stepNumber}
          >
            <Text style={styles.stepNumberText}>2</Text>
          </LinearGradient>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Get AI Insight</Text>
            <Text style={styles.stepDescription}>Receive personalized wellness recommendations</Text>
          </View>
        </View>
        <View style={styles.stepCard}>
          <LinearGradient
            colors={[palette.accentWarm, palette.accentGreen]}
            style={styles.stepNumber}
          >
            <Text style={styles.stepNumberText}>3</Text>
          </LinearGradient>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review History</Text>
            <Text style={styles.stepDescription}>Track your mood trends and celebrate progress</Text>
          </View>
        </View>
      </AnimatedCard>

      {/* Add New User Section */}
      <AnimatedCard delay={800} style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Account</Text>
        <TouchableOpacity style={styles.addUserCard} onPress={handleAddNewUser} activeOpacity={0.8}>
          <LinearGradient
            colors={[palette.accentWarm, '#e91e8c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addUserGradient}
          >
            <Text style={styles.addUserEmoji}>👤</Text>
            <View style={styles.addUserContent}>
              <Text style={styles.addUserTitle}>Add New User</Text>
              <Text style={styles.addUserDesc}>Register another person on this device</Text>
            </View>
            <Text style={styles.addUserArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </AnimatedCard>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const tipsData = [
  {
    emoji: '💧',
    title: 'Stay Hydrated',
    description: 'Drink plenty of water throughout the day. Dehydration can affect mood.',
  },
  {
    emoji: '😴',
    title: 'Prioritize Sleep',
    description: 'Aim for 7-9 hours of quality sleep each night for optimal mental health.',
  },
  {
    emoji: '🚶',
    title: 'Move Your Body',
    description: 'Exercise releases endorphins. Even a 10-minute walk can boost your mood.',
  },
  {
    emoji: '🧘',
    title: 'Practice Mindfulness',
    description: 'Spend 5 minutes daily on breathing exercises or meditation.',
  },
  {
    emoji: '👥',
    title: 'Connect with Others',
    description: 'Social connection is vital for mental wellbeing. Reach out to someone today.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  // Logo styles
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlowRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: palette.accent,
    borderStyle: 'dashed',
  },
  logoBody: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoFace: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEyeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  logoEye: {
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoEyeInner: {
    backgroundColor: palette.accent,
    position: 'absolute',
  },
  logoEyeShine: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 2,
    right: 2,
    opacity: 0.8,
  },
  logoMouth: {
    backgroundColor: palette.background,
  },
  logoAntenna: {
    position: 'absolute',
    width: 3,
    backgroundColor: palette.accent,
    alignItems: 'center',
  },
  logoAntennaTop: {
    position: 'absolute',
    top: -6,
    backgroundColor: palette.accent,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 6,
  },
  logoEar: {
    position: 'absolute',
    backgroundColor: palette.accentPurple,
    borderRadius: 4,
  },
  logoEarLeft: {
    left: -4,
    top: '40%',
  },
  logoEarRight: {
    right: -4,
    top: '40%',
  },
  // Header styles
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  // Greeting styles
  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    color: palette.text,
    fontWeight: '600',
  },
  greetingName: {
    color: palette.accent,
    fontWeight: '700',
  },
  greetingSubtext: {
    fontSize: 14,
    color: palette.muted,
    marginTop: 4,
  },
  // Loading styles
  loadingContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: palette.cardAlt,
    borderRadius: 16,
    padding: 30,
    borderWidth: 1,
    borderColor: palette.border,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  loadingDot: {
    fontSize: 8,
    color: palette.accent,
  },
  // Insight card styles
  insightCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(126, 240, 255, 0.2)',
    borderRadius: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.accent,
  },
  refreshButton: {
    padding: 8,
    backgroundColor: palette.card,
    borderRadius: 10,
  },
  refreshIcon: {
    fontSize: 18,
  },
  insightContent: {
    fontSize: 15,
    color: palette.text,
    lineHeight: 24,
  },
  // Section styles
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 16,
  },
  // Tip card styles
  tipCard: {
    flexDirection: 'row',
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  tipIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipEmoji: {
    fontSize: 22,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
  },
  // Facts styles
  factsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  factBox: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  factLabel: {
    fontSize: 26,
    marginBottom: 8,
  },
  factValue: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 2,
  },
  factDesc: {
    fontSize: 11,
    color: palette.muted,
    textAlign: 'center',
  },
  // Step card styles
  stepCard: {
    flexDirection: 'row',
    backgroundColor: palette.cardAlt,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.background,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
  },
  // Add user styles
  addUserCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  addUserGradient: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    gap: 14,
  },
  addUserEmoji: {
    fontSize: 28,
  },
  addUserContent: {
    flex: 1,
  },
  addUserTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  addUserDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  addUserArrow: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
});
