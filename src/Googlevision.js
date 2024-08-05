import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const App = () => {
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [parsedReceiptData, setParsedReceiptData] = useState(null);

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

      setReceiptImage({ uri: pickerResult.assets[0].uri });
      setImageUri(pickerResult.assets[0].uri);
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
      setReceiptImage({ uri: pickerResult.assets[0].uri });
      setImageUri(pickerResult.assets[0].uri);
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


     

    </View>
    );};

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
});

export default App;
