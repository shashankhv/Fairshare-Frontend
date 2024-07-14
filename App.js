import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/Components/Home/Homepage';
import Googlevision from './src/Googlevision';
import ManualExpense from './src/ManualExpense';
import GroupsScreen from './src/Components/Groups/Groupscreen';
import CreateGroupScreen from './src/Components/Groups/CreateGroup';
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Googlevision" component={Googlevision} />
          <Stack.Screen name="ManualExpense" component={ManualExpense} />
          <Stack.Screen name="Groups" component={GroupsScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
          {/* Add other screens here */}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
