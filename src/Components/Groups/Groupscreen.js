import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { colors, sizes } from '../../theme';

const GroupsScreen = () => {
  const groups = useSelector(state => state.groups.groups); // Use selector to get groups
  const navigation = useNavigation();

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleGroupPress = (group) => {
    navigation.navigate('GroupDetails', { groupId: group.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleGroupPress(item)}>
            <View style={styles.groupItem}>
              <Text style={styles.groupItemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>No groups available. Create one!</Text>}
      />
      <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
        <Text style={styles.createGroupButtonText}>Create Group</Text>
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
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderRadius: sizes.card.borderRadius,
    backgroundColor: colors.cardBackground,
    marginBottom: 10,
  },
  groupItemText: {
    fontSize: sizes.font.medium,
    color: colors.text,
  },
  emptyListText: {
    fontSize: sizes.font.medium,
    color: colors.placeholder,
    textAlign: 'center',
    marginTop: 20,
  },
  createGroupButton: {
    backgroundColor: colors.primary,
    height: sizes.button.height,
    justifyContent: 'center',
    borderRadius: sizes.button.borderRadius,
    alignItems: 'center',
    marginTop: 20,
  },
  createGroupButtonText: {
    color: colors.buttonText,
    fontSize: sizes.font.medium,
  },
});

export default GroupsScreen;
