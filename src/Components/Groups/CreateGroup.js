import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addGroup } from '../Redux/reducers/groupReducer'; // Ensure the correct path
import uuid from 'react-native-uuid';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const dispatch = useDispatch();

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      const newGroup = {
        id: uuid.v4(),
        name: groupName,
        members: [],
        expenses: [],
        invitationCode: Math.random().toString(36).substring(2, 15),
      };
      dispatch(addGroup(newGroup));
      setGroupName('');
      navigation.navigate('GroupDetails', { groupId: newGroup.id });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Create Group</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Group Name"
      />
      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default CreateGroupScreen;
