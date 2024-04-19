import React, { useState } from 'react';
import { Button, Image, StyleSheet , View , Text} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const SimpleImagePicker = () => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: false, // Allow some basic editing
      });

      if (!result.cancelled) {
        setImageUri(result.assets[0].uri); 
      }
   

    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Picture" onPress={pickImage} />
      {imageUri ? null : <Text>No image selected"</Text>}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default SimpleImagePicker;
