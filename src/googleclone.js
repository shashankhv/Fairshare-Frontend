import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../Redux/reducers/groupReducer'; // Ensure the correct path
import uuid from 'react-native-uuid';
import { colors, sizes } from '../../theme'; // Import theme

const Googlevision = ({ route, navigation }) => {
  const { groupId } = route.params; // Get the groupId from the navigation params
  const group = useSelector(state => state.groups.groups.find(g => g.id === groupId)); // Find the group by id
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [parsedReceiptData, setParsedReceiptData] = useState(null);
  const [allocations, setAllocations] = useState({});
  
  const dispatch = useDispatch();

  const takePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Camera permission is required to take pictures!');
        return;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 5],
        quality: 0.5,
      });

      if (pickerResult.cancelled === true) {
        return;
      }

      setReceiptImage({ uri: pickerResult.uri });
      setImageUri(pickerResult.uri);
      console.log('imageUri after setState:', imageUri);

    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Media library permission is required to select images!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 5],
        quality: 0.5,
      });

      if (pickerResult.cancelled) {
        return;
      }
      console.log('Picker Result:', pickerResult);  
      setReceiptImage({ uri: pickerResult.uri });
      setImageUri(pickerResult.uri);
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  useEffect(() => {
    const uploadImage = async () => {
      if (imageUri) {
        await sendToGoogle(imageUri);
      }
    };

    uploadImage();
  }, [imageUri]);

  useEffect(() => {
    if (receiptData) {
      try {
        console.log('Raw receipt data:', receiptData.data);
     
      } catch (error) {
        console.error('Error parsing receipt data:', error);
      }
    }
  }, [receiptData]);

  const sendToGoogle = async (imageUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      console.log('File Info:', fileInfo);

      const fileData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('File Data Length:', fileData.length);

      const formData = new FormData();
      formData.append('receipt', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'receipt.jpg',
        
      });
      
      try {
        console.log('Uploading image...');
        const response = await axios.post('http://134.88.142.187:3000/scan-receipt', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Response received:');
        setReceiptData(response.data);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } catch (error) {
      console.error('Error sending image to Google:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
        console.error('Response Status:', error.response.status);
      } else if (error.request) {
        console.error('Error Request:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
    }
  };

  const handleAddExpense = () => {
    const totalAmount = receiptData.total; // Example: Total amount from parsed receipt data
    let membersAllocation = {};

    group.members.forEach(member => {
      membersAllocation[member.id] = 0; // Initialize allocation for each member
    });

    parsedReceiptData.items.forEach(item => {
      // Allocate each item equally among all members (you can adjust this logic)
      const equalShare = item.price / group.members.length;
      group.members.forEach(member => {
        membersAllocation[member.id] += equalShare;
      });
    });

    const newExpense = {
      id: uuid.v4(),
      description: receiptData.store_name || 'Receipt Expense',
      date: new Date().toISOString().split('T')[0],
      total: totalAmount,
      allocations: membersAllocation,
    };

    dispatch(addExpense({ groupId, expense: newExpense }));
    navigation.goBack(); // Navigate back to the previous screen
  };
console.log('parsedReceiptData:', parsedReceiptData);
  return (
    <View style={styles.container}>
      {receiptImage && (
        <Image source={receiptImage} style={styles.receiptImage} />
      )}

      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {/* {receiptData && (
        <View style={styles.receiptDataContainer}>
          <Text style={styles.receiptDataTitle}>Parsed Receipt Data</Text>
          <ScrollView>
            {parsedReceiptData.items.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text>{item.name}</Text>
                <Text>Price: ${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.summaryText}>Total: ${receiptData.total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  receiptImage: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  receiptDataContainer: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    marginTop: 20,
    width: '90%',
  },
  receiptDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default Googlevision;
