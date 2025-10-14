import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {router} from 'expo-router'

const profile = () => {
  return (
    <View>
      <Text>profile</Text>
      <TouchableOpacity onPress={() => router.back()}>
            <Text style={{color: 'red'}}>Go Back</Text>
          </TouchableOpacity>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({})