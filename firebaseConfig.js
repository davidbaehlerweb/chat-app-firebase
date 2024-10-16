// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence,initializeAuth} from 'firebase/auth';
// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxZwkqXxAIXVro2MgeotDP560fha-C4ls",
  authDomain: "fir-chat-c3516.firebaseapp.com",
  projectId: "fir-chat-c3516",
  storageBucket: "fir-chat-c3516.appspot.com",
  messagingSenderId: "522032386973",
  appId: "1:522032386973:web:0ae7a1adeff2f4f356d574"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
});

export const db=getFirestore(app);

export const usersRef=collection(db,'users');
export const roomRef=collection(db,'rooms');