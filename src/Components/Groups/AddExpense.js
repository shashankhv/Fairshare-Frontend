import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../Redux/reducers/groupReducer'; // Ensure the correct path
import uuid from 'react-native-uuid';
import { colors, sizes } from '../../theme'; // Import theme

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
        <Text style={styles.noMembersText}>No members to add an expense.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Expense</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor={colors.placeholder}
        />
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Date"
          placeholderTextColor={colors.placeholder}
        />
        <TextInput
          style={styles.input}
          value={total}
          onChangeText={setTotal}
          placeholder="Total Amount"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={splitMethod}
            onValueChange={(itemValue) => setSplitMethod(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Split Equally" value="equal" />
            <Picker.Item label="Split Unequally" value="unequal" />
          </Picker>
        </View>

        {splitMethod === 'unequal' && group.members.map((member) => (
          <View key={member.id} style={styles.memberInputContainer}>
            <Text style={styles.memberName}>{member.name}</Text>
            <TextInput
              style={styles.memberInput}
              value={allocations[member.id] ? allocations[member.id].toString() : ''}
              onChangeText={(value) => handleAllocationChange(member.id, value)}
              placeholder="Allocation"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: sizes.font.large,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
    borderRadius: sizes.button.borderRadius,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    width: '100%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.button.borderRadius,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
    width: '100%',
  },
  picker: {
    height: Platform.OS === 'ios' ? 50 : 50, // Adjust height for iOS
    width: '100%',
  },
  pickerItem: {
    height: 44,
  },
  memberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  memberName: {
    fontSize: sizes.font.medium,
    color: colors.text,
    width: '40%',
  },
  memberInput: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    borderRadius: sizes.button.borderRadius,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    width: '55%',
  },
  noMembersText: {
    fontSize: sizes.font.medium,
    color: colors.text,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: sizes.button.borderRadius,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  addButtonText: {
    color: colors.buttonText,
    fontSize: sizes.font.medium,
  },
});

export default AddExpenseScreen;
