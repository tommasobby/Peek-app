import { useState, useRef } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PEEK_API } from '../config';

type Message = {
  id: string;
  role: 'user' | 'peek';
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  { id: '0', role: 'peek', text: "Hi! I'm Peek. Ask me where anything is. I'm watching your home." }
];

export default function AskScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    const query = input.trim();
    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const started = Date.now();
    let answer = '';
    try {
      const res = await fetch(`${PEEK_API}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      answer = data.response;
    } catch {
      answer = "Can't reach Peek hub. Make sure the desktop app is running on the same network.";
    }

    const elapsed = Date.now() - started;
    const minThink = 800;
    if (elapsed < minThink) {
      await new Promise(r => setTimeout(r, minThink - elapsed));
    }

    const peekMsg: Message = { id: (Date.now() + 1).toString(), role: 'peek', text: answer };
    setMessages(prev => [...prev, peekMsg]);
    setIsTyping(false);
    listRef.current?.scrollToEnd({ animated: true });
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.heroIcon}>
            <Feather name="message-circle" size={22} color="#6EE7B7" />
          </View>
          <View>
            <Text style={s.headerTitle}>Chat with Peek</Text>
            <View style={s.listeningRow}>
              <View style={s.liveDot} />
              <Text style={s.listeningText}>Listening</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={s.clearBtn} onPress={clearChat}>
          <Feather name="trash-2" size={14} color="#8B8B9A" />
          <Text style={s.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={s.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[s.bubble, item.role === 'user' ? s.bubbleUser : s.bubblePeek]}>
            <Text style={[s.bubbleText, item.role === 'user' ? s.bubbleTextUser : s.bubbleTextPeek]}>
              {item.text}
            </Text>
          </View>
        )}
        ListFooterComponent={isTyping ? (
          <View style={[s.bubble, s.bubblePeek]}>
            <Text style={s.bubbleTextPeek}>· · ·</Text>
          </View>
        ) : null}
      />

      <View style={s.inputArea}>
        <TextInput
          style={s.input}
          placeholder="Ask Peek anything..."
          placeholderTextColor="#606068"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity style={s.sendBtn} onPress={send}>
          <Feather name="arrow-up" size={20} color="#0E0E10" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0E10' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#2A2A2F',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(110,231,183,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(110,231,183,0.2)',
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  listeningRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6EE7B7' },
  listeningText: { fontSize: 11, color: '#6EE7B7' },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 1, borderColor: '#2A2A2F',
    backgroundColor: '#1A1A1E',
  },
  clearText: { fontSize: 13, color: '#8B8B9A', fontWeight: '500' },

  messageList: { padding: 20, gap: 10 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 14, marginBottom: 4 },
  bubbleUser: { backgroundColor: '#6EE7B7', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubblePeek: {
    backgroundColor: '#1A1A1E', alignSelf: 'flex-start', borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: '#0E0E10', fontWeight: '500' },
  bubbleTextPeek: { color: '#FFFFFF' },

  inputArea: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, paddingBottom: 36,
    borderTopWidth: 1, borderTopColor: '#2A2A2F',
    backgroundColor: '#0E0E10',
  },
  input: {
    flex: 1, backgroundColor: '#1A1A1E',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
    fontSize: 14, color: '#FFFFFF',
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#6EE7B7', alignItems: 'center', justifyContent: 'center',
  },
});