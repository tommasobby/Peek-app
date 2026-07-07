import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, Image, ActivityIndicator, RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PEEK_API } from '../config';

type Snapshot = { id: string; filename: string; time: string; url: string };

export default function GalleryScreen() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Snapshot | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${PEEK_API}/snapshots`);
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch {
      setSnapshots([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.heroIcon}>
          <Feather name="image" size={22} color="#6EE7B7" />
        </View>
        <View>
          <Text style={s.title}>Gallery</Text>
          <Text style={s.subtitle}>Snapshots saved during your sessions.</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#6EE7B7" style={{ marginTop: 60 }} />
      ) : snapshots.length === 0 ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <Feather name="image" size={28} color="#6EE7B7" />
          </View>
          <Text style={s.emptyTitle}>No snapshots yet</Text>
          <Text style={s.emptyText}>Snapshots are saved automatically when Peek finds an object.</Text>
        </View>
      ) : (
        <FlatList
          data={snapshots}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={s.grid}
          columnWrapperStyle={{ gap: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6EE7B7" />
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={s.thumb} onPress={() => setSelected(item)} activeOpacity={0.8}>
              <Image source={{ uri: item.url }} style={s.thumbImg} resizeMode="cover" />
              <Text style={s.thumbTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!selected} transparent animationType="fade">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
          {selected && (
            <View style={s.modalCard}>
              <Image source={{ uri: selected.url }} style={s.modalImg} resizeMode="contain" />
              <View style={s.modalFooter}>
                <View style={s.recDot} />
                <Text style={s.modalTime}>{selected.time}</Text>
              </View>
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

  grid: { padding: 24, gap: 12 },
  thumb: {
    flex: 1, backgroundColor: '#1A1A1E',
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  thumbImg: { width: '100%', height: 140 },
  thumbTime: { fontSize: 11, color: '#8B8B9A', padding: 10, textAlign: 'center' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 20, marginBottom: 16,
    backgroundColor: 'rgba(110,231,183,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#606068', textAlign: 'center', lineHeight: 20 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.88)', alignItems: 'center', justifyContent: 'center' },
  modalCard: {
    width: '90%', backgroundColor: '#1A1A1E',
    borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: '#2A2A2F',
  },
  modalImg: { width: '100%', height: 320 },
  modalFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 },
  recDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7' },
  modalTime: { fontSize: 13, color: '#8B8B9A' },
});