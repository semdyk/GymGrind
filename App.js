import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';  // Make sure you include TouchableOpacity from 'react-native'
import { FontAwesome } from '@expo/vector-icons';  // Assuming you are using Expo for vector icons
import { useNavigation } from '@react-navigation/native';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import firebase from './firebase.js'; // Import the firebase configuration
import { getAuth, onAuthStateChanged } from "firebase/auth";


import HomePage from './screens/HomePage.js';

import OnboardingScreen from './screens/OnboardingScreen.js';

import LoginScreen from './screens/auth/LoginScreen.js';
import WorkoutScreen from './screens/WorkoutScreen.js';
import SocialScreen from './screens/SocialScreen.js';
import SearchScreen from './screens/WorkoutsScreen.js';
import RegisterScreen from './screens/auth/RegisterScreen.js';
import Test from './screens/Test.js';
import WorkoutsScreen from './screens/WorkoutsScreen.js';
import CreateWorkoutScreen from './screens/CreateWorkoutScreen.js';
import ProfilePage from './screens/ProfilePage.js';

// Register the main component
AppRegistry.registerComponent(appName, () => App);

const Stack = createStackNavigator();


const App = () => {

  const MyTransitionSpec = {
    animation: 'timing',
    config: {
      duration: 300, // This is the duration in milliseconds. Adjust as needed.
    },
  };
  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  return (
    // Your main app content here
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          headerBackVisible: false,
          cardStyleInterpolator: forFade, // This applies a horizontal slide transition
          transitionSpec: {
            open: MyTransitionSpec,   // Use the default iOS transition spec
            close: MyTransitionSpec,  // Use the default iOS transition spec
          },
        }}>

        <Stack.Screen name="Onboarding" options={{ title: 'Onboarding' }} component={OnboardingScreen} />
        <Stack.Screen name="Login" options={{ title: 'Login' }} component={LoginScreen} />
        <Stack.Screen name="Register" options={{ title: 'Register' }} component={RegisterScreen} />

        <Stack.Screen name="Home" options={{ title: 'GymGrind' }} component={HomePage} />
        <Stack.Screen name="Workout" options={{ title: 'Workout' }} component={WorkoutScreen} />
        <Stack.Screen name="CreateWorkoutScreen" options={{ title: 'CreateWorkoutScreen' }} component={CreateWorkoutScreen} />
        <Stack.Screen name="Social" options={{ title: 'Social' }} component={SocialScreen} />
        <Stack.Screen name="Search" options={{ title: 'Search' }} component={SearchScreen} />
        <Stack.Screen name="ProfilePage" options={{ title: 'ProfilePage' }} component={ProfilePage} />

        <Stack.Screen name="Workouts" options={{ title: 'Workouts' }} component={WorkoutsScreen} />
        <Stack.Screen name="Test" options={{ title: 'Test' }} component={Test} />

      </Stack.Navigator>
    </NavigationContainer >
  );
};

export default App;