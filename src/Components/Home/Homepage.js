import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { colors, sizes } from '../../theme';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const groups = useSelector(state => state.groups.groups);

  const userName = 'User';
  const totalOwe = 50.00;
  const totalOwed = 30.00;

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleCreateGroup = () => {
    navigation.navigate('Groups', {
      screen: 'CreateGroup'
    });
  };

  const handleGroupSelect = (groupId) => {
    closeModal();
    navigation.navigate('AddExpense', { groupId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {groups.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.greeting}>Welcome, {userName}!</Text>

          <Card style={styles.balanceCard}>
            <Card.Content>
              <Title style={styles.title}>Overall Balance</Title>
              <Paragraph style={styles.paragraph}>Owe: ${totalOwe.toFixed(2)}</Paragraph>
              <Paragraph style={styles.paragraph}>Owed: ${totalOwed.toFixed(2)}</Paragraph>
            </Card.Content>
          </Card>

          <Button mode="contained" style={styles.button} onPress={openModal}>
            Add Expense
          </Button>

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
        </ScrollView>
      ) : (
        <View style={styles.noGroupsContainer}>
          <Text style={styles.noGroupsText}>No groups available. Please create a group.</Text>
          <Button mode="contained" style={styles.button} onPress={handleCreateGroup}>
            Create Group
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  button: {
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: sizes.font.medium,
    backgroundColor: colors.primary,
    borderRadius: sizes.button.borderRadius,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
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
    backgroundColor: colors.text,
  },
  modalButtonText: {
    color: colors.buttonText,
    fontSize: sizes.font.medium,
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
});

export default HomeScreen;
