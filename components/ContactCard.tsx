import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'

const ContactCard = () => {
  return (
    <View className='flex items-center'>
      <Image 
      source={images.vehicle}/>

      <View className='absolute left-12 top-5'>
        <Text className='text-white text-lg font-psemibold '>WheelWell</Text>
      </View>
      <View className='absolute top-16'>
        <Text className='text-gray-100 text-sm font-psemibold '>Car Repair Services</Text>
      </View>
      <View className='absolute bottom-0 left-12'>
        <Text className='text-white text-lg font-psemibold '>Support</Text>
        <Text className='text-white text-lg font-psemibold '>Contact 0708096462</Text>
      </View>
    </View>
  )
}

export default ContactCard

