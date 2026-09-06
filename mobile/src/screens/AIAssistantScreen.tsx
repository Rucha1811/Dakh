import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { sendAIChat, ChatMessage } from '../api/client';

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am Daksh, your Niryat Saathi AI export assistant. Ask me anything about Dak Ghar Niryat Kendra (DNK), export documents (IEC, CoO, PBE-III), packaging, or international customs!',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>('en');
  const [loading, setLoading] = useState(false);
  const [suggestedDocs, setSuggestedDocs] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickQuestions = [
    'How to register on DNK?',
    'What documents for handicrafts to Germany?',
    'PBE-III vs PBE-IV difference?',
    'How to get IEC Code?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const newHistory: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newHistory);
    setInputText('');
    setLoading(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await sendAIChat(text, messages, language);
      setMessages([...newHistory, { role: 'assistant', content: response.reply }]);
      if (response.suggestedDocuments) {
        setSuggestedDocs(response.suggestedDocuments);
      }
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please check your network or try again.',
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Language Selector Bar */}
      <View style={styles.langBar}>
        <Text style={styles.langLabel}>Select Language:</Text>
        <View style={styles.langPills}>
          <TouchableOpacity
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, language === 'hi' && styles.langBtnActive]}
            onPress={() => setLanguage('hi')}
          >
            <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>
              हिन्दी (Hindi)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, language === 'gu' && styles.langBtnActive]}
            onPress={() => setLanguage('gu')}
          >
            <Text style={[styles.langText, language === 'gu' && styles.langTextActive]}>
              ગુજરાતી (Gujarati)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <View
              key={idx}
              style={[
                styles.msgBubble,
                isUser ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={[styles.msgRole, isUser ? styles.userRole : styles.assistantRole]}>
                {isUser ? 'You' : '🤖 Daksh AI (Niryat Saathi)'}
              </Text>
              <Text style={[styles.msgText, isUser ? styles.userText : styles.assistantText]}>
                {msg.content}
              </Text>
            </View>
          );
        })}

        {loading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color="#C62828" />
            <Text style={styles.loadingText}>Daksh AI is consulting export rules...</Text>
          </View>
        )}

        {/* Suggested Docs Box */}
        {suggestedDocs.length > 0 && (
          <View style={styles.suggestedBox}>
            <Text style={styles.suggestedTitle}>📄 Recommended Export Documents:</Text>
            {suggestedDocs.map((doc, i) => (
              <Text key={i} style={styles.suggestedDocItem}>• {doc}</Text>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Quick Questions Pills */}
      <View style={styles.quickScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
          {quickQuestions.map((q, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickPill}
              onPress={() => handleSend(q)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Daksh AI in English, Hindi, or Gujarati..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  langLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  langPills: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  langBtnActive: {
    backgroundColor: '#102A43',
  },
  langText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  msgBubble: {
    borderRadius: 16,
    padding: 14,
    maxWidth: '88%',
  },
  userBubble: {
    backgroundColor: '#102A43',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  msgRole: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    color: '#93C5FD',
  },
  assistantRole: {
    color: '#C62828',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#1E293B',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  suggestedBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  suggestedTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  suggestedDocItem: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
  },
  quickScrollContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
  },
  quickScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickPill: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quickText: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    maxHeight: 90,
  },
  sendButton: {
    backgroundColor: '#C62828',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
