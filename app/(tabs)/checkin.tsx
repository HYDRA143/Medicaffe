import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { saveCheckIn, getTodayCheckIn, getCheckIns, getUserProfile } from '../../utils/storage';
import { generateWellnessInsight } from '../../utils/aiService';

const { width, height } = Dimensions.get('window');

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
  accentOrange: '#fb923c',
  accentYellow: '#fbbf24',
  border: '#1d283a',
  glow: '#12314a',
};

const moodData = [
  { emoji: '😞', label: 'Awful', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  { emoji: '😔', label: 'Bad', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
  { emoji: '😕', label: 'Poor', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)' },
  { emoji: '😐', label: 'Meh', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  { emoji: '🙂', label: 'Okay', color: '#a3e635', bg: 'rgba(163, 230, 53, 0.15)' },
  { emoji: '😊', label: 'Good', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
  { emoji: '😄', label: 'Great', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.15)' },
  { emoji: '🤩', label: 'Amazing', color: '#7ef0ff', bg: 'rgba(126, 240, 255, 0.15)' },
];

const energyLevels = [
  { emoji: '🔋', label: 'Drained', value: 1, color: '#ef4444' },
  { emoji: '🪫', label: 'Low', value: 2, color: '#fb923c' },
  { emoji: '⚡', label: 'Moderate', value: 3, color: '#fbbf24' },
  { emoji: '🚀', label: 'High', value: 4, color: '#34d399' },
  { emoji: '💥', label: 'Supercharged', value: 5, color: '#7ef0ff' },
];

const sleepQuality = [
  { emoji: '😴', label: 'Terrible', hours: '< 4h', color: '#ef4444' },
  { emoji: '🥱', label: 'Poor', hours: '4-5h', color: '#fb923c' },
  { emoji: '😑', label: 'Fair', hours: '5-6h', color: '#fbbf24' },
  { emoji: '😌', label: 'Good', hours: '6-7h', color: '#a3e635' },
  { emoji: '💤', label: 'Great', hours: '7-8h', color: '#34d399' },
  { emoji: '🌙', label: 'Perfect', hours: '8h+', color: '#a78bfa' },
];

const symptoms = [
  { id: 'headache', emoji: '🤕', label: 'Headache' },
  { id: 'fatigue', emoji: '😩', label: 'Fatigue' },
  { id: 'anxiety', emoji: '😰', label: 'Anxiety' },
  { id: 'stress', emoji: '😤', label: 'Stress' },
  { id: 'nausea', emoji: '🤢', label: 'Nausea' },
  { id: 'pain', emoji: '💢', label: 'Body Pain' },
  { id: 'insomnia', emoji: '🌃', label: 'Insomnia' },
  { id: 'focus', emoji: '🧠', label: 'Brain Fog' },
];

const activities = [
  { id: 'exercise', emoji: '🏃', label: 'Exercise' },
  { id: 'meditation', emoji: '🧘', label: 'Meditation' },
  { id: 'socializing', emoji: '👥', label: 'Socializing' },
  { id: 'nature', emoji: '🌿', label: 'Nature' },
  { id: 'reading', emoji: '📚', label: 'Reading' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'cooking', emoji: '🍳', label: 'Cooking' },
  { id: 'creative', emoji: '🎨', label: 'Creative' },
];

const gratitudePrompts = [
  "What made you smile today?",
  "Who are you grateful for right now?",
  "What's something small that brought you joy?",
  "What accomplishment are you proud of?",
  "What's a challenge you overcame recently?",
  "What are you looking forward to?",
];

// Animated Card Component
const AnimatedCard = ({ children, delay = 0, style }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
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

// Pulse Animation Component
const PulseView = ({ children, style, isActive }: any) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  return (
    <Animated.View style={[style, { transform: [{ scale: pulseAnim }] }]}>
      {children}
    </Animated.View>
  );
};

// Chatbot Logo Component
const ChatbotLogo = ({ size = 60 }: { size?: number }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 5,
          duration: 1500,
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
  }, []);

  return (
    <Animated.View style={[
      styles.logoContainer, 
      { transform: [{ translateY: floatAnim }] }
    ]}>
      <Animated.View style={[styles.logoGlow, { opacity: glowAnim }]} />
      <LinearGradient
        colors={[palette.accent, palette.accentPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.logoInner, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <View style={styles.logoFace}>
          <View style={styles.logoEyeContainer}>
            <Animated.View style={[styles.logoEye, { backgroundColor: palette.background }]}>
              <View style={styles.logoEyeInner} />
            </Animated.View>
            <Animated.View style={[styles.logoEye, { backgroundColor: palette.background }]}>
              <View style={styles.logoEyeInner} />
            </Animated.View>
          </View>
          <View style={styles.logoMouth} />
        </View>
      </LinearGradient>
      <View style={[styles.logoAntenna, { height: size * 0.25 }]}>
        <Animated.View style={[
          styles.logoAntennaTop, 
          { 
            opacity: glowAnim,
            shadowOpacity: glowAnim as any,
          }
        ]} />
      </View>
    </Animated.View>
  );
};

export default function CheckinScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [journal, setJournal] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [showInsight, setShowInsight] = useState(false);
  const [gratitudePrompt] = useState(gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const moodEmojiAnim = useRef(new Animated.Value(1)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;

  const steps = ['Mood', 'Energy', 'Sleep', 'Symptoms', 'Activities', 'Journal'];

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    checkTodayEntry();
  }, []);

  useEffect(() => {
    if (hasCheckedIn) {
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [hasCheckedIn]);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      loadingRotation.setValue(0);
    }
  }, [isLoading]);

  const animateMoodChange = () => {
    Animated.sequence([
      Animated.timing(moodEmojiAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(moodEmojiAnim, {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateStep = (nextStep: number) => {
    const direction = nextStep > currentStep ? 1 : -1;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50 * direction,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(nextStep);
      slideAnim.setValue(50 * direction);
      
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const checkTodayEntry = async () => {
    const todayEntry = await getTodayCheckIn();
    if (todayEntry) {
      setMood(todayEntry.mood - 1);
      setJournal(todayEntry.journal);
      setAiInsight(todayEntry.aiInsight || '');
      setHasCheckedIn(true);
      setShowInsight(!!todayEntry.aiInsight);
      setCurrentStep(5);
    }
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const generateInsight = async () => {
    setIsLoading(true);
    try {
      const checkIns = await getCheckIns();
      const previousMoods = checkIns.slice(0, 7).map(ci => ci.mood);
      const profile = await getUserProfile();

      const contextText = `Mood: ${moodData[mood].label}, Energy: ${energyLevels[energy - 1].label}, Sleep: ${sleepQuality[sleep].label}. ${journal}`;

      const response = await generateWellnessInsight(
        mood + 1,
        contextText,
        profile?.goal || 'Better wellbeing',
        previousMoods
      );

      if (response.success) {
        setAiInsight(response.text);
        setShowInsight(true);
      } else {
        Alert.alert('Failed to generate insight', response.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate AI insight');
      console.error('AI Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCheckInEntry = async () => {
    setIsLoading(true);
    animateButtonPress();
    try {
      const checkInData = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        mood: mood + 1,
        energy,
        sleep,
        symptoms: selectedSymptoms,
        activities: selectedActivities,
        journal,
        gratitude,
        aiInsight,
        timestamp: Date.now(),
      };

      await saveCheckIn(checkInData);
      setHasCheckedIn(true);
      Alert.alert('Check-in Complete! 🎉', 'Your wellness data has been recorded. Keep tracking for better insights!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save check-in');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const spin = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderProgressBar = () => (
    <Animated.View style={[
      styles.progressContainer,
      {
        opacity: progressAnim,
        transform: [{ translateY: progressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        })}],
      }
    ]}>
      <View style={styles.progressBar}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <TouchableOpacity
              onPress={() => !hasCheckedIn && animateStep(index)}
              activeOpacity={0.7}
            >
              <PulseView isActive={index === currentStep} style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive,
                index === currentStep && styles.progressDotCurrent,
              ]}>
                <Text style={[
                  styles.progressDotText,
                  index <= currentStep && styles.progressDotTextActive,
                  index === currentStep && styles.progressDotTextCurrent,
                ]}>
                  {index < currentStep ? '✓' : index + 1}
                </Text>
              </PulseView>
            </TouchableOpacity>
            {index < steps.length - 1 && (
              <Animated.View style={[
                styles.progressLine,
                index < currentStep && styles.progressLineActive,
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepLabel}>{steps[currentStep]}</Text>
    </Animated.View>
  );

  const renderMoodStep = () => (
    <View style={styles.stepContent}>
      <AnimatedCard delay={0}>
        <Text style={styles.stepTitle}>How are you feeling?</Text>
        <Text style={styles.stepSubtitle}>Tap to select your current mood</Text>
      </AnimatedCard>
      
      <View style={styles.moodGrid}>
        {moodData.map((item, index) => (
          <AnimatedCard key={index} delay={50 * index}>
            <TouchableOpacity
              style={[
                styles.moodCard,
                mood === index && { 
                  borderColor: item.color, 
                  borderWidth: 2,
                  backgroundColor: item.bg,
                },
              ]}
              onPress={() => {
                setMood(index);
                animateMoodChange();
              }}
              disabled={hasCheckedIn}
              activeOpacity={0.7}
            >
              <Text style={styles.moodCardEmoji}>{item.emoji}</Text>
              <Text style={[styles.moodCardLabel, mood === index && { color: item.color }]}>
                {item.label}
              </Text>
              {mood === index && (
                <Animated.View style={[
                  styles.moodIndicator, 
                  { backgroundColor: item.color }
                ]} />
              )}
            </TouchableOpacity>
          </AnimatedCard>
        ))}
      </View>
      
      <AnimatedCard delay={400} style={styles.selectedMoodDisplay}>
        <Animated.Text style={[
          styles.selectedMoodEmoji,
          { transform: [{ scale: moodEmojiAnim }] }
        ]}>
          {moodData[mood].emoji}
        </Animated.Text>
        <Text style={[styles.selectedMoodLabel, { color: moodData[mood].color }]}>
          {moodData[mood].label}
        </Text>
      </AnimatedCard>
    </View>
  );

  const renderEnergyStep = () => (
    <View style={styles.stepContent}>
      <AnimatedCard delay={0}>
        <Text style={styles.stepTitle}>What's your energy level?</Text>
        <Text style={styles.stepSubtitle}>How charged do you feel right now?</Text>
      </AnimatedCard>
      
      <View style={styles.energyContainer}>
        {energyLevels.map((item, index) => (
          <AnimatedCard key={item.value} delay={80 * index}>
            <TouchableOpacity
              style={[
                styles.energyCard,
                energy === item.value && styles.energyCardActive,
                energy === item.value && { borderColor: item.color },
              ]}
              onPress={() => setEnergy(item.value)}
              disabled={hasCheckedIn}
              activeOpacity={0.7}
            >
              <PulseView isActive={energy === item.value}>
                <Text style={styles.energyEmoji}>{item.emoji}</Text>
              </PulseView>
              <Text style={[
                styles.energyLabel,
                energy === item.value && { color: item.color },
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </AnimatedCard>
        ))}
      </View>
      
      <AnimatedCard delay={500} style={styles.energyMeterContainer}>
        <View style={styles.energyMeter}>
          <Animated.View style={[styles.energyFill, { width: `${(energy / 5) * 100}%` }]}>
            <LinearGradient
              colors={['#ef4444', '#fbbf24', '#34d399', '#7ef0ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.energyGradient}
            />
          </Animated.View>
        </View>
        <View style={styles.energyMeterLabels}>
          <Text style={styles.energyMeterLabel}>Low</Text>
          <Text style={styles.energyMeterLabel}>High</Text>
        </View>
      </AnimatedCard>
    </View>
  );

  const renderSleepStep = () => (
    <View style={styles.stepContent}>
      <AnimatedCard delay={0}>
        <Text style={styles.stepTitle}>How did you sleep?</Text>
        <Text style={styles.stepSubtitle}>Rate your sleep quality last night</Text>
      </AnimatedCard>
      
      <View style={styles.sleepGrid}>
        {sleepQuality.map((item, index) => (
          <AnimatedCard key={index} delay={60 * index}>
            <TouchableOpacity
              style={[
                styles.sleepCard,
                sleep === index && styles.sleepCardActive,
                sleep === index && { borderColor: item.color },
              ]}
              onPress={() => setSleep(index)}
              disabled={hasCheckedIn}
              activeOpacity={0.7}
            >
              <PulseView isActive={sleep === index}>
                <Text style={styles.sleepEmoji}>{item.emoji}</Text>
              </PulseView>
              <Text style={[
                styles.sleepLabel,
                sleep === index && { color: item.color },
              ]}>
                {item.label}
              </Text>
              <Text style={[
                styles.sleepHours,
                sleep === index && { color: item.color, opacity: 0.8 },
              ]}>
                {item.hours}
              </Text>
            </TouchableOpacity>
          </AnimatedCard>
        ))}
      </View>
    </View>
  );

  const renderSymptomsStep = () => (
    <View style={styles.stepContent}>
      <AnimatedCard delay={0}>
        <Text style={styles.stepTitle}>Any symptoms today?</Text>
        <Text style={styles.stepSubtitle}>Select all that apply (optional)</Text>
      </AnimatedCard>
      
      <View style={styles.tagGrid}>
        {symptoms.map((item, index) => (
          <AnimatedCard key={item.id} delay={50 * index}>
            <TouchableOpacity
              style={[
                styles.tagCard,
                selectedSymptoms.includes(item.id) && styles.tagCardActive,
              ]}
              onPress={() => toggleSymptom(item.id)}
              disabled={hasCheckedIn}
              activeOpacity={0.7}
            >
              <Text style={styles.tagEmoji}>{item.emoji}</Text>
              <Text style={[
                styles.tagLabel,
                selectedSymptoms.includes(item.id) && styles.tagLabelActive,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </AnimatedCard>
        ))}
      </View>
      
      {selectedSymptoms.length > 0 && (
        <AnimatedCard delay={0} style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected
          </Text>
        </AnimatedCard>
      )}
    </View>
  );

  const renderActivitiesStep = () => (
    <View style={styles.stepContent}>
      <AnimatedCard delay={0}>
        <Text style={styles.stepTitle}>What did you do today?</Text>
        <Text style={styles.stepSubtitle}>Select activities you engaged in</Text>
      </AnimatedCard>
      
      <View style={styles.tagGrid}>
        {activities.map((item, index) => (
          <AnimatedCard key={item.id} delay={50 * index}>
            <TouchableOpacity
              style={[
                styles.tagCard,
                styles.activityTag,
                selectedActivities.includes(item.id) && styles.activityTagActive,
              ]}
              onPress={() => toggleActivity(item.id)}
              disabled={hasCheckedIn}
              activeOpacity={0.7}
            >
              <Text style={styles.tagEmoji}>{item.emoji}</Text>
              <Text style={[
                styles.tagLabel,
                selectedActivities.includes(item.id) && styles.activityLabelActive,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </AnimatedCard>
        ))}
      </View>
    </View>
  );

  const renderJournalStep = () => (
    <View style={styles.stepContent}>
      <AnimatedCard delay={0}>
        <Text style={styles.stepTitle}>Reflect on your day</Text>
      </AnimatedCard>
      
      {/* Gratitude Section */}
      <AnimatedCard delay={100} style={styles.gratitudeSection}>
        <View style={styles.gratitudeHeader}>
          <Text style={styles.gratitudeIcon}>✨</Text>
          <Text style={styles.gratitudePrompt}>{gratitudePrompt}</Text>
        </View>
        <TextInput
          style={styles.gratitudeInput}
          placeholder="I'm grateful for..."
          placeholderTextColor={palette.muted}
          value={gratitude}
          onChangeText={setGratitude}
          maxLength={200}
          editable={!hasCheckedIn}
        />
      </AnimatedCard>
      
      {/* Journal Entry */}
      <AnimatedCard delay={200} style={styles.journalSection}>
        <View style={styles.journalHeader}>
          <Text style={styles.journalTitle}>📝 Journal Entry</Text>
          <Text style={styles.charCount}>{journal.length}/500</Text>
        </View>
        <TextInput
          style={styles.journalInput}
          placeholder="What's on your mind? Share your thoughts, experiences, or anything you want to remember..."
          placeholderTextColor={palette.muted}
          multiline
          numberOfLines={6}
          value={journal}
          onChangeText={setJournal}
          maxLength={500}
          editable={!hasCheckedIn}
        />
      </AnimatedCard>

      {/* AI Insight */}
      {showInsight && aiInsight && (
        <AnimatedCard delay={300} style={styles.insightSection}>
          <LinearGradient
            colors={['rgba(126, 240, 255, 0.1)', 'rgba(167, 139, 250, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.insightGradient}
          >
            <View style={styles.insightHeader}>
              <ChatbotLogo size={40} />
              <Text style={styles.insightTitle}>AI Wellness Insight</Text>
            </View>
            <Text style={styles.insightText}>{aiInsight}</Text>
          </LinearGradient>
        </AnimatedCard>
      )}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderMoodStep();
      case 1: return renderEnergyStep();
      case 2: return renderSleepStep();
      case 3: return renderSymptomsStep();
      case 4: return renderActivitiesStep();
      case 5: return renderJournalStep();
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={{
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, 0],
        })}],
      }}>
        <LinearGradient
          colors={['rgba(126, 240, 255, 0.15)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Daily Check-in</Text>
              <Text style={styles.headerDate}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
            <ChatbotLogo size={50} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Success Banner */}
      {hasCheckedIn && (
        <Animated.View style={[
          styles.successBanner,
          {
            opacity: successAnim,
            transform: [{ 
              scale: successAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }],
          }
        ]}>
          <LinearGradient
            colors={['rgba(52, 211, 153, 0.2)', 'rgba(52, 211, 153, 0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.successGradient}
          >
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>Today's check-in complete!</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.navButtonBack}
            onPress={() => animateStep(currentStep - 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonBackText}>← Back</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.navSpacer} />
        
        {currentStep < 5 ? (
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={styles.navButtonNext}
              onPress={() => {
                animateButtonPress();
                animateStep(currentStep + 1);
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[palette.accent, palette.accentPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.navButtonGradient}
              >
                <Text style={styles.navButtonNextText}>Next →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : !hasCheckedIn && (
          <View style={styles.finalButtons}>
            {!showInsight && (
              <TouchableOpacity
                style={styles.insightButton}
                onPress={generateInsight}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <Animated.Text style={[styles.insightButtonText, { transform: [{ rotate: spin }] }]}>
                    ✨
                  </Animated.Text>
                ) : (
                  <Text style={styles.insightButtonText}>✨ Get AI Insight</Text>
                )}
              </TouchableOpacity>
            )}
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveCheckInEntry}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[palette.accentGreen, '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Saving...' : '✓ Complete'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

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
  logoGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.accent,
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoFace: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEyeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  logoEye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEyeInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.accent,
  },
  logoMouth: {
    width: 14,
    height: 7,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: palette.background,
  },
  logoAntenna: {
    position: 'absolute',
    top: -12,
    width: 2,
    backgroundColor: palette.accent,
    alignItems: 'center',
  },
  logoAntennaTop: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.accent,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  // Header styles
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: palette.muted,
    fontWeight: '500',
  },
  successBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  successGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  successIcon: {
    fontSize: 18,
    color: palette.accentGreen,
    marginRight: 10,
    fontWeight: '700',
  },
  successText: {
    color: palette.accentGreen,
    fontWeight: '600',
    fontSize: 14,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.border,
  },
  progressDotActive: {
    backgroundColor: palette.cardAlt,
    borderColor: palette.accent,
  },
  progressDotCurrent: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  progressDotText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.muted,
  },
  progressDotTextActive: {
    color: palette.text,
  },
  progressDotTextCurrent: {
    color: palette.background,
  },
  progressLine: {
    width: 20,
    height: 3,
    backgroundColor: palette.border,
    borderRadius: 2,
  },
  progressLineActive: {
    backgroundColor: palette.accent,
  },
  stepLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: palette.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  animatedContent: {
    paddingHorizontal: 20,
  },
  stepContent: {
    minHeight: 380,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  // Mood Step
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  moodCard: {
    width: (width - 80) / 4,
    aspectRatio: 0.9,
    backgroundColor: palette.card,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    padding: 6,
  },
  moodCardEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  moodCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: palette.muted,
    textAlign: 'center',
  },
  moodIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  selectedMoodDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: palette.cardAlt,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  selectedMoodEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  selectedMoodLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  // Energy Step
  energyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  energyCard: {
    flex: 1,
    aspectRatio: 0.75,
    backgroundColor: palette.card,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.border,
  },
  energyCardActive: {
    backgroundColor: palette.cardAlt,
    borderWidth: 2,
  },
  energyEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  energyLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: palette.muted,
    textAlign: 'center',
  },
  energyMeterContainer: {
    marginTop: 8,
  },
  energyMeter: {
    height: 10,
    backgroundColor: palette.card,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
  },
  energyFill: {
    height: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  energyGradient: {
    flex: 1,
  },
  energyMeterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  energyMeterLabel: {
    fontSize: 11,
    color: palette.muted,
    fontWeight: '500',
  },
  // Sleep Step
  sleepGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  sleepCard: {
    width: (width - 70) / 3,
    paddingVertical: 18,
    backgroundColor: palette.card,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.border,
  },
  sleepCardActive: {
    backgroundColor: palette.cardAlt,
  },
  sleepEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  sleepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.muted,
    marginBottom: 2,
  },
  sleepHours: {
    fontSize: 10,
    color: palette.muted,
    opacity: 0.7,
  },
  // Tags (Symptoms & Activities)
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  tagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: palette.border,
  },
  tagCardActive: {
    backgroundColor: 'rgba(255, 122, 179, 0.15)',
    borderColor: palette.accentWarm,
  },
  activityTag: {
    backgroundColor: palette.card,
  },
  activityTagActive: {
    backgroundColor: 'rgba(126, 240, 255, 0.15)',
    borderColor: palette.accent,
  },
  tagEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  tagLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.muted,
  },
  tagLabelActive: {
    color: palette.accentWarm,
  },
  activityLabelActive: {
    color: palette.accent,
  },
  selectedCount: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: palette.cardAlt,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  selectedCountText: {
    fontSize: 13,
    color: palette.accentWarm,
    fontWeight: '700',
  },
  // Journal Step
  gratitudeSection: {
    marginBottom: 20,
  },
  gratitudeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gratitudeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  gratitudePrompt: {
    fontSize: 14,
    color: palette.accentYellow,
    fontWeight: '600',
    fontStyle: 'italic',
    flex: 1,
  },
  gratitudeInput: {
    backgroundColor: palette.card,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: palette.border,
    padding: 14,
    fontSize: 15,
    color: palette.text,
  },
  journalSection: {
    marginBottom: 20,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  journalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  charCount: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '500',
  },
  journalInput: {
    backgroundColor: palette.card,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: palette.border,
    padding: 14,
    fontSize: 15,
    color: palette.text,
    minHeight: 130,
    textAlignVertical: 'top',
  },
  insightSection: {
    marginTop: 8,
  },
  insightGradient: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 240, 255, 0.3)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.accent,
  },
  insightText: {
    fontSize: 14,
    color: palette.text,
    lineHeight: 22,
  },
  // Navigation
  navContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    backgroundColor: palette.background,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  navButtonBack: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: palette.card,
    borderWidth: 2,
    borderColor: palette.border,
  },
  navButtonBackText: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  navSpacer: {
    flex: 1,
  },
  navButtonNext: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  navButtonNextText: {
    color: palette.background,
    fontSize: 15,
    fontWeight: '700',
  },
  finalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  insightButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: palette.card,
    borderWidth: 2,
    borderColor: palette.accent,
  },
  insightButtonText: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: palette.accentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: palette.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
