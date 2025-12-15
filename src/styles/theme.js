/**
 * MediCaffe Theme Configuration
 * 
 * Centralized styling constants for consistent UI throughout the app.
 * Supports light and dark mode with accessible contrast ratios.
 * Features emojis and interactive elements for better UX.
 */

// Light Mode Colors
export const LIGHT_COLORS = {
  // Primary brand colors - calming teal/medical theme
  primary: '#4A90A4',
  primaryDark: '#357A8C',
  primaryLight: '#6BA8B8',
  primarySoft: '#E8F4F7',
  
  // Secondary accent colors
  secondary: '#7C5CBF',
  secondaryLight: '#9B7ED9',
  secondaryDark: '#5D3E9E',
  
  // Gradient colors
  gradientStart: '#4A90A4',
  gradientEnd: '#7C5CBF',
  
  // Status colors for medication interactions
  success: '#4CAF50',
  successLight: '#E8F5E9',
  successDark: '#388E3C',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  warningDark: '#F57C00',
  danger: '#F44336',
  dangerLight: '#FFEBEE',
  dangerDark: '#D32F2F',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  infoDark: '#1976D2',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8FAFB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E0E6EA',
  borderLight: '#F0F3F5',
  divider: '#E8ECF0',
  
  // Text colors
  textPrimary: '#1A2B3C',
  textSecondary: '#5A6B7C',
  textTertiary: '#8A9BAC',
  textLight: '#FFFFFF',
  textDisabled: '#B8C4CE',
  textInverse: '#FFFFFF',
  
  // Interactive states
  ripple: 'rgba(74, 144, 164, 0.12)',
  highlight: 'rgba(74, 144, 164, 0.08)',
  pressed: 'rgba(74, 144, 164, 0.16)',
  
  // Special states
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shimmer: '#E8ECF0',
  
  // Card backgrounds
  cardPrimary: '#FFFFFF',
  cardSecondary: '#F8FAFB',
  cardAccent: '#E8F4F7',
};

// Dark Mode Colors
export const DARK_COLORS = {
  // Primary brand colors
  primary: '#6BB8CC',
  primaryDark: '#5AA8BC',
  primaryLight: '#8CCEDC',
  primarySoft: '#1A3640',
  
  // Secondary accent colors
  secondary: '#A78BDF',
  secondaryLight: '#C4ABEF',
  secondaryDark: '#8A6BC9',
  
  // Gradient colors
  gradientStart: '#6BB8CC',
  gradientEnd: '#A78BDF',
  
  // Status colors
  success: '#66BB6A',
  successLight: '#1B3D1E',
  successDark: '#81C784',
  warning: '#FFB74D',
  warningLight: '#3D2F1A',
  warningDark: '#FFCC80',
  danger: '#EF5350',
  dangerLight: '#3D1A1A',
  dangerDark: '#E57373',
  info: '#42A5F5',
  infoLight: '#1A2D3D',
  infoDark: '#64B5F6',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#0D1117',
  surface: '#161B22',
  surfaceElevated: '#21262D',
  border: '#30363D',
  borderLight: '#21262D',
  divider: '#30363D',
  
  // Text colors
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textTertiary: '#6E7681',
  textLight: '#FFFFFF',
  textDisabled: '#484F58',
  textInverse: '#0D1117',
  
  // Interactive states
  ripple: 'rgba(107, 184, 204, 0.16)',
  highlight: 'rgba(107, 184, 204, 0.08)',
  pressed: 'rgba(107, 184, 204, 0.24)',
  
  // Special states
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shimmer: '#21262D',
  
  // Card backgrounds
  cardPrimary: '#161B22',
  cardSecondary: '#0D1117',
  cardAccent: '#1A3640',
};

// Default to light mode colors (will be overridden by theme context)
export const COLORS = LIGHT_COLORS;

export const TYPOGRAPHY = {
  // Font families (using system fonts for performance)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font sizes following Material Design scale
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  
  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const SPACING = {
  // Spacing scale (4px base unit)
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BORDER_RADIUS = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

// App-wide emojis for consistent UI
export const EMOJIS = {
  // Navigation & Actions
  home: '🏠',
  add: '➕',
  check: '✅',
  search: '🔍',
  settings: '⚙️',
  profile: '👤',
  back: '←',
  next: '→',
  
  // Medications
  pill: '💊',
  capsule: '💊',
  tablet: '💊',
  injection: '💉',
  drops: '💧',
  inhaler: '🌬️',
  cream: '🧴',
  liquid: '🧪',
  vitamin: '✨',
  medicine: '🏥',
  
  // Status & Alerts
  warning: '⚠️',
  danger: '🚨',
  success: '✅',
  info: 'ℹ️',
  safe: '🛡️',
  alert: '🔔',
  
  // Interactions
  interaction: '⚡',
  noInteraction: '✨',
  severe: '🔴',
  moderate: '🟡',
  mild: '🟢',
  
  // Time & Schedule
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
  night: '🌙',
  clock: '⏰',
  calendar: '📅',
  
  // AI & Assistant
  robot: '🤖',
  brain: '🧠',
  sparkle: '✨',
  lightbulb: '💡',
  magic: '🪄',
  chat: '💬',
  
  // Categories
  heart: '❤️',
  pain: '🩹',
  allergy: '🤧',
  diabetes: '🩸',
  mental: '🧠',
  digestive: '🍽️',
  respiratory: '🫁',
  skin: '🧴',
  hormone: '💜',
  
  // Misc
  star: '⭐',
  fire: '🔥',
  wave: '👋',
  party: '🎉',
  coffee: '☕',
  love: '💙',
  shield: '🛡️',
  doctor: '👨‍⚕️',
  clipboard: '📋',
  note: '📝',
  trash: '🗑️',
  edit: '✏️',
  lock: '🔒',
  unlock: '🔓',
  refresh: '🔄',
  download: '📥',
  upload: '📤',
  send: '📤',
  thumbsUp: '👍',
  thumbsDown: '👎',
  question: '❓',
  help: '❔',
  food: '🍽️',
  water: '💧',
  sun: '☀️',
  moon: '🌙',
};

// Suggestion chips for quick actions
export const QUICK_SUGGESTIONS = {
  medications: [
    { emoji: '💊', label: 'Aspirin', value: 'Aspirin' },
    { emoji: '💊', label: 'Ibuprofen', value: 'Ibuprofen' },
    { emoji: '💊', label: 'Metformin', value: 'Metformin' },
    { emoji: '💊', label: 'Lisinopril', value: 'Lisinopril' },
    { emoji: '💊', label: 'Omeprazole', value: 'Omeprazole' },
    { emoji: '💊', label: 'Amlodipine', value: 'Amlodipine' },
    { emoji: '💊', label: 'Atorvastatin', value: 'Atorvastatin' },
    { emoji: '💊', label: 'Metoprolol', value: 'Metoprolol' },
    { emoji: '💊', label: 'Paracetamol', value: 'Paracetamol' },
    { emoji: '💊', label: 'Amoxicillin', value: 'Amoxicillin' },
  ],
  dosages: [
    { emoji: '💊', label: '5mg', value: '5' },
    { emoji: '💊', label: '10mg', value: '10' },
    { emoji: '💊', label: '25mg', value: '25' },
    { emoji: '💊', label: '50mg', value: '50' },
    { emoji: '💊', label: '100mg', value: '100' },
    { emoji: '💊', label: '250mg', value: '250' },
    { emoji: '💊', label: '500mg', value: '500' },
    { emoji: '💊', label: '1000mg', value: '1000' },
  ],
  questions: [
    { emoji: '❓', label: 'Side effects?', value: 'What are the common side effects of my medications?' },
    { emoji: '🍽️', label: 'Take with food?', value: 'Can I take my medications with food?' },
    { emoji: '⏰', label: 'Missed dose?', value: 'What should I do if I miss a dose?' },
    { emoji: '🍷', label: 'Alcohol safe?', value: 'Can I drink alcohol while taking these medications?' },
    { emoji: '📦', label: 'How to store?', value: 'How should I store my medications?' },
    { emoji: '⚠️', label: 'What to avoid?', value: 'What should I avoid while taking these medications?' },
    { emoji: '💊', label: 'Best time?', value: 'When is the best time to take my medications?' },
    { emoji: '⚡', label: 'Interactions?', value: 'Are there any interactions between my medications?' },
  ],
};

// Animation durations
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Export default theme object
export default {
  COLORS,
  LIGHT_COLORS,
  DARK_COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  EMOJIS,
  QUICK_SUGGESTIONS,
  ANIMATIONS,
};
