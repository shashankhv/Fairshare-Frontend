import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Share, TextInput, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Use any icon library you prefer
import Modal from 'react-native-modal';
import uuid from 'react-native-uuid';
import { addMember } from '../Redux/reducers/groupReducer'; // Ensure the correct path
import { colors, sizes } from '../../theme'; // Import theme

const GroupDetails = ({ route }) => {
  const { groupId } = route.params; // Get groupId from navigation params
  const group = useSelector(state => state.groups.groups.find(g => g.id === groupId)); // Find the group by id
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const invitationLink = `https://yourapp.com/join/${group.id}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my group using this link: ${invitationLink}`,
      });
    } catch (error) {
      console.error('Error sharing link', error);
    }
  };

  const handleAddExpense = (method) => {
    setIsAddExpenseModalVisible(false);
    if (method === 'scan') {
      navigation.navigate('Googlevision', { groupId });
    } else if (method === 'manual') {
      navigation.navigate('AddExpense', { groupId });
    }
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember = { id: uuid.v4(), name: newMemberName };
      dispatch(addMember({ groupId, member: newMember }));
      setNewMemberName('');
      setIsModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{group.name}</Text>

      <FlatList
        data={group.expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>{item.description}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Total: {item.total}</Text>
            {Object.entries(item.allocations).map(([memberId, allocation]) => (
              <Text key={memberId}>Member {memberId} owes: {allocation}</Text>
            ))}
            {/* Display more expense details if needed */}
          </View>
        )}
        ListEmptyComponent={<Text>No expenses recorded.</Text>}
      />

      <Button title="Add Expense" onPress={() => setIsAddExpenseModalVisible(true)} />

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="person-add" size={24} color="white" />
      </TouchableOpacity>

      <Modal isVisible={isAddExpenseModalVisible} onBackdropPress={() => setIsAddExpenseModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Expense</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => handleAddExpense('scan')}>
            <Text style={styles.modalButtonText}>Scan Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => handleAddExpense('manual')}>
            <Text style={styles.modalButtonText}>Add Manually</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsAddExpenseModalVisible(false)}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Member</Text>
          {/* <QRCode value={invitationLink} size={100} /> */}
          <Text>Invitation Code: {group.invitationCode}</Text>
          <Button title="Share Invitation Link" onPress={handleShare} />
          <TextInput
            style={styles.input}
            value={newMemberName}
            onChangeText={setNewMemberName}
            placeholder="Member Name"
          />
          <Button title="Add Member" onPress={handleAddMember} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: sizes.font.large,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  expenseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: sizes.button.borderRadius,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    marginBottom: 8,
    borderRadius: sizes.button.borderRadius,
    width: '100%',
  },
});

export default GroupDetails;
