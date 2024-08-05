// src/Components/Groups/Groupscreen.js
import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const GroupsScreen = () => {
  const groups = useSelector(state => state.groups.groups); // Use selector to get groups
  const navigation = useNavigation();

  const handleCreateGroup = () => {
    // Navigation to CreateGroup screen
    navigation.navigate('CreateGroup');
  };

  const handleGroupPress = (group) => {
    // Navigation to GroupDetails screen
    console.log('Group pressed:', group);
    navigation.navigate('GroupDetails', { groupId: group.id });
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleGroupPress(item)}>
            <View style={styles.groupItem}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No groups available. Create one!</Text>}
      />
      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default GroupsScreen;
