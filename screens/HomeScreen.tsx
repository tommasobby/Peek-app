import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { PEEK_API } from '../config';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch(`${PEEK_API}/ping`);
        const data = await res.json();
        if (active) setOnline(data.status === 'ok');
      } catch {
        if (active) setOnline(false);
      }
    };
    check();
    const t = setInterval(check, 5000);
    return () => { active = false; clearInterval(t); };
  }, []);

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.gear} onPress={() => navigation.navigate('Settings')}>
        <Feather name="settings" size={22} color="#8B8B9A" />
      </TouchableOpacity>

      <View style={s.center}>
        <Image source={require('../assets/logo.png')} style={s.logoImg} resizeMode="contain" />

        <Text style={s.headline}>Lost something? Just ask.</Text>
        <Text style={s.subtitle}>Peek watches your space using AI, privately, on your device.</Text>

        <View style={s.statusPill}>
          <View style={[s.statusDot, { backgroundColor: online ? '#6EE7B7' : '#606068' }]} />
          <Text style={[s.statusText, { color: online ? '#6EE7B7' : '#8B8B9A' }]}>
            {online === null ? 'Connecting to hub...' : online ? 'Hub connected' : 'Hub offline'}
          </Text>
        </View>

        <TouchableOpacity style={s.cta} onPress={() => navigation.navigate('Chat')} activeOpacity={0.85}>
          <Feather name="message-circle" size={18} color="#0E0E10" />
          <Text style={s.ctaText}>Ask Peek</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.footer}>On-device   ·   No cloud   ·   No data leaves your home</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0E10', paddingHorizontal: 32 },
  gear: { position: 'absolute', top: 60, right: 24, padding: 8, zIndex: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoImg: { width: 220, height: 80, marginBottom: 40 },
  headline: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#8B8B9A', textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 300 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#1A1A1E', borderRadius: 100,
    paddingVertical: 8, paddingHorizontal: 16, marginBottom: 32,
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '500' },
  cta: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#6EE7B7', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 40,
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#0E0E10' },
  footer: { fontSize: 12, color: '#606068', textAlign: 'center', paddingBottom: 40 },
});