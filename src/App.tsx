import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, ActivityIndicator, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@/screens/Auth/WelcomeScreen';
import SignUpScreen from '@/screens/Auth/SignUpScreen';
import LoginScreen from '@/screens/Auth/LoginScreen';
import ProfileSetupScreen from '@/screens/Onboarding/ProfileSetupScreen';
import PreferencesScreen from '@/screens/Onboarding/PreferencesScreen';
import { useAuth } from '@/store/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedScreen from '@/screens/FeedScreen';
import DiscoverScreen from '@/screens/DiscoverScreen';
import ChatScreen from '@/screens/ChatScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import TournamentsScreen from '@/screens/TournamentsScreen';
import ClansScreen from '@/screens/ClansScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import UserFeedScreen from '@/screens/UserFeedScreen';
import CreatePostScreen from '@/screens/CreatePostScreen';
import ConversationScreen from '@/screens/ConversationScreen';
import CreateClanScreen from '@/screens/CreateClanScreen';
import { gamerTheme } from '@/styles/gamer_theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainStackParamList } from './navigation/types';
import SearchScreen from '@/screens/SearchScreen';
import NotificationsScreen from '@/screens/NotificationsScreen';

const AuthStackNav = createNativeStackNavigator();
const OnboardingStackNav = createNativeStackNavigator();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: gamerTheme.colors.background,
    card: gamerTheme.colors.surface,
    text: gamerTheme.colors.textPrimary,
    primary: gamerTheme.colors.primary,
    border: gamerTheme.colors.border,
  },
};

function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStackNav.Screen name="SignUp" component={SignUpScreen} />
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
    </AuthStackNav.Navigator>
  );
}

function OnboardingStack() {
  return (
    <OnboardingStackNav.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStackNav.Screen name="Preferences" component={PreferencesScreen} />
      <OnboardingStackNav.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </OnboardingStackNav.Navigator>
  );
}


function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: gamerTheme.colors.surface, borderTopColor: gamerTheme.colors.border },
        tabBarActiveTintColor: gamerTheme.colors.primary,
        tabBarInactiveTintColor: gamerTheme.colors.textSecondary,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const map: { [key: string]: string } = {
            Home: 'home-variant',
            Discover: 'compass',
            Chat: 'message-text',
            Tournaments: 'trophy',
            Clans: 'account-group',
            Profile: 'account-circle',
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
      <MainStack.Screen name="CreatePost" component={CreatePostScreen} />
      <MainStack.Screen name="Conversation" component={ConversationScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="CreateClan" component={CreateClanScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Search" component={SearchScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
    </MainStack.Navigator>
  );
}

export default function App() {
  const { token, user, hydrated, hydrate } = useAuth((s) => s);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  const queryClient = React.useMemo(() => new QueryClient(), []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={navTheme}>
        <StatusBar barStyle="light-content" />
        {!token ? (
          <AuthStack />
        ) : !user?.onboarded ? (
          <OnboardingStack />
        ) : (
          <MainAppStack />
        )}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
