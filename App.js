import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';  // Make sure you include TouchableOpacity from 'react-native'
import { FontAwesome } from '@expo/vector-icons';  // Assuming you are using Expo for vector icons
import { useNavigation } from '@react-navigation/native';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import firebase from './firebase.js'; // Import the firebase configuration
import { getAuth, onAuthStateChanged } from "firebase/auth";


import HomePage from './screens/HomePage.js';
import ClenniePage from './screens/ClenniePage.js';
import ClennieDetails from './screens/ClennieDetails.js';
import SettingsPage from './screens/SettingsPage.js';
import VerkopenPage from './screens/VerkopenPage.js';

import InkopenPage from './screens/InkopenPage.js';
// Register the main component
AppRegistry.registerComponent(appName, () => App);

const Stack = createStackNavigator();


const App = () => {


  return (
    // Your main app content here
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          headerBackVisible: false,
        }}>
        <Stack.Screen name="Home" options={{ title: 'Junkielijst' }} component={HomePage} />
        <Stack.Screen name="Clennie" options={{ title: 'Clennies' }} component={ClenniePage} />
        <Stack.Screen name="ClennieDetails" options={{ title: 'ClennieDetails' }} component={ClennieDetails} />
        <Stack.Screen name="Settings" options={{ title: 'Settings' }} component={SettingsPage} />
        <Stack.Screen name="Verkopen" options={{ title: 'Verkopen' }} component={VerkopenPage} />
        <Stack.Screen name="Inkopen" options={{ title: 'Inkopen' }} component={InkopenPage} />
      </Stack.Navigator>
    </NavigationContainer >
  );
};

export default App;