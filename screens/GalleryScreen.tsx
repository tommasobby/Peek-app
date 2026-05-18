import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, Image, ActivityIndicator
} from 'react-native';

const PEEK_API = 'http://10.48.143.118:5000';

type Snapshot = {
  id: string;
  filename: string;
  time: string;
  url: string;
};

export default function GalleryScreen() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Snapshot | null>(null);

  const fetchSnapshots = async () => {
    try {
      const res = await fetch(`${PEEK_API}/snapshots`);
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch {
      setSnapshots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, []);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Gallery</Text>
        <Text style={s.subtitle}>Snapshots saved during your session.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#6EE7B7" style={{ marginTop: 40 }} />
      ) : snapshots.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🖼</Text>
          <Text style={s.emptyTitle}>No snapshots yet</Text>
          <Text style={s.emptyText}>Snapshots are saved automatically when Peek detects an object.</Text>
        </View>
      ) : (
        <FlatList
          data={snapshots}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={s.grid}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.thumb} onPress={() => setSelected(item)}>
              <Image source={{ uri: item.url }} style={s.thumbImg} resizeMode="cover" />
              <Text style={s.thumbTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!selected} transparent animationType="fade">
        <TouchableOpacity style={s.overlay} onPress={() => setSelected(null)}>
          {selected && (
            <View style={s.modalCard}>
              <Image source={{ uri: selected.url }} style={s.modalImg} resizeMode="contain" />
              <Text style={s.modalTime}>{selected.time}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
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

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#F2F2F4', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#606068', textAlign: 'center', lineHeight: 20 },

  grid: { padding: 24, gap: 12 },
  thumb: {
    flex: 1, backgroundColor: '#1A1A1E',
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  thumbImg: { width: '100%', height: 140 },
  thumbTime: { fontSize: 11, color: '#606068', padding: 8, textAlign: 'center' },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCard: {
    width: '90%', backgroundColor: '#1A1A1E',
    borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  modalImg: { width: '100%', height: 300 },
  modalTime: { fontSize: 13, color: '#606068', padding: 16, textAlign: 'center' },
});