import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { colors } from './theme';

const ReceiptDataFetcher = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const sendToGoogle = async (imageUri) => {
    try {
      setLoading(true);
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
        const response = await axios.post('http://143.198.177.106:3000/scan-receipt', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Response received:', response.data);

        if (response.data && response.data.success && response.data.data) {
          setReceiptData(response.data.data);
          navigation.navigate('AllocateReceipt', { receiptData: response.data.data, groupId });
        } else {
          console.error('Invalid receipt data received:', response.data);
        }
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {!loading && (
        <>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
        </>
      )}

      {receiptImage && <Image source={receiptImage} style={styles.receiptImage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
});

export default ReceiptDataFetcher;
