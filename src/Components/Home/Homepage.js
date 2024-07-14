import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import { Button, Appbar, Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const userName = 'User';  // Replace with dynamic user name
  const totalOwe = 50.00;  // Replace with dynamic data
  const totalOwed = 30.00; // Replace with dynamic data

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <SafeAreaView style={styles.container}>
   
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.greeting}>Welcome, {userName}!</Text>

        <Card style={styles.balanceCard}>
          <Card.Content>
            <Title>Overall Balance</Title>
            <Paragraph>Owe: ${totalOwe.toFixed(2)}</Paragraph>
            <Paragraph>Owed: ${totalOwed.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.button}
          onPress={openModal}
        >
          Add Expense
        </Button>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate('Googlevision');  // Assuming Googlevision handles receipt scanning
                }}
              >
                <Text style={styles.modalButtonText}>Add Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate('ManualExpense');  // Navigate to manual expense addition screen
                }}
              >
                <Text style={styles.modalButtonText}>Add Manually</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <Appbar style={styles.tabContainer}>
        <Appbar.Action
          icon={() => <Ionicons name="home" size={24} color="white" />}
          onPress={() => navigation.navigate('Home')}
        />
        <Appbar.Action
          icon={() => <MaterialIcons name="group" size={24} color="white" />}
          onPress={() => navigation.navigate('Groups')}
        />
        <Appbar.Action
          icon={() => <FontAwesome name="cogs" size={24} color="white" />}
          onPress={() => navigation.navigate('Settings')}
        />
      </Appbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 20,
  },
  balanceCard: {
    width: '90%',
    marginBottom: 40,
    backgroundColor: '#ecf0f1',
  },
  button: {
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 20,
  },
  tabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#34495e',
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
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
});

export default HomeScreen;
