import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const index = () => {
  const [userId, setUserId] = useState("");
  console.log({userId})
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})

