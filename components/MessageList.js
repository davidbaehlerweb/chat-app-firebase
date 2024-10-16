import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MessageItem from './MessageItem'

export default function MessageList({scrollViewRef, messages,  currentUser }) {
  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10 }}>
      {
        messages.map((message, index) => {  // Utiliser "message" ici au lieu de "messages"
          return (
            <MessageItem message={message} key={index} currentUser={currentUser} />  // message au singulier
          )
        })
      }

    </ScrollView>
  )
}