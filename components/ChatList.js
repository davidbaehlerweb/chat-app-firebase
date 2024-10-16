import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { useRouter } from 'expo-router'

export default function ChatList({ users,currentUser }) {
    const router= useRouter()
  return (
    <View className='flex-1'>
      <FlatList 
        data={users}
        contentContainerStyle={{ paddingVertical: 25 }} // Retrait de `flex: 1` car il peut causer des soucis d'affichage
        keyExtractor={item => Math.random().toString()} // Il vaut mieux utiliser un id ou une clé unique
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem 
          noBorder={index + 1 === users.length} 
          item={item} index={index} 
          currentUser={currentUser}
          router={router} />
        )}
      />
    </View>
  )
}
