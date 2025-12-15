/**
 * MediCaffe Constants
 * 
 * Application-wide constants including storage keys, API configuration,
 * and predefined data for medication management.
 * Features emojis for better UX and visual appeal.
 */

// AsyncStorage Keys - Centralized for easy management and preventing typos
export const STORAGE_KEYS = {
  USER_PROFILE: '@medicaffe_user_profile',
  MEDICATIONS: '@medicaffe_medications',
  INTERACTIONS_HISTORY: '@medicaffe_interactions_history',
  AI_CHAT_HISTORY: '@medicaffe_ai_chat_history',
  ONBOARDING_COMPLETE: '@medicaffe_onboarding_complete',
  APP_SETTINGS: '@medicaffe_settings',
};

// AI API Configuration
// NOTE: In production, use environment variables or secure storage for API keys
export const AI_CONFIG = {
  // Using Google Gemini API (free tier available)
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  // Placeholder key - user should replace with their own
  API_KEY: 'YOUR_GEMINI_API_KEY',
  MODEL: 'gemini-1.5-flash',
  MAX_TOKENS: 1024,
  TEMPERATURE: 0.7,
};

// Medication form options with emojis
export const MEDICATION_FORMS = [
  { label: '💊 Tablet', value: 'tablet', icon: 'tablet', emoji: '💊' },
  { label: '💊 Capsule', value: 'capsule', icon: 'pill', emoji: '💊' },
  { label: '🧪 Liquid', value: 'liquid', icon: 'water', emoji: '🧪' },
  { label: '💉 Injection', value: 'injection', icon: 'eyedropper', emoji: '💉' },
  { label: '🧴 Cream', value: 'cream', icon: 'bandage', emoji: '🧴' },
  { label: '🌬️ Inhaler', value: 'inhaler', icon: 'wind', emoji: '🌬️' },
  { label: '💧 Drops', value: 'drops', icon: 'droplet', emoji: '💧' },
  { label: '🩹 Patch', value: 'patch', icon: 'bandaid', emoji: '🩹' },
  { label: '🏥 Other', value: 'other', icon: 'medical-bag', emoji: '🏥' },
];

// Dosage frequency options with emojis
export const FREQUENCY_OPTIONS = [
  { label: '☀️ Once daily', value: 'once_daily', emoji: '☀️' },
  { label: '🌅🌙 Twice daily', value: 'twice_daily', emoji: '🔄' },
  { label: '🔄 Three times', value: 'three_times_daily', emoji: '🔄' },
  { label: '⏰ Four times', value: 'four_times_daily', emoji: '⏰' },
  { label: '⏱️ Every 4 hours', value: 'every_4_hours', emoji: '⏱️' },
  { label: '⏱️ Every 6 hours', value: 'every_6_hours', emoji: '⏱️' },
  { label: '⏱️ Every 8 hours', value: 'every_8_hours', emoji: '⏱️' },
  { label: '⏱️ Every 12 hours', value: 'every_12_hours', emoji: '⏱️' },
  { label: '📅 Once weekly', value: 'once_weekly', emoji: '📅' },
  { label: '📋 As needed', value: 'as_needed', emoji: '📋' },
];

// Timing options with emojis
export const TIMING_OPTIONS = [
  { label: '🌅 Morning', value: 'morning', emoji: '🌅' },
  { label: '☀️ Afternoon', value: 'afternoon', emoji: '☀️' },
  { label: '🌆 Evening', value: 'evening', emoji: '🌆' },
  { label: '🌙 Bedtime', value: 'bedtime', emoji: '🌙' },
  { label: '🍳 With breakfast', value: 'with_breakfast', emoji: '🍳' },
  { label: '🥗 With lunch', value: 'with_lunch', emoji: '🥗' },
  { label: '🍽️ With dinner', value: 'with_dinner', emoji: '🍽️' },
  { label: '⏰ Before meals', value: 'before_meals', emoji: '⏰' },
  { label: '🍴 After meals', value: 'after_meals', emoji: '🍴' },
  { label: '🚫🍽️ Empty stomach', value: 'empty_stomach', emoji: '🚫' },
];

// Interaction severity levels with emojis
export const INTERACTION_SEVERITY = {
  NONE: {
    level: 'none',
    label: '✅ No Known Interaction',
    emoji: '✅',
    color: 'success',
    description: 'These medications can typically be taken together safely.',
  },
  MILD: {
    level: 'mild',
    label: '🟢 Mild Interaction',
    emoji: '🟢',
    color: 'info',
    description: 'Minor interaction that usually does not require medical attention.',
  },
  MODERATE: {
    level: 'moderate',
    label: '🟡 Moderate Interaction',
    emoji: '🟡',
    color: 'warning',
    description: 'May require monitoring or dosage adjustment. Consult your healthcare provider.',
  },
  SEVERE: {
    level: 'severe',
    label: '🔴 Severe Interaction',
    emoji: '🔴',
    color: 'danger',
    description: 'Potentially dangerous combination. Consult your healthcare provider immediately.',
  },
};

// Common medication categories for organization with emojis
export const MEDICATION_CATEGORIES = [
  { label: '🩹 Pain Relief', value: 'pain_relief', emoji: '🩹' },
  { label: '❤️ Heart & Blood Pressure', value: 'cardiovascular', emoji: '❤️' },
  { label: '🩸 Diabetes', value: 'diabetes', emoji: '🩸' },
  { label: '💊 Antibiotics', value: 'antibiotics', emoji: '💊' },
  { label: '🤧 Allergies', value: 'allergies', emoji: '🤧' },
  { label: '🍽️ Digestive', value: 'digestive', emoji: '🍽️' },
  { label: '🧠 Mental Health', value: 'mental_health', emoji: '🧠' },
  { label: '✨ Vitamins & Supplements', value: 'vitamins', emoji: '✨' },
  { label: '🫁 Respiratory', value: 'respiratory', emoji: '🫁' },
  { label: '🧴 Skin Conditions', value: 'skin', emoji: '🧴' },
  { label: '💜 Hormones', value: 'hormones', emoji: '💜' },
  { label: '📦 Other', value: 'other', emoji: '📦' },
];

// Onboarding slides configuration with emojis
export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: '👋 Welcome to MediCaffe',
    description: 'Your personal AI-powered medication assistant. Manage your medications safely and stay informed about potential interactions.',
    icon: 'medical-bag',
    emoji: '☕',
    color: '#4A90A4',
  },
  {
    id: '2',
    title: '🛡️ Check Drug Interactions',
    description: 'Our AI analyzes your medications to identify potential interactions and keeps you safe from harmful combinations.',
    icon: 'shield-check',
    emoji: '🛡️',
    color: '#7C5CBF',
  },
  {
    id: '3',
    title: '🤖 Get AI-Powered Answers',
    description: 'Have questions about your medications? Our AI assistant provides reliable information tailored to your needs.',
    icon: 'robot',
    emoji: '🤖',
    color: '#4CAF50',
  },
  {
    id: '4',
    title: '📋 Track Your Medications',
    description: 'Keep all your medications organized in one place with detailed information, schedules, and personalized notes.',
    icon: 'clipboard-list',
    emoji: '📋',
    color: '#FF9800',
  },
];

// Quick action buttons for home screen with emojis
export const QUICK_ACTIONS = [
  {
    id: 'add_medication',
    title: '➕ Add Med',
    icon: 'plus-circle',
    emoji: '➕',
    color: '#4A90A4',
    screen: 'AddMedication',
  },
  {
    id: 'check_interactions',
    title: '🛡️ Check',
    icon: 'shield-check',
    emoji: '🛡️',
    color: '#7C5CBF',
    screen: 'InteractionChecker',
  },
  {
    id: 'ask_ai',
    title: '🤖 Ask AI',
    icon: 'robot',
    emoji: '🤖',
    color: '#4CAF50',
    screen: 'AIAssistant',
  },
];

// Common medication suggestions for quick input
export const MEDICATION_SUGGESTIONS = [
  { name: 'Aspirin', emoji: '💊', category: 'pain_relief' },
  { name: 'Ibuprofen', emoji: '💊', category: 'pain_relief' },
  { name: 'Acetaminophen', emoji: '💊', category: 'pain_relief' },
  { name: 'Paracetamol', emoji: '💊', category: 'pain_relief' },
  { name: 'Metformin', emoji: '💊', category: 'diabetes' },
  { name: 'Lisinopril', emoji: '❤️', category: 'cardiovascular' },
  { name: 'Amlodipine', emoji: '❤️', category: 'cardiovascular' },
  { name: 'Atorvastatin', emoji: '❤️', category: 'cardiovascular' },
  { name: 'Metoprolol', emoji: '❤️', category: 'cardiovascular' },
  { name: 'Omeprazole', emoji: '🍽️', category: 'digestive' },
  { name: 'Pantoprazole', emoji: '🍽️', category: 'digestive' },
  { name: 'Amoxicillin', emoji: '💊', category: 'antibiotics' },
  { name: 'Azithromycin', emoji: '💊', category: 'antibiotics' },
  { name: 'Cetirizine', emoji: '🤧', category: 'allergies' },
  { name: 'Loratadine', emoji: '🤧', category: 'allergies' },
  { name: 'Sertraline', emoji: '🧠', category: 'mental_health' },
  { name: 'Escitalopram', emoji: '🧠', category: 'mental_health' },
  { name: 'Alprazolam', emoji: '🧠', category: 'mental_health' },
  { name: 'Levothyroxine', emoji: '💜', category: 'hormones' },
  { name: 'Prednisone', emoji: '💜', category: 'hormones' },
  { name: 'Vitamin D', emoji: '✨', category: 'vitamins' },
  { name: 'Vitamin B12', emoji: '✨', category: 'vitamins' },
  { name: 'Multivitamin', emoji: '✨', category: 'vitamins' },
  { name: 'Albuterol', emoji: '🫁', category: 'respiratory' },
  { name: 'Fluticasone', emoji: '🫁', category: 'respiratory' },
];

// Quick dosage suggestions
export const DOSAGE_SUGGESTIONS = [
  { value: '5', label: '5mg', emoji: '💊' },
  { value: '10', label: '10mg', emoji: '💊' },
  { value: '25', label: '25mg', emoji: '💊' },
  { value: '50', label: '50mg', emoji: '💊' },
  { value: '100', label: '100mg', emoji: '💊' },
  { value: '200', label: '200mg', emoji: '💊' },
  { value: '250', label: '250mg', emoji: '💊' },
  { value: '500', label: '500mg', emoji: '💊' },
  { value: '1000', label: '1000mg', emoji: '💊' },
];

// AI Chat suggestion questions with emojis
export const AI_SUGGESTIONS = [
  { emoji: '❓', label: 'Side effects?', question: 'What are the common side effects of my medications?' },
  { emoji: '🍽️', label: 'Take with food?', question: 'Can I take my medications with food?' },
  { emoji: '⏰', label: 'Missed a dose?', question: 'What should I do if I miss a dose?' },
  { emoji: '🍷', label: 'Alcohol safe?', question: 'Can I drink alcohol while taking these medications?' },
  { emoji: '📦', label: 'How to store?', question: 'How should I store my medications?' },
  { emoji: '⚠️', label: 'What to avoid?', question: 'What should I avoid while taking these medications?' },
  { emoji: '⏱️', label: 'Best time?', question: 'When is the best time to take my medications?' },
  { emoji: '⚡', label: 'Interactions?', question: 'Are there any interactions between my medications?' },
  { emoji: '💊', label: 'Generic available?', question: 'Are there generic versions of my medications?' },
  { emoji: '🤰', label: 'Pregnancy safe?', question: 'Are my medications safe during pregnancy?' },
];

// Default app settings
export const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: false,
  themeMode: 'system', // 'light', 'dark', or 'system'
  fontSize: 'medium',
  hapticFeedback: true,
};

// Disclaimer text
export const DISCLAIMER = {
  short: '⚠️ This app provides general information and is not a substitute for professional medical advice.',
  full: '⚠️ MediCaffe provides general medication information powered by AI. This information is for educational purposes only and should not be considered medical advice. Always consult with a qualified healthcare provider before making any decisions about your medications. Never disregard professional medical advice or delay seeking it because of information provided by this app. If you have a medical emergency, call your local emergency services immediately.',
};

// Greeting messages with emojis based on time
export const GREETINGS = {
  morning: { text: 'Good Morning', emoji: '🌅' },
  afternoon: { text: 'Good Afternoon', emoji: '☀️' },
  evening: { text: 'Good Evening', emoji: '🌆' },
  night: { text: 'Good Night', emoji: '🌙' },
};

// Stats labels with emojis
export const STAT_LABELS = {
  medications: { label: 'Active\nMeds', emoji: '💊' },
  alerts: { label: 'Interaction\nAlerts', emoji: '⚠️' },
  checks: { label: 'Checks\nDone', emoji: '✅' },
};

// Empty state messages with emojis
export const EMPTY_STATES = {
  medications: {
    emoji: '💊',
    title: 'No Medications Yet',
    description: 'Add your medications to check for interactions and get AI-powered insights',
    action: '➕ Add Your First Medication',
  },
  interactions: {
    emoji: '🛡️',
    title: 'No Interactions Checked',
    description: 'Select medications to check for potential interactions',
    action: '🔍 Start Checking',
  },
  chat: {
    emoji: '🤖',
    title: 'Ask Me Anything',
    description: 'I can help you with questions about your medications, side effects, and more!',
  },
};
