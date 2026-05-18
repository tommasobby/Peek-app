import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from 'react-native';

const QUICK_ADD = ['keys', 'wallet', 'phone', 'glasses', 'sunglasses', 'headphones', 'charger', 'backpack', 'bottle', 'remote'];

type WatchItem = {
  id: string;
  name: string;
};

export default function WatchlistScreen() {
  const [items, setItems] = useState<WatchItem[]>([
    { id: '1', name: 'glasses' },
    { id: '2', name: 'wallet' },
  ]);
  const [input, setInput] = useState('');

  const addItem = (name: string) => {
    if (!name.trim()) return;
    if (items.find(i => i.name === name.toLowerCase())) return;
    setItems(prev => [...prev, { id: Date.now().toString(), name: name.toLowerCase().trim() }]);
    setInput('');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Watchlist</Text>
        <Text style={s.subtitle}>Peek will alert you when it spots these.</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={s.sectionLabel}>Quick add</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillsRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 24 }}>
          {QUICK_ADD.map(obj => (
            <TouchableOpacity key={obj} style={s.pill} onPress={() => addItem(obj)}>
              <Text style={s.pillText}>+ {obj}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="Add custom object..."
            placeholderTextColor="#606068"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => addItem(input)}
            returnKeyType="done"
          />
          <TouchableOpacity style={s.addBtn} onPress={() => addItem(input)}>
            <Text style={s.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.sectionLabel}>Watching for</Text>
        {items.length === 0 ? (
          <Text style={s.empty}>No items yet. Add something above.</Text>
        ) : (
          items.map(item => (
            <View key={item.id} style={s.item}>
              <View style={s.itemLeft}>
                <View style={s.dot} />
                <Text style={s.itemName}>{item.name}</Text>
              </View>
              <View style={s.itemRight}>
                <View style={s.watchingBadge}>
                  <Text style={s.watchingText}>watching</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={s.removeBtn}>
                  <Text style={s.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0E10' },
  header: {
    paddingTop: 64, paddingHorizontal: 24, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  title: { fontSize: 26, fontWeight: '700', color: '#F2F2F4', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#606068', marginTop: 4 },
  scroll: { paddingTop: 24 },

  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: '#606068',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginHorizontal: 24, marginBottom: 12,
  },

  pillsRow: { marginBottom: 24 },
  pill: {
    backgroundColor: '#1A1A1E', borderRadius: 100,
    paddingVertical: 8, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  pillText: { fontSize: 13, color: '#A0A0AC' },

  inputRow: {
    flexDirection: 'row', gap: 10,
    marginHorizontal: 24, marginBottom: 28,
  },
  input: {
    flex: 1, backgroundColor: '#1A1A1E',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
    fontSize: 14, color: '#F2F2F4',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  addBtn: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#6EE7B7', alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 24, fontWeight: '600', color: '#0E0E10' },

  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 24, marginBottom: 10,
    backgroundColor: '#1A1A1E', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6EE7B7' },
  itemName: { fontSize: 15, fontWeight: '500', color: '#F2F2F4', textTransform: 'capitalize' },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  watchingBadge: {
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10,
    borderWidth: 1, borderColor: 'rgba(110,231,183,0.2)',
  },
  watchingText: { fontSize: 11, color: '#6EE7B7', fontWeight: '600' },
  removeBtn: { padding: 4 },
  removeText: { fontSize: 14, color: '#606068' },
  empty: { fontSize: 14, color: '#606068', marginHorizontal: 24 },
});