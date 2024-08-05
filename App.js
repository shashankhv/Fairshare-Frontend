import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/Components/Redux/store';
import { resetState } from './src/Components/Redux/reducers/groupReducer'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, sizes } from './src/theme'; // Import theme

import HomeScreen from './src/Components/Home/Homepage';
import Googlevision from './src/Googlevision';
import ManualExpense from './src/ManualExpense';
import GroupsScreen from './src/Components/Groups/Groupscreen';
import CreateGroupScreen from './src/Components/Groups/CreateGroup';
import GroupDetails from './src/Components/Groups/GroupDetails';
import AddExpense from './src/Components/Groups/AddExpense';
import SettingsScreen from './src/Components/Settings/SettingsHome'; // Assume you have a SettingsScreen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    store.dispatch(resetState());
    console.log('Storage successfully cleared');
  } catch (e) {
    console.error('Failed to clear storage', e);
  }
};

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="Googlevision" component={Googlevision} />
      <Stack.Screen name="ManualExpense" component={ManualExpense} />
      <Stack.Screen name="GroupDetails" component={GroupDetails} />
      <Stack.Screen name="AddExpense" component={AddExpense} />
    </Stack.Navigator>
  );
}

function GroupsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="GroupsMain" 
        component={GroupsScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetails} />
      <Stack.Screen name="AddExpense" component={AddExpense} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Groups') {
            iconName = focused ? 'people' : 'people-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Groups" component={GroupsStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainTabNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
