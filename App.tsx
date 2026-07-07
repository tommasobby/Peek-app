import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import AskScreen from './screens/AskScreen';
import LastFoundScreen from './screens/LastFoundScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import GalleryScreen from './screens/GalleryScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0E0E10',
          borderTopColor: '#2A2A2F',
          height: 80,
          paddingTop: 8,
          paddingBottom: 18,
        },
        tabBarActiveTintColor: '#6EE7B7',
        tabBarInactiveTintColor: '#606068',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Feather name="home" size={size ?? 22} color={color} /> }} />
      <Tab.Screen name="Chat" component={AskScreen}
        options={{ tabBarLabel: 'Chat', tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size ?? 22} color={color} /> }} />
      <Tab.Screen name="LastFound" component={LastFoundScreen}
        options={{ tabBarLabel: 'Last Found', tabBarIcon: ({ color, size }) => <Feather name="eye" size={size ?? 22} color={color} /> }} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen}
        options={{ tabBarLabel: 'Watchlist', tabBarIcon: ({ color, size }) => <Feather name="shield" size={size ?? 22} color={color} /> }} />
      <Tab.Screen name="Gallery" component={GalleryScreen}
        options={{ tabBarLabel: 'Gallery', tabBarIcon: ({ color, size }) => <Feather name="image" size={size ?? 22} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}