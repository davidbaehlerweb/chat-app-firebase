import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash, formatDate, getRoomId } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/authContext';

export default function ChatItem({ item, noBorder, router,currentUser }) {
  const [lastmessage,setLastMessage]=useState(undefined)
  const { user, isAuthenticated } = useAuth(); 
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
        
        let roomId=getRoomId(currentUser?.userId,item?.userId);
        const docRef=doc(db,'rooms',roomId);
        const messagesRef=collection(docRef,'messages')
        const q=query(messagesRef,orderBy('createdAt','desc'));
        
        let unsub=onSnapshot(q,(snapshot)=>{
            let allMessages=snapshot.docs.map(doc=>{
                return doc.data();
            });
            setLastMessage(allMessages[0]? allMessages[0]:null)
        });
        return unsub;

    } else {
        console.log('Waiting for authentication or user data...');
    }
}, [isAuthenticated, user]);

//console.log('last message: ',lastmessage)
  
  const openChatRoom=()=>{
        router.push({pathname:'/chatRoom',params:item})
    }

  const renderLastMessage=()=>{
    if(typeof lastmessage=='undefined') return 'Loading...';
    if(lastmessage){
      if(currentUser?.userId==lastmessage?.userId) return 'You: '+lastmessage?.text;
      return lastmessage?.text;
    }else{
      return 'Say Hi';
    }
  }

  const renderTime=()=>{
    if(lastmessage){
      let date=lastmessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000))
    }
    return 'Time'
  }
  return (
    <TouchableOpacity 
    onPress={openChatRoom}
      style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingBottom: 10, 
        borderBottomWidth: noBorder ? 0 : 0.5, // Pas de bordure si `noBorder` est vrai
        borderBottomColor: '#ccc', 
        alignItems: 'center' 
      }}
    >
     {/* <Image 
        source={{uri:item?.profileUrl}} 
        style={{ height: hp(6), width: hp(6), borderRadius: hp(3) }} 
      />*/}

      <Image
        style={{height:hp(6),width:hp(6),borderRadius:100}}
        source={item?.profileUrl}
        placeholder={blurhash}
        transition={500}
      />

      {/** Name and last message */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: hp(1.8), color: 'black', fontWeight: '600' }}>{item?.username}</Text>
          <Text style={{ fontSize: hp(1.6), color: '#6b7280' }}>
            {renderTime()}
          </Text>
        </View>
        <Text style={{ fontSize: hp(1.6), color: '#6b7280' }}>
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
