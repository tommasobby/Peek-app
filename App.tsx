import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import AskScreen from './screens/AskScreen';
import LastFoundScreen from './screens/LastFoundScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import GalleryScreen from './screens/GalleryScreen';

const Tab = createBottomTabNavigator();

function Icon({ label }: { label: string }) {
  return <Text style={{ fontSize: 18 }}>{label}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0E0E10',
            borderTopColor: 'rgba(255,255,255,0.06)',
            height: 72,
            paddingBottom: 12,
          },
          tabBarActiveTintColor: '#6EE7B7',
          tabBarInactiveTintColor: '#606068',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen}
          options={{ tabBarIcon: () => <Icon label="⌂" />, tabBarLabel: 'Home' }} />
        <Tab.Screen name="Chat" component={AskScreen}
          options={{ tabBarIcon: () => <Icon label="💬" />, tabBarLabel: 'Chat' }} />
        <Tab.Screen name="LastFound" component={LastFoundScreen}
          options={{ tabBarIcon: () => <Icon label="👁" />, tabBarLabel: 'Last Found' }} />
        <Tab.Screen name="Watchlist" component={WatchlistScreen}
          options={{ tabBarIcon: () => <Icon label="🛡" />, tabBarLabel: 'Watchlist' }} />
        <Tab.Screen name="Gallery" component={GalleryScreen}
          options={{ tabBarIcon: () => <Icon label="🖼" />, tabBarLabel: 'Gallery' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}