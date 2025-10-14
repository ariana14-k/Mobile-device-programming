import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Link} from 'expo-router'

const NotFoundPage = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>Error 404! Page not found</Text>
      <Link href="/">
      <Text>Go Back to Home</Text>
      </Link>
    </View>
  )
}

export default NotFoundPage

const styles = StyleSheet.create({})