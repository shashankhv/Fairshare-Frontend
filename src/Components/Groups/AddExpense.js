import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../Redux/reducers/groupReducer'; // Ensure the correct path
import uuid from 'react-native-uuid';

const AddExpenseScreen = ({ route, navigation }) => {
  const { groupId } = route.params; // Get the groupId from the navigation params
  const group = useSelector(state => state.groups.groups.find(g => g.id === groupId)); // Find the group by id
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [total, setTotal] = useState('');
  const [splitMethod, setSplitMethod] = useState('equal');
  const [allocations, setAllocations] = useState({});

  const dispatch = useDispatch();

  const handleAddExpense = () => {
    if (description.trim() && date.trim() && total.trim()) {
      const totalAmount = parseFloat(total);
      let membersAllocation = {};

      if (splitMethod === 'equal') {
        const equalShare = totalAmount / group.members.length;
        group.members.forEach(member => {
          membersAllocation[member.id] = equalShare;
        });
      } else {
        membersAllocation = allocations;
      }

      const newExpense = {
        id: uuid.v4(),
        description,
        date,
        total: totalAmount,
        allocations: membersAllocation,
      };

      dispatch(addExpense({ groupId, expense: newExpense }));
      navigation.goBack(); // Navigate back to the previous screen
    }
  };

  const handleAllocationChange = (memberId, value) => {
    setAllocations({
      ...allocations,
      [memberId]: parseFloat(value),
    });
  };

  if (group.members.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No members to add an expense.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Add Expense</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Date"
      />
      <TextInput
        style={styles.input}
        value={total}
        onChangeText={setTotal}
        placeholder="Total Amount"
        keyboardType="numeric"
      />

      <Picker
        selectedValue={splitMethod}
        onValueChange={(itemValue) => setSplitMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Split Equally" value="equal" />
        <Picker.Item label="Split Unequally" value="unequal" />
      </Picker>

      {splitMethod === 'unequal' && group.members.map((member) => (
        <View key={member.id} style={styles.memberInputContainer}>
          <Text>{member.name}</Text>
          <TextInput
            style={styles.input}
            value={allocations[member.id] ? allocations[member.id].toString() : ''}
            onChangeText={(value) => handleAllocationChange(member.id, value)}
            placeholder="Allocation"
            keyboardType="numeric"
          />
        </View>
      ))}

      <Button title="Add Expense" onPress={handleAddExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  memberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default AddExpenseScreen;
