import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const colors = {
  background: '#05080f',
  surface: '#0d1424',
  card: '#121b2d',
  accent: '#7ef0ff',
  accentWarm: '#ff7ab3',
  text: '#e6edf7',
  muted: '#9fb0c8',
  border: '#1c2638',
  glow: '#133049',
};

const introSteps = [
  {
    emoji: '🛸',
    title: 'Welcome aboard VelaMind',
    description: 'Settle into a calm, cinematic night cabin.',
  },
  {
    emoji: '🎛️',
    title: 'Dial in check-ins',
    description: 'Tactile prompts keep your mood story flowing.',
  },
  {
    emoji: '🧭',
    title: 'Contextual guidance',
    description: 'See vector-like patterns as you log.',
  },
  {
    emoji: '🌌',
    title: 'Progress, not perfection',
    description: 'Own your trajectory with night-sky visuals.',
  },
];

const goals = [
  'Ease tension + anxiety',
  'Strengthen emotional balance',
  'Build sustainable rituals',
  'Sleep deeper at night',
  'Grow self-awareness',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    goal: '',
  });
  const glow = useState(new Animated.Value(0))[0];

  const showForm = step >= introSteps.length;

  const handleNext = async () => {
    if (step < introSteps.length) {
      setStep(step + 1);
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    if (!formData.age.trim()) {
      Alert.alert('Required', 'Please enter your age');
      return;
    }
    if (!formData.goal) {
      Alert.alert('Required', 'Please select a wellness goal');
      return;
    }

    setIsLoading(true);
    try {
      const profile = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        goal: formData.goal,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ])
    ).start();
  }, [glow]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[styles.gradientShell, { opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }]}>
        <LinearGradient
          colors={[colors.glow, colors.card, colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.dots}>
          {[...introSteps, 'form'].map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
            />
          ))}
        </View>

        {!showForm ? (
          <View style={styles.introBox}>
            <Text style={styles.emoji}>{introSteps[step].emoji}</Text>
            <Text style={styles.title}>{introSteps[step].title}</Text>
            <Text style={styles.desc}>{introSteps[step].description}</Text>
          </View>
        ) : (
          <View style={styles.formBox}>
            <Text style={styles.formTitle}>Set up your cabin</Text>

            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor={colors.muted}
              value={formData.name}
              onChangeText={(t) => setFormData({ ...formData, name: t })}
            />

            <Text style={styles.label}>Your Age (kept private)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              value={formData.age}
              onChangeText={(t) => setFormData({ ...formData, age: t })}
            />

            <Text style={styles.label}>Wellness Goal</Text>
            {goals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.goalBtn, formData.goal === g && styles.goalBtnActive]}
                onPress={() => setFormData({ ...formData, goal: g })}
              >
                <Text style={[styles.goalTxt, formData.goal === g && styles.goalTxtActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.btnRow}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backTxt}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, step === 0 && { flex: 1 }]}
            onPress={handleNext}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.nextTxt}>{showForm ? 'Enter app' : 'Next'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  gradientShell: { ...StyleSheet.absoluteFillObject, position: 'absolute', zIndex: -1, transform: [{ scale: 1.2 }] },
  gradient: { flex: 1, opacity: 0.85 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.accent, width: 24 },
  dotDone: { backgroundColor: colors.accent },
  introBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emoji: { fontSize: 72, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 16, color: colors.muted, textAlign: 'center', lineHeight: 24 },
  formBox: { flex: 1 },
  formTitle: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontSize: 16, color: colors.text },
  goalBtn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginTop: 8 },
  goalBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent, shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  goalTxt: { textAlign: 'center', color: colors.text },
  goalTxtActive: { color: colors.surface, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 32 },
  backBtn: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, alignItems: 'center' },
  backTxt: { fontSize: 16, fontWeight: '600', color: colors.text },
  nextBtn: { flex: 2, backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: colors.accent, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  nextTxt: { fontSize: 16, fontWeight: '700', color: colors.surface },
});
