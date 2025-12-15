/**
 * AI Assistant Screen
 * 
 * Interactive AI-powered Q&A interface for medication-related questions.
 * Features emojis, quick suggestions, and theme support.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, EMOJIS } from '../styles/theme';
import { AI_SUGGESTIONS, DISCLAIMER } from '../utils/constants';
import { Header, Card, LoadingSpinner } from '../components';
import { useApp } from '../context/AppContext';
import { useAI } from '../hooks';

// Suggested questions for users (using constants)
const SUGGESTED_QUESTIONS = AI_SUGGESTIONS;

const AIAssistantScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);
  
  const { activeMedications, chatHistory, refreshChatHistory, colors, isDarkMode } = useApp();
  const { askQuestion, loading, error, clearError } = useAI();
  
  // Local chat messages (combines history with current session)
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [typingAnim] = useState(new Animated.Value(0));

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
    
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Update messages when chatHistory changes
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-20);
      setMessages(recentMessages);
      scrollToBottom();
    }
  }, [chatHistory]);

  /**
   * Load chat history from storage
   */
  const loadChatHistory = async () => {
    await refreshChatHistory();
    // Messages will be updated via the useEffect above when chatHistory changes
  };

  /**
   * Scroll to bottom of chat
   */
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  /**
   * Send a message
   */
  const handleSend = async (questionText = inputText) => {
    if (!questionText.trim()) return;
    
    clearError();
    
    // Add user message to local state
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: questionText.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    scrollToBottom();
    
    try {
      // Get AI response
      const response = await askQuestion(questionText, activeMedications);
      
      // Add AI response to local state
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      scrollToBottom();
    } catch (err) {
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: 'Sorry, I couldn\'t process your question. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  /**
   * Handle suggested question tap
   */
  const handleSuggestedQuestion = (suggestion) => {
    handleSend(suggestion.question);
  };

  /**
   * Clear chat history
   */
  const handleClearChat = () => {
    setMessages([]);
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    userBubble: { backgroundColor: colors.primary },
    assistantBubble: { backgroundColor: colors.surface },
    userMessageText: { color: colors.textLight },
    assistantMessageText: { color: colors.textPrimary },
    inputContainer: { backgroundColor: colors.surface, borderColor: colors.border },
    textInput: { color: colors.textPrimary },
    disclaimer: { backgroundColor: colors.cardAccent },
    disclaimerText: { color: colors.textTertiary },
  };

  /**
   * Render a chat message
   */
  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    const isError = message.role === 'error';
    
    return (
      <Animated.View
        key={message.id || index}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={[
            styles.avatarContainer,
            { backgroundColor: isError ? colors.dangerLight : colors.secondaryLight + '30' },
          ]}>
            <Text style={styles.avatarEmoji}>{isError ? '❌' : '🤖'}</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? [styles.userBubble, dynamicStyles.userBubble] : [styles.assistantBubble, dynamicStyles.assistantBubble],
          isError && { backgroundColor: colors.dangerLight },
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? dynamicStyles.userMessageText : dynamicStyles.assistantMessageText,
            isError && { color: colors.danger },
          ]}>
            {message.content}
          </Text>
          <Text style={[styles.messageTime, { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textTertiary }]}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        
        {isUser && (
          <View style={[styles.userAvatarContainer, { backgroundColor: colors.primaryDark }]}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  /**
   * Render welcome/intro section
   */
  const renderWelcome = () => (
    <View style={styles.welcomeContainer}>
      <View style={[styles.welcomeIconContainer, { backgroundColor: colors.secondaryLight + '20' }]}>
        <Text style={styles.welcomeEmoji}>🤖</Text>
      </View>
      <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>✨ AI Medication Assistant</Text>
      <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
        Ask me anything about your medications! I can help with side effects,
        interactions, dosing guidelines, and more. 💊
      </Text>
      
      {activeMedications.length > 0 && (
        <View style={[styles.contextBadge, { backgroundColor: colors.infoLight }]}>
          <Text style={styles.contextEmoji}>💊</Text>
          <Text style={[styles.contextBadgeText, { color: colors.info }]}>
            I know about your {activeMedications.length} medication{activeMedications.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      <Text style={[styles.suggestionsTitle, { color: colors.textPrimary }]}>💡 Try asking:</Text>
      <View style={styles.suggestionsContainer}>
        {SUGGESTED_QUESTIONS.slice(0, 6).map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.suggestionChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleSuggestedQuestion(suggestion)}
          >
            <Text style={styles.suggestionEmoji}>{suggestion.emoji}</Text>
            <Text style={[styles.suggestionText, { color: colors.textPrimary }]}>{suggestion.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, dynamicStyles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Header
        title="🤖 AI Assistant"
        showBack
        onBackPress={() => navigation.goBack()}
        rightIcon={messages.length > 0 ? 'delete-outline' : undefined}
        onRightPress={messages.length > 0 ? handleClearChat : undefined}
      />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: SPACING.md },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          renderWelcome()
        ) : (
          <>
            {messages.map((message, index) => renderMessage(message, index))}
            
            {/* Loading indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.secondaryLight + '30' }]}>
                  <Text style={styles.avatarEmoji}>🤖</Text>
                </View>
                <View style={[styles.loadingBubble, { backgroundColor: colors.surface }]}>
                  <Text style={styles.thinkingEmoji}>💭</Text>
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Thinking...</Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
      
      {/* Input area */}
      <View style={[
        styles.inputContainer,
        dynamicStyles.inputContainer,
        { paddingBottom: keyboardVisible ? SPACING.sm : insets.bottom + SPACING.sm },
      ]}>
        {/* Quick suggestion chips when chat is active */}
        {messages.length > 0 && !loading && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickSuggestions}
            contentContainerStyle={styles.quickSuggestionsContent}
          >
            {SUGGESTED_QUESTIONS.slice(0, 4).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickSuggestionChip, { backgroundColor: colors.primarySoft }]}
                onPress={() => handleSuggestedQuestion(suggestion)}
              >
                <Text style={styles.quickChipEmoji}>{suggestion.emoji}</Text>
                <Text style={[styles.quickSuggestionText, { color: colors.primary }]} numberOfLines={1}>
                  {suggestion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        <View style={[styles.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TextInput
            ref={inputRef}
            style={[styles.textInput, dynamicStyles.textInput]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="💬 Ask about your medications..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
              (!inputText.trim() || loading) && [styles.sendButtonDisabled, { backgroundColor: colors.border }],
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || loading}
          >
            <Text style={styles.sendEmoji}>{inputText.trim() && !loading ? '📤' : '💤'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Disclaimer */}
      <View style={[styles.disclaimer, dynamicStyles.disclaimer, { paddingBottom: insets.bottom > 0 ? 0 : SPACING.xs }]}>
        <Text style={[styles.disclaimerText, dynamicStyles.disclaimerText]}>
          ⚠️ AI responses are for informational purposes only. Always consult your healthcare provider.
        </Text>
      </View>
    </KeyboardAvoidingView>
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
  
  // Welcome section
  welcomeContainer: {
    alignItems: 'center',
    paddingTop: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
  },
  welcomeIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeEmoji: {
    fontSize: 48,
  },
  welcomeTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    marginBottom: SPACING.lg,
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.xl,
  },
  contextEmoji: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  contextBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  suggestionsTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  suggestionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  suggestionEmoji: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  suggestionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    flex: 1,
  },
  
  // Message styles
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  userAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
  },
  userBubble: {
    borderBottomRightRadius: BORDER_RADIUS.xs,
  },
  assistantBubble: {
    borderBottomLeftRadius: BORDER_RADIUS.xs,
    ...SHADOWS.sm,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
  },
  messageTime: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
  
  // Loading state
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xs,
    ...SHADOWS.sm,
  },
  thinkingEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  
  // Input area
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },
  quickSuggestions: {
    marginBottom: SPACING.sm,
  },
  quickSuggestionsContent: {
    paddingRight: SPACING.base,
  },
  quickSuggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  quickChipEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  quickSuggestionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.base,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendEmoji: {
    fontSize: 18,
  },
  
  // Disclaimer
  disclaimer: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  disclaimerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
});

export default AIAssistantScreen;
