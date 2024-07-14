import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

const ManualExpense = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Manual Expense Component</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ManualExpense;
