import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert, } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteGroup, deleteMember } from '../Redux/reducers/groupReducer'; // Ensure the correct path
import { colors, sizes } from '../../theme';
import { Ionicons } from '@expo/vector-icons'; // Import icons

const SettingsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const groups = useSelector(state => state.groups.groups);
  const dispatch = useDispatch();

  const handleDeleteGroup = (groupId) => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => dispatch(deleteGroup(groupId)), style: "destructive" }
      ]
    );
  };

  const handleDeleteMember = (memberId) => {
    Alert.alert(
      "Delete Member",
      "Are you sure you want to delete this member?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => {
          dispatch(deleteMember({ groupId: selectedGroup.id, memberId }));
          setSelectedGroup({
            ...selectedGroup,
            members: selectedGroup.members.filter(member => member.id !== memberId)
          });
        }, style: "destructive" }
      ]
    );
  };

  const openMembersModal = (group) => {
    setSelectedGroup(group);
    setMembersModalVisible(true);
  };

  const closeMembersModal = () => {
    setSelectedGroup(null);
    setMembersModalVisible(false);
  };

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Text style={styles.header}>Settings</Text>}
      renderItem={({ item }) => (
        <View style={styles.groupItem}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openMembersModal(item)}
            >
              <Ionicons name="settings-sharp" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDeleteGroup(item.id)}
          >
            <Text style={styles.buttonText}>Delete Group</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noGroupsText}>No groups available.</Text>}
    >
      {selectedGroup && (
        <Modal animationType="slide" transparent={true} visible={membersModalVisible} onRequestClose={closeMembersModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Members of {selectedGroup.name}</Text>
              <FlatList
                data={selectedGroup.members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.memberItem}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <TouchableOpacity
                      style={[styles.button, styles.deleteButton]}
                      onPress={() => handleDeleteMember(item.id)}
                    >
                      <Text style={styles.buttonText}>Delete Member</Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.noGroupsText}>No members available.</Text>}
              />
              <TouchableOpacity style={styles.closeButton} onPress={closeMembersModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </FlatList>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: sizes.font.large,
    fontWeight: 'bold',
    color: colors.primary,
    padding: 20,
    textAlign: 'center',
    paddingTop: 50,
  },
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    backgroundColor: colors.background,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: sizes.font.large,
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    padding: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: sizes.button.borderRadius,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: sizes.font.medium,
  },
  noGroupsText: {
    fontSize: sizes.font.large,
    color: colors.text,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: sizes.card.borderRadius,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: sizes.font.large,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  memberName: {
    fontSize: sizes.font.medium,
    color: colors.text,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: sizes.button.borderRadius,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SettingsScreen;
