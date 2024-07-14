import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const navigation = useNavigation();

  const handleCreateGroup = () => {
    // Navigation to CreateGroup screen
    navigation.navigate('CreateGroup');
  };

  const handleGroupPress = (group) => {
    // Navigation to GroupDetails screen
    navigation.navigate('GroupDetails', { group });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
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
