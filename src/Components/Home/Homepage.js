import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Card } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { colors, sizes } from '../../theme';
import { Ionicons } from '@expo/vector-icons'; 

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [groupSelectVisible, setGroupSelectVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const groups = useSelector(state => state.groups.groups);
  const userId = 'currentUserId'; // Replace with the actual current user's ID
  const [totalOwe, setTotalOwe] = useState(0);
  const [totalOwed, setTotalOwed] = useState(0);

  useEffect(() => {
    let owe = 20;
    let owed =40;
    
    groups.forEach(group => {
      group.expenses.forEach(expense => {
        if (expense.payer === userId) {
          expense.allocations.forEach((amount, memberId) => {
            if (memberId !== userId) {
              owed += amount;
            }
          });
        } else if (expense.allocations[userId]) {
          owe += expense.allocations[userId];
        }
      });
    });

    setTotalOwe(owe);
    setTotalOwed(owed);
  }, [groups]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleCreateGroup = () => {
    navigation.navigate('Groups', {
      screen: 'CreateGroup'
    });
  };

  const handleGroupSelect = (groupId) => {
    console.log('Selected group:', groupId);
    setSelectedGroupId(groupId);
    setGroupSelectVisible(true);
  };

  const handleAddExpense = (method) => {
    setGroupSelectVisible(false);
    if (method === 'manual') {
      navigation.navigate('ManualExpense', { groupId: selectedGroupId });
    } else if (method === 'scan') {
      navigation.navigate('Googlevision', { groupId: selectedGroupId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {groups.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.greeting}>Welcome, User!</Text>

          <Card containerStyle={styles.balanceCard}>
            <Card.Title style={styles.title}>Overall Balance</Card.Title>
            <Card.Divider />
            <Text style={styles.paragraph}>Owe: ${totalOwe.toFixed(2)}</Text>
            <Text style={styles.paragraph}>Owed: ${totalOwed.toFixed(2)}</Text>
          </Card>

          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Ionicons name="add-circle-outline" size={24} color={colors.buttonText} />
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>

          <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Group to Add Expense</Text>
                {groups.length > 0 ? (
                  groups.map(group => (
                    <TouchableOpacity
                      key={group.id}
                      style={styles.modalButton}
                      onPress={() => handleGroupSelect(group.id)}
                    >
                      <Text style={styles.modalButtonText}>{group.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noGroupsText}>No groups to add expense.</Text>
                )}
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeModal}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal animationType="slide" transparent={true} visible={groupSelectVisible} onRequestClose={() => setGroupSelectVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose Method</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleAddExpense('manual')}
                >
                  <Text style={styles.modalButtonText}>Add Manually</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleAddExpense('scan')}
                >
                  <Text style={styles.modalButtonText}>Scan Receipt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setGroupSelectVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      ) : (
        <View style={styles.noGroupsContainer}>
          <Text style={styles.noGroupsText}>No groups available. Please create a group.</Text>
          <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
            <Text style={styles.createGroupButtonText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Add padding for Android status bar
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: sizes.font.xlarge,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 20,
  },
  balanceCard: {
    width: '90%',
    marginBottom: 40,
    backgroundColor: colors.cardBackground,
    borderRadius: sizes.card.borderRadius,
  },
  title: {
    fontSize: sizes.font.large,
    color: colors.text,
  },
  paragraph: {
    fontSize: sizes.font.medium,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: sizes.button.borderRadius,
    marginTop: 20,
  },
  addButtonText: {
    color: colors.buttonText,
    fontSize: sizes.font.medium,
    marginLeft: 10,
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
  noGroupsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noGroupsText: {
    fontSize: sizes.font.large,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  createGroupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: sizes.button.borderRadius,
  },
  createGroupButtonText: {
    color: colors.buttonText,
    fontSize: sizes.font.medium,
  },
});

export default HomeScreen;
