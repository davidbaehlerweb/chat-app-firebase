import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");
    const profileRef = useRef("");

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
            Alert.alert('Sign Up', 'Please fill all the fields');
            return;
        }

        setLoading(true);

        let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);
        setLoading(false);

        if (!response.success) {
            Alert.alert('Sign Up', response.msg);
        }
    };

    return (
        <CustomKeyboardView>
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5), flex: 1 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={{ height: hp(20) }}
                        resizeMode="contain"
                        source={require('../assets/images/register.png')}
                    />
                </View>

                <View style={{ marginTop: hp(4) }}>
                    <View style={{ gap: hp(2) }}>
                        <Text style={{ fontSize: hp(4), textAlign: 'center', color: '#333', fontWeight: 'bold' }}>Sign Up</Text>

                        <View style={{ height: hp(7), flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 15, paddingHorizontal: wp(4) }}>
                            <Feather name="user" size={hp(2.5)} color="gray" />
                            <TextInput
                                onChangeText={value => usernameRef.current = value}
                                style={{ flex: 1, marginLeft: wp(3), fontSize: hp(2) }}
                                placeholder="Username"
                                placeholderTextColor="gray"
                            />
                        </View>

                        <View style={{ height: hp(7), flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 15, paddingHorizontal: wp(4) }}>
                            <Octicons name="mail" size={hp(2.5)} color="gray" />
                            <TextInput
                                onChangeText={value => emailRef.current = value}
                                style={{ flex: 1, marginLeft: wp(3), fontSize: hp(2) }}
                                placeholder="Email address"
                                placeholderTextColor="gray"
                            />
                        </View>

                        <View style={{ height: hp(7), flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 15, paddingHorizontal: wp(4) }}>
                            <Octicons name="lock" size={hp(2.5)} color="gray" />
                            <TextInput
                                onChangeText={value => passwordRef.current = value}
                                style={{ flex: 1, marginLeft: wp(3), fontSize: hp(2) }}
                                placeholder="Password"
                                secureTextEntry
                                placeholderTextColor="gray"
                            />
                        </View>

                        <View style={{ height: hp(7), flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 15, paddingHorizontal: wp(4) }}>
                            <Feather name="image" size={hp(2.5)} color="gray" />
                            <TextInput
                                onChangeText={value => profileRef.current = value}
                                style={{ flex: 1, marginLeft: wp(3), fontSize: hp(2) }}
                                placeholder="Profile URL"
                                placeholderTextColor="gray"
                            />
                        </View>
                    </View>

                    {/* Bouton juste en dessous du dernier input */}
                    <View style={{ marginTop: hp(2) }}>
                        {loading ? (
                            <View style={{ alignItems: 'center' }}>
                                <Loading size={hp(6)} />
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={handleRegister}
                                style={{ height: hp(6.5), backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}
                            >
                                <Text style={{ fontSize: hp(2.5), color: 'white', fontWeight: 'bold' }}>Sign Up</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Texte juste en dessous du bouton */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: hp(2) }}>
                        <Text style={{ fontSize: hp(1.8), color: '#6b7280', fontWeight: '600' }}>Already have an account? </Text>
                        <Pressable onPress={() => router.push('signIn')}>
                            <Text style={{ fontSize: hp(1.8), color: '#4f46e5', fontWeight: '600' }}>Sign In</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
        </CustomKeyboardView>
    );
}
