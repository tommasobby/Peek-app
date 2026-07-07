import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { PEEK_API } from '../config';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${PEEK_API}/ping`)
      .then(r => r.json())
      .then(d => setOnline(d.status === 'ok'))
      .catch(() => setOnline(false));
  }, []);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={s.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.sectionLabel}>Connection</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.rowLabel}>Hub address</Text>
            <Text style={s.rowValue}>{PEEK_API.replace('http://', '')}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.rowLabel}>Status</Text>
            <View style={s.statusRow}>
              <View style={[s.dot, { backgroundColor: online ? '#6EE7B7' : '#606068' }]} />
              <Text style={[s.rowValue, { color: online ? '#6EE7B7' : '#8B8B9A' }]}>
                {online === null ? 'Checking...' : online ? 'Connected' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={s.sectionLabel}>Privacy</Text>
        <View style={s.card}>
          <Text style={s.privacyText}>
            Peek runs entirely on your device and your hub. No video, no images and no detections
            ever leave your home network. There is no cloud and no account.
          </Text>
        </View>

        <Text style={s.sectionLabel}>About</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.rowLabel}>Version</Text>
            <Text style={s.rowValue}>0.1 · prototype</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.rowLabel}>Made by</Text>
            <Text style={s.rowValue}>Sorrisino · Elisava</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0E10' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingTop: 64, paddingHorizontal: 24, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: '#2A2A2F',
  },
  back: { padding: 4 },
  title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },

  scroll: { padding: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: '#8B8B9A',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, marginTop: 8,
  },
  card: {
    backgroundColor: '#1A1A1E', borderRadius: 16, padding: 18, marginBottom: 24,
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { fontSize: 14, color: '#8B8B9A' },
  rowValue: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#2A2A2F', marginVertical: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  privacyText: { fontSize: 14, color: '#A0A0AC', lineHeight: 21 },
});