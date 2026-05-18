import { useState, useRef } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

const PEEK_API = 'http://10.48.143.118:5000';

type Message = {
  id: string;
  role: 'user' | 'peek';
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  { id: '0', role: 'peek', text: "Hi! I'm Peek. Ask me where anything is — I'm watching your home." }
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

    try {
      const res = await fetch(`${PEEK_API}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      const peekMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'peek',
        text: data.response,
      };
      setMessages(prev => [...prev, peekMsg]);
    } catch (e) {
      const peekMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'peek',
        text: "Can't reach Peek hub. Make sure the desktop app is running on the same network.",
      };
      setMessages(prev => [...prev, peekMsg]);
    } finally {
      setIsTyping(false);
      listRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.header}>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Peek</Text>
          <View style={s.listeningRow}>
            <View style={s.liveDot} />
            <Text style={s.listeningText}>Listening</Text>
          </View>
        </View>
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
          <View style={s.bubblePeek}>
            <Text style={s.bubbleTextPeek}>···</Text>
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
          <Text style={s.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0C' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#F2F2F4' },
  listeningRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6EE7B7' },
  listeningText: { fontSize: 11, color: '#6EE7B7' },

  messageList: { padding: 20, gap: 10 },

  bubble: { maxWidth: '80%', borderRadius: 16, padding: 14, marginBottom: 4 },
  bubbleUser: { backgroundColor: '#6EE7B7', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubblePeek: { backgroundColor: '#151518', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: '#0A0A0C', fontWeight: '500' },
  bubbleTextPeek: { color: '#F2F2F4' },

  inputArea: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, paddingBottom: 36,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0A0A0C',
  },
  input: {
    flex: 1, backgroundColor: '#151518',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
    fontSize: 14, color: '#F2F2F4',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#6EE7B7', alignItems: 'center', justifyContent: 'center',
  },
  sendText: { fontSize: 18, fontWeight: '700', color: '#0A0A0C' },
});