import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntryScreen from '@/screens/Onboarding/EntryScreen';
import PreferencesScreen from '@/screens/Onboarding/PreferencesScreen';
import ProfileSetupScreen from '@/screens/Onboarding/ProfileSetupScreen';
import { useProfile } from '@/store/profile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedScreen from '@/screens/FeedScreen';
import DiscoverScreen from '@/screens/DiscoverScreen';
import ChatScreen from '@/screens/ChatScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import TournamentsScreen from '@/screens/TournamentsScreen';
import ClansScreen from '@/screens/ClansScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import UserFeedScreen from '@/screens/UserFeedScreen';
import { gamerTheme } from '@/theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: gamerTheme.colors.background,
    card: gamerTheme.colors.surface,
    text: gamerTheme.colors.textPrimary,
    primary: gamerTheme.colors.primary,
    border: gamerTheme.colors.border,
    notification: gamerTheme.colors.accent,
  },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: gamerTheme.colors.surface, borderTopColor: gamerTheme.colors.border },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarActiveTintColor: gamerTheme.colors.primary,
        tabBarInactiveTintColor: gamerTheme.colors.textSecondary,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const map: Record<string, string> = {
            Home: 'home-outline',
            Discover: 'magnify',
            Chat: 'chat-outline',
            Tournaments: 'trophy-outline',
            Clans: 'account-group-outline',
            Profile: 'account-circle-outline',
          };
          const name = map[route.name] ?? 'circle';
          return <Icon name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={FeedScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Tournaments" component={TournamentsScreen} />
      <Tab.Screen name="Clans" component={ClansScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainAppStack() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={Tabs} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="UserFeed" component={UserFeedScreen} />
    </MainStack.Navigator>
  );
}

export default function App() {
  const onboarded = useProfile((s) => s.onboarded);
  const hydrate = useProfile((s) => s.hydrate);
  React.useEffect(() => { hydrate(); }, [hydrate]);
  const queryClient = React.useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={navTheme}>
        <StatusBar barStyle="light-content" />
        {!onboarded ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Entry" component={EntryScreen} />
            <Stack.Screen name="Preferences" component={PreferencesScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="AppTabs" component={Tabs} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        ) : (
          <MainAppStack />
        )}
      </NavigationContainer>
    </QueryClientProvider>
  );
}


