import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const App = () => {
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const takePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Camera permission is required to take pictures!');
        return;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (pickerResult.cancelled) {
        return;
      }

      setReceiptImage({ uri: pickerResult.uri });
      setImageUri(pickerResult.uri);
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
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (pickerResult.cancelled) {
        return;
      }

      setReceiptImage({ uri: pickerResult.uri });
      setImageUri(pickerResult.uri);
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  useEffect(() => {
    if (imageUri) {
      uploadImage(imageUri);
    }
  }, [imageUri]);

  const uploadImage = async (imageUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      const formData = new FormData();

      formData.append('receipt', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      });

      const response = await axios.post('http://134.88.142.187:3000/scan-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setReceiptData(response.data.data);
    } catch (error) {
      console.error('Error uploading image:', error);
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

      {receiptData && (
        <ScrollView style={styles.receiptDataContainer} scrollEnabled>
          <Text style={styles.sectionTitle}>Receipt Items</Text>
          {receiptData.items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>Price: ${item.price}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
            </View>
          ))}
          <Text style={styles.summaryText}>Subtotal: ${receiptData.subtotal}</Text>
          <Text style={styles.summaryText}>Tax: ${receiptData.tax}</Text>
          <Text style={styles.summaryText}>Total: ${receiptData.total}</Text>
        </ScrollView>
      )}
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  receiptDataContainer: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default App;
