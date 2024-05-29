import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

//This is now our Root file
const index = () => {
  return (
     // Redirect to the '/(authenticate)/login' route
   <Redirect href="/(authenticate)/login"/>
  )
}

export default index

const styles = StyleSheet.create({})

/*
<Redirect href="/(authenticate)/login"/>: Inside the return statement of the functional component, the Redirect component is used to navigate the user to the /(authenticate)/login route. This means that when this component is rendered, the user will be immediately redirected to the login page.
*/

//Home(initial) Route because we are using Expo-Router
//index.js => "/"

