import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';

import { getRoomId } from '../../utils/common';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/authContext';

export default function ChatRoom() {
    const item = useLocalSearchParams();
    const { user, isAuthenticated } = useAuth();

    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated && user?.userId) {
            createRoomIfNotExists();
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messagesRef = collection(docRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'asc'));
            
            let unsub = onSnapshot(q, (snapshot) => {
                let allMessages = snapshot.docs.map(doc => doc.data());
                setMessages([...allMessages]);
            });
            return unsub;
        } else {
            console.log('Waiting for authentication or user data...');
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
        }, 100); // Petit délai pour s'assurer que le contenu est bien chargé avant de scroller
    };

    const createRoomIfNotExists = async () => {
        if (!user?.userId) {
            console.log('User not authenticated, cannot create room.');
            return;
        }

        let roomId = getRoomId(user?.userId, item?.userId);
        await setDoc(doc(db, 'rooms', roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date()),
        });
    };

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;

        if (!user?.userId) {
            Alert.alert('Error', 'User is not defined');
            return;
        }

        try {
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messageRef = collection(docRef, 'messages');
            textRef.current = '';
            if (inputRef) inputRef?.current?.clear();
            await addDoc(messageRef, {
                userId: user?.userId,
                text: message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });
        } catch (err) {
            Alert.alert('Message ', err.message);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ChatRoomHeader user={item} router={router} />
            <View className="h-3 border-b border-neutral-300" />
            
            {/* KeyboardAvoidingView pour ajuster la vue avec le clavier */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={hp(12)}
            >
                {/* ScrollView pour permettre le défilement du contenu */}
                <ScrollView
                    ref={scrollViewRef} // Référence pour le ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} // Affichage en bas
                    onContentSizeChange={() => scrollToBottom()} // Scroller vers le bas lors du changement de contenu
                >
                    <View className="flex-1">
                        <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
                    </View>
                </ScrollView>

                {/* Champ de message juste au-dessus du clavier */}
                <View style={{ paddingBottom: hp(2), paddingHorizontal: wp(3) }}>
                    <View className="flex-row justify-between bg-white border p-2 border-neutral-300 rounded-full">
                        <TextInput
                            ref={inputRef}
                            onChangeText={value => textRef.current = value}
                            placeholder="Type message..."
                            style={{ fontSize: hp(2), flex: 1 }}
                            keyboardShouldPersistTaps="handled"
                        />
                        <TouchableOpacity
                            onPress={handleSendMessage}
                            style={{
                                backgroundColor: '#d1d1d1',
                                borderRadius: 50,
                                paddingHorizontal: wp(3),
                                paddingVertical: hp(1.2),
                                marginLeft: wp(2),
                            }}
                        >
                            <Feather name="send" size={hp(2.7)} color="#737373" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
