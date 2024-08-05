import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addGroup } from '../Redux/reducers/groupReducer'; // Ensure the correct path
import uuid from 'react-native-uuid';
import { colors, sizes } from '../../theme';

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
      <Text style={styles.title}>Create Group</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Group Name"
        placeholderTextColor={colors.placeholder}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: sizes.font.large,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 20,
    borderRadius: sizes.button.borderRadius,
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: sizes.button.borderRadius,
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.buttonText,
    fontSize: sizes.font.medium,
  },
});

export default CreateGroupScreen;
