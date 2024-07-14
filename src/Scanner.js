// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View, Image , ScrollView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import * as FileSystem from 'expo-file-system';

// const App = () => {
//   const [receiptImage, setReceiptImage] = useState(null);
//   const [receiptData, setReceiptData] = useState(null);
//   const [imageUri, setImageUri] = useState(null);

//   const takePicture = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//       if (permissionResult.granted === false) {
//         alert('Camera permission is required to take pictures!');
//         return;
//       }

//       const pickerResult = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         aspect: [4, 3],
//         quality: 0.5,
//       });

//       if (pickerResult.cancelled === true) {
//         return;
//       }
      

        
//       setReceiptImage({ uri: pickerResult.assets[0].uri });
//       setImageUri(pickerResult.assets[0].uri);
//       console.log('imageUri after setState:', imageUri);

//     } catch (error) {
//       console.error('Error taking picture:', error);
//     }
//   };

//   useEffect(() => {
//     console.log('Image URI:', imageUri)
//     const uploadImage = async () => {
//       if (imageUri) {
//         await sendToTaggun(imageUri);
//       }
//     };

//     uploadImage();
//   }, [imageUri]);

//   const sendToTaggun = async (imageUri) => {
//     console.log('Starting upload to Taggun...');

//     const apiKey = '0117ad30fc3111ee9433edbb2578dfab';
//     const url = 'https://api.taggun.io/api/receipt/v1/verbose/file';

//     try {
//       const fileInfo = await FileSystem.getInfoAsync(imageUri);
//       console.log('File Info:', fileInfo);

//       const fileData = await FileSystem.readAsStringAsync(imageUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       console.log('File Data Length:', fileData.length);

//       const formData = new FormData();

      
//       formData.append('file', {
//         uri: imageUri,
//         type: 'image/jpeg',
//         name: 'receipt.jpg',
//         data: fileData,
//       });

//       formData.append('extractLineItems', 'true');
      
//       const options = {
//         method: 'POST',
//         url: url,
//         headers: {
//           accept: 'application/json',
//           'content-type': 'multipart/form-data',
//           apikey: apiKey,
//         },
//         data: formData,
        
//       };

//       const response = await axios.request(options);
//       // console.log('Response Data:', response.data.amounts);
//       console.log('Response Data:', response.data);

//       setReceiptData(response.data.amounts);
//       const filteredData = response.data.amounts.reduce((accumulator, obj) => {
//         if (obj.data) {
//             accumulator.push({ data: obj.data, text: obj.text });
//         }
//         return accumulator;
//     }, []);
// console.log(receiptData)

//     } catch (error) {
//       console.error('Error sending image to Taggun:', error);
//       if (error.response) {
//         console.error('Error Response:', error.response.data);
//         console.error('Response Status:', error.response.status);
//       } else if (error.request) {
//         console.error('Error Request:', error.request);
//       } else {
//         console.error('Error Message:', error.message);
//       }
//     }
//   };



//   return (
//     <View style={styles.container}>
//       {receiptImage && (
//         <Image source={receiptImage} style={styles.receiptImage} />
//       )}

//       <TouchableOpacity style={styles.button} onPress={takePicture}>
//         <Text style={styles.buttonText}>Take Picture</Text>
//       </TouchableOpacity>

//       {receiptData && (
//         <ScrollView style={styles.receiptDataContainer} scrollEnabled>
//           {/* Display the receipt data here */}
//           <Text>Receipt Data: {JSON.stringify(receiptData, null, 2)}</Text>
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   receiptImage: {
//     width: 300,
//     height: 400,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#3498db',
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 20,
//   },
//   receiptDataContainer: {
//     padding: 20,
//     backgroundColor: '#f2f2f2',
//     marginTop: 20,
//   },
// });

// export default App;
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const App = () => {
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const takePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Camera permission is required to take pictures!');
        return;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (pickerResult.cancelled === true) {
        return;
      }

      setReceiptImage({ uri: pickerResult.uri });
      setImageUri(pickerResult.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    const formData = new FormData();
    formData.append('receipt', {
      uri: imageUri,
      name: 'receipt.jpg',
      type: 'image/jpeg',
    });

    try {
      console.log('Uploading image...');
      const response = await axios.post('http://your-server-url/scan-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response received:', response.data);
      setReceiptData(response.data);
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

      {imageUri && (
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      )}

      {receiptData && (
        <ScrollView style={styles.receiptDataContainer} scrollEnabled>
          <Text>Receipt Data: {JSON.stringify(receiptData, null, 2)}</Text>
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
});

export default App;
