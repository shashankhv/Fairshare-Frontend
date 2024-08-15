import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Platform , TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from './Components/Redux/reducers/groupReducer'; // Ensure the correct path
import uuid from 'react-native-uuid';
import { colors, sizes } from './theme'; // Import theme
import { CheckBox, Card, Button } from 'react-native-elements';

const AllocateReceipt = ({ route, navigation }) => {
  const { receiptData, groupId } = route.params;
  const group = useSelector(state => state.groups.groups.find(g => g.id === groupId));
  const [itemAllocations, setItemAllocations] = useState({});
  const [payer, setPayer] = useState(null);
  const dispatch = useDispatch();

  const handleAddExpense = () => {
    const totalAmount = receiptData ? receiptData.total : 0;
    let membersAllocation = {};

    group.members.forEach(member => {
      membersAllocation[member.id] = 0;
    });

    receiptData.items.forEach((item, index) => {
      const allocatedMembers = itemAllocations[index] || [];
      const equalShare = allocatedMembers.length > 0 ? item.price / allocatedMembers.length : 0;
      allocatedMembers.forEach(memberId => {
        membersAllocation[memberId] += equalShare;
      });
    });

    const newExpense = {
      id: uuid.v4(),
      description: receiptData && receiptData.store_name ? receiptData.store_name : 'Receipt Expense',
      date: new Date().toISOString().split('T')[0],
      total: totalAmount,
      allocations: membersAllocation,
      payer: payer,
    };

    dispatch(addExpense({ groupId, expense: newExpense }));
    navigation.goBack();
  };

  const toggleMemberAllocation = (index, memberId) => {
    const currentAllocations = itemAllocations[index] || [];
    if (currentAllocations.includes(memberId)) {
      setItemAllocations({
        ...itemAllocations,
        [index]: currentAllocations.filter(id => id !== memberId)
      });
    } else {
      setItemAllocations({
        ...itemAllocations,
        [index]: [...currentAllocations, memberId]
      });
    }
  };

  return (
    <View style={styles.container}>
      {(!receiptData || !receiptData.items) && <ActivityIndicator size="large" color={colors.primary} />}

      {receiptData && receiptData.items && (
        <>
          <Text style={styles.title}>Parsed Receipt Data</Text>
          <ScrollView style={styles.scrollView}>
            {receiptData.items.map((item, index) => (
              <Card key={index} containerStyle={styles.card}>
                <Card.Title>{item.name}</Card.Title>
                <Card.Divider />
                <Text style={styles.itemText}>Price: ${item.price.toFixed(2)}</Text>
                {group.members.map(member => (
                  <CheckBox
                    key={member.id}
                    title={member.name}
                    checked={itemAllocations[index]?.includes(member.id) || false}
                    onPress={() => toggleMemberAllocation(index, member.id)}
                    containerStyle={styles.checkboxContainer}
                    textStyle={styles.checkboxLabel}
                  />
                ))}
              </Card>
            ))}
          </ScrollView>
          <Text style={styles.summaryText}>Total: ${receiptData.total ? receiptData.total.toFixed(2) : 'N/A'}</Text>
          <Text style={styles.payerText}>Select Payer:</Text>
          <View style={styles.payerContainer}>
            {group.members.map(member => (
              <TouchableOpacity
                key={member.id}
                style={[styles.payerButton, payer === member.id && styles.payerButtonSelected]}
                onPress={() => setPayer(member.id)}
              >
                <Text style={payer === member.id ? styles.payerButtonTextSelected : styles.payerButtonText}>{member.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title="Add Expense"
            onPress={handleAddExpense}
            buttonStyle={styles.addButton}
            titleStyle={styles.addButtonText}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Add padding for Android status bar
  },
  scrollView: {
    width: '100%',
  },
  title: {
    fontSize: sizes.font.large,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  itemText: {
    fontSize: sizes.font.medium,
    color: colors.text,
    marginBottom: 10,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  checkboxLabel: {
    fontSize: sizes.font.medium,
    color: colors.text,
  },
  summaryText: {
    fontSize: sizes.font.medium,
    fontWeight: 'bold',
    marginTop: 10,
    color: colors.text,
  },
  payerText: {
    fontSize: sizes.font.medium,
    fontWeight: 'bold',
    marginTop: 20,
    color: colors.text,
  },
  payerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  payerButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  payerButtonSelected: {
    backgroundColor: colors.primary,
  },
  payerButtonText: {
    fontSize: sizes.font.medium,
    color: colors.buttonText,
  },
  payerButtonTextSelected: {
    fontSize: sizes.font.medium,
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    fontSize: sizes.font.medium,
    color: colors.buttonText,
  },
});

export default AllocateReceipt;
