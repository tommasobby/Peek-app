import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CAMERAS = [
  { name: 'Entrance', online: true },
  { name: 'Living room', online: true },
  { name: 'Kitchen', online: true },
  { name: 'Bedroom', online: false },
];

const RECENT = [
  { name: 'Keys', location: 'Kitchen', time: '2h ago' },
  { name: 'Phone', location: 'Living room', time: '45m ago' },
  { name: 'Remote', location: 'Living room', time: '1h ago' },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.greeting}>Good morning</Text>
          <Text style={s.title}>What are you{'\n'}looking for?</Text>
        </View>

        {/* Status pill */}
        <View style={s.pill}>
          <View style={s.liveDot} />
          <Text style={s.pillText}>All 4 cameras active</Text>
        </View>

        {/* Cameras */}
        <Text style={s.sectionLabel}>Cameras</Text>
        <View style={s.camGrid}>
          {CAMERAS.map((cam) => (
            <TouchableOpacity key={cam.name} style={[s.camCard, !cam.online && s.camCardOff]}>
              <View style={s.camDot}>
                <View style={[s.camDotInner, !cam.online && s.camDotOff]} />
              </View>
              <Text style={s.camName}>{cam.name}</Text>
              <Text style={[s.camStatus, !cam.online && s.camStatusOff]}>
                {cam.online ? 'Online' : 'Offline'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent */}
        <Text style={s.sectionLabel}>Recent</Text>
        {RECENT.map((item) => (
          <TouchableOpacity key={item.name} style={s.recentItem}>
            <View style={s.recentIconWrap}>
              <View style={s.recentDot} />
            </View>
            <View style={s.recentText}>
              <Text style={s.recentName}>{item.name}</Text>
              <Text style={s.recentSub}>Found in {item.location} · {item.time}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <View style={s.fabArea}>
        <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('Ask' as never)}>
          <Text style={s.fabText}>👁 Ask Peek</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0C' },
  scroll: { paddingTop: 64 },

  header: { paddingHorizontal: 24, marginBottom: 20 },
  greeting: { fontSize: 14, color: '#606068' },
  title: { fontSize: 28, fontWeight: '700', color: '#F2F2F4', marginTop: 4, lineHeight: 36, letterSpacing: -0.5 },

  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 24, marginBottom: 28,
    backgroundColor: 'rgba(110,231,183,0.06)',
    borderWidth: 1, borderColor: 'rgba(110,231,183,0.12)',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7' },
  pillText: { fontSize: 13, color: '#6EE7B7', fontWeight: '500' },

  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: '#606068',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginHorizontal: 24, marginBottom: 12,
  },

  camGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingHorizontal: 24, marginBottom: 32,
  },
  camCard: {
    width: '47%', backgroundColor: '#151518',
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  camCardOff: { opacity: 0.35 },
  camDot: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(110,231,183,0.1)', alignItems: 'center', justifyContent: 'center' },
  camDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6EE7B7' },
  camDotOff: { backgroundColor: '#606068' },
  camName: { fontSize: 14, fontWeight: '600', color: '#F2F2F4' },
  camStatus: { fontSize: 12, color: '#6EE7B7' },
  camStatusOff: { color: '#606068' },

  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 24, marginBottom: 10,
    backgroundColor: '#151518',
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  recentIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(110,231,183,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  recentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6EE7B7' },
  recentText: { flex: 1 },
  recentName: { fontSize: 14, fontWeight: '600', color: '#F2F2F4', marginBottom: 2 },
  recentSub: { fontSize: 12, color: '#A0A0AC' },
  chevron: { fontSize: 18, color: '#606068' },

  fabArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, paddingBottom: 44,
    backgroundColor: '#0A0A0C',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)',
  },
  fab: {
    backgroundColor: '#6EE7B7', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  fabText: { fontSize: 15, fontWeight: '700', color: '#0A0A0C' },
});