import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PEEK_API } from '../config';

const QUICK_ADD = ['keys', 'wallet', 'phone', 'glasses', 'sunglasses', 'headphones', 'charger', 'backpack', 'bottle', 'remote'];

type WatchItem = { name: string; added?: string };

export default function WatchlistScreen() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${PEEK_API}/watchlist`);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // hub not reachable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addItem = async (rawName: string) => {
    const name = rawName.toLowerCase().trim();
    if (!name) return;
    if (items.find(i => i.name === name)) { setInput(''); return; }
    setItems(prev => [...prev, { name }]);
    setInput('');
    try {
      const res = await fetch(`${PEEK_API}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch {}
  };

  const removeItem = async (name: string) => {
    setItems(prev => prev.filter(i => i.name !== name));
    try {
      await fetch(`${PEEK_API}/watchlist/${encodeURIComponent(name)}`, { method: 'DELETE' });
    } catch {}
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.heroIcon}>
          <Feather name="shield" size={22} color="#6EE7B7" />
        </View>
        <View>
          <Text style={s.title}>Watchlist</Text>
          <Text style={s.subtitle}>Peek will alert you as soon as it spots these.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={s.sectionLabel}>Quick add</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={s.pillsRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 24 }}>
          {QUICK_ADD.map(obj => {
            const already = items.find(i => i.name === obj);
            return (
              <TouchableOpacity
                key={obj}
                style={[s.pill, already && s.pillActive]}
                onPress={() => addItem(obj)}
                disabled={!!already}
              >
                <Text style={[s.pillText, already && s.pillTextActive]}>
                  {already ? obj : `+ ${obj}`}
                </Text>
              </TouchableOpacity>
            );
          })}
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
            autoCapitalize="none"
          />
          <TouchableOpacity style={s.addBtn} onPress={() => addItem(input)}>
            <Feather name="plus" size={22} color="#0E0E10" />
          </TouchableOpacity>
        </View>

        <Text style={s.sectionLabel}>Watching for</Text>
        {loading ? (
          <ActivityIndicator color="#6EE7B7" style={{ marginTop: 20 }} />
        ) : items.length === 0 ? (
          <Text style={s.empty}>Nothing yet. Add an object above.</Text>
        ) : (
          items.map(item => (
            <View key={item.name} style={s.item}>
              <View style={s.itemLeft}>
                <View style={s.itemIcon}>
                  <View style={s.itemDot} />
                </View>
                <View>
                  <Text style={s.itemName}>{item.name}</Text>
                  {item.added ? <Text style={s.itemSub}>Added {item.added}</Text> : null}
                </View>
              </View>
              <View style={s.itemRight}>
                <View style={s.watchingBadge}>
                  <Text style={s.watchingText}>watching</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.name)} style={s.removeBtn}>
                  <Feather name="x" size={16} color="#606068" />
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
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: 64, paddingHorizontal: 24, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: '#2A2A2F',
  },
  heroIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(110,231,183,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(110,231,183,0.2)',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: '#8B8B9A', marginTop: 2, maxWidth: 240 },

  scroll: { paddingTop: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: '#8B8B9A',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginHorizontal: 24, marginBottom: 12,
  },

  pillsRow: { marginBottom: 24 },
  pill: {
    backgroundColor: '#1A1A1E', borderRadius: 100,
    paddingVertical: 8, paddingHorizontal: 16,
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  pillActive: { backgroundColor: 'rgba(110,231,183,0.1)', borderColor: 'rgba(110,231,183,0.3)' },
  pillText: { fontSize: 13, color: '#8B8B9A' },
  pillTextActive: { color: '#6EE7B7', textTransform: 'capitalize' },

  inputRow: { flexDirection: 'row', gap: 10, marginHorizontal: 24, marginBottom: 28 },
  input: {
    flex: 1, backgroundColor: '#1A1A1E',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
    fontSize: 14, color: '#FFFFFF',
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  addBtn: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#6EE7B7', alignItems: 'center', justifyContent: 'center',
  },

  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 24, marginBottom: 10,
    backgroundColor: '#1A1A1E', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(110,231,183,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  itemDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6EE7B7' },
  itemName: { fontSize: 15, fontWeight: '500', color: '#FFFFFF', textTransform: 'capitalize' },
  itemSub: { fontSize: 11, color: '#606068', marginTop: 2 },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  watchingBadge: {
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10,
    borderWidth: 1, borderColor: 'rgba(110,231,183,0.2)',
  },
  watchingText: { fontSize: 11, color: '#6EE7B7', fontWeight: '600' },
  removeBtn: { padding: 4 },
  empty: { fontSize: 14, color: '#606068', marginHorizontal: 24 },
});