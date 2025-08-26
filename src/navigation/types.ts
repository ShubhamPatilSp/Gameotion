import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';

export type MainStackParamList = {
  MainTabs: undefined;
  Settings: undefined;
  UserFeed: { userId: string };
  ProfileSetup: undefined;
  CreatePost: undefined;
  Conversation: { conversationId: string; title: string };
  CreateClan: undefined;
  Search: { clanId?: string }; // clanId is optional for inviting to a specific clan
  Profile: { userId?: string; clanId?: string };
};

export type TabParamList = {
  Home: undefined;
  Discover: undefined;
  Chat: undefined;
  Tournaments: undefined;
  Clans: undefined;
  Profile: undefined;
};

export type ClansScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export type CreatePostScreenProps = NativeStackScreenProps<MainStackParamList, 'CreatePost'>;
