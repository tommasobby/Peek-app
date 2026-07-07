import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { PEEK_API } from '../config';

type PeekObject = { name: string; position: string; confidence: number; time: string };

export default function LastFoundScreen() {
  const [objects, setObjects] = useState<PeekObject[]>([]);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch(`${PEEK_API}/status`);
      const data = await res.json();
      setObjects(data.objects || []);
    } catch {
      setObjects([]);
    }
  }, []);

  useEffect(() => {
    loadStatus();
    const t = setInterval(loadStatus, 2000);
    return () => clearInterval(t);
  }, [loadStatus]);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.heroIcon}>
          <Feather name="eye" size={22} color="#6EE7B7" />
        </View>
        <View>
          <Text style={s.title}>Last Found</Text>
          <Text style={s.subtitle}>What Peek is seeing right now</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.feedCard}>
          <WebView
            source={{ html: `<body style="margin:0;background:#000;overflow:hidden;"><img src="${PEEK_API}/stream" style="width:100%;height:100%;object-fit:cover;"/></body>` }}
            style={s.feed}
            scrollEnabled={false}
            pointerEvents="none"
          />
          <View style={s.liveBadge}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>LIVE</Text>
          </View>
        </View>

        <Text style={s.sectionLabel}>Detected now</Text>
        {objects.length === 0 ? (
          <Text style={s.empty}>Nothing in view. Point the camera at something.</Text>
        ) : (
          objects.map((obj) => (
            <View key={obj.name} style={s.objCard}>
              <View style={s.objTop}>
                <Text style={s.objName}>{obj.name}</Text>
                <Text style={s.objConf}>{Math.round(obj.confidence * 100)}%</Text>
              </View>
              <Text style={s.objPos}>{obj.position} · last seen {obj.time}</Text>
              <View style={s.confTrack}>
                <View style={[s.confFill, { width: `${Math.round(obj.confidence * 100)}%` }]} />
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
  subtitle: { fontSize: 12, color: '#8B8B9A', marginTop: 2 },

  scroll: { padding: 24 },

  feedCard: {
    borderRadius: 18, overflow: 'hidden', marginBottom: 28,
    backgroundColor: '#000',
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  feed: { width: '100%', height: 240, backgroundColor: '#000' },
  liveBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8,
    paddingVertical: 5, paddingHorizontal: 10,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7' },
  liveText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1 },

  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: '#8B8B9A',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14,
  },
  empty: { color: '#606068', fontSize: 14 },

  objCard: {
    backgroundColor: '#1A1A1E', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  objTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  objName: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', textTransform: 'capitalize' },
  objConf: { fontSize: 14, fontWeight: '700', color: '#6EE7B7' },
  objPos: { fontSize: 13, color: '#8B8B9A', marginBottom: 12 },
  confTrack: { height: 5, borderRadius: 3, backgroundColor: '#2A2A2F', overflow: 'hidden' },
  confFill: { height: 5, borderRadius: 3, backgroundColor: '#6EE7B7' },
});