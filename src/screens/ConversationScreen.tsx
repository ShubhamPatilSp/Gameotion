import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { gamerTheme } from '@/theme/theme';
import { listMessages, Message } from '@/api/chat';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/store/auth';
import { MainStackParamList } from '@/App';

export default function ConversationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { conversationId, title } = route.params as MainStackParamList['Conversation'];
  const user = useAuth((s) => s.user);
  const queryClient = useQueryClient();
  const { socket, sendMessage } = useSocket(conversationId);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => listMessages(conversationId),
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversationId: string; message: Message }) => {
      if (data.conversationId === conversationId) {
        // Add the new message to the cache
        queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
          if (old?.find((m) => m.id === data.message.id)) return old; // Avoid duplicates
          return [...(old || []), data.message];
        });
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, conversationId, queryClient]);

  const handleSend = () => {
    if (text.trim() === '' || !user) return;

    const message: Message = {
      id: `temp-${Date.now()}`,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      user: user,
    };

    // Optimistically update the UI
    queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => [...(old || []), message]);

    // Send the message via WebSocket
    sendMessage(message);

    setText('');
  };

  useEffect(() => {
    if (messages.length) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.user.id === user?.id;
    return (
      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
        <View style={[styles.messageBubble, isMe ? styles.myMessageBubble : styles.otherMessageBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={gamerTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={isLoading ? <Text style={styles.loadingText}>Loading messages...</Text> : null}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={gamerTheme.colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={22} color={gamerTheme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: gamerTheme.colors.border,
  },
  headerTitle: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: gamerTheme.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: gamerTheme.colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: gamerTheme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: gamerTheme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    color: gamerTheme.colors.textPrimary,
    marginRight: 12,
  },
  sendButton: {
    padding: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: gamerTheme.colors.textSecondary,
    marginTop: 20,
  },
});
