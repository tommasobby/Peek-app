import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const PEEK_API = 'http://10.48.143.118:5000';

type PeekObject = {
  name: string;
  position: string;
  confidence: number;
  time: string;
};

export default function LastFoundScreen() {
  const [objects, setObjects] = useState<PeekObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${PEEK_API}/status`);
      const data = await res.json();
      setObjects(data.objects || []);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch {
      setObjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Last Found</Text>
        <Text style={s.subtitle}>Updated at {lastUpdate}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#6EE7B7" style={{ marginTop: 40 }} />
      ) : objects.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>👁</Text>
          <Text style={s.emptyTitle}>Nothing detected yet</Text>
          <Text style={s.emptyText}>Make sure the desktop app is running and the camera is active.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list}>
          {objects.map((obj) => (
            <View key={obj.name} style={s.card}>
              <View style={s.cardTop}>
                <View style={s.dot} />
                <Text style={s.objName}>{obj.name}</Text>
                <Text style={s.confidence}>{Math.round(obj.confidence * 100)}%</Text>
              </View>
              <Text style={s.position}>{obj.position}</Text>
              <Text style={s.time}>Last seen at {obj.time}</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
  subtitle: { fontSize: 12, color: '#606068', marginTop: 4 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#F2F2F4', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#606068', textAlign: 'center', lineHeight: 20 },

  list: { padding: 24, gap: 12 },
  card: {
    backgroundColor: '#1A1A1E', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6EE7B7' },
  objName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#F2F2F4', textTransform: 'capitalize' },
  confidence: { fontSize: 13, color: '#6EE7B7', fontWeight: '600' },
  position: { fontSize: 14, color: '#A0A0AC', marginBottom: 4 },
  time: { fontSize: 12, color: '#606068' },
});