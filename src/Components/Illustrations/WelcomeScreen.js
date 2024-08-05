// import React, { useState, useRef } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import Carousel from 'react-native-snap-carousel';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width: screenWidth } = Dimensions.get('window');

// const data = [
//   {
//     illustration: require('./assets/one.webp'), // Adjust the path if needed
//     text: 'Create a group by tapping a button on your phone.',
//   },
//   {
//     illustration: require('./assets/two.webp'), // Adjust the path if needed
//     text: 'Share a group via QR code.',
//   },
//   {
//     illustration: require('./assets/three.webp'), // Adjust the path if needed
//     text: 'Scan a receipt with your phone, extracting data.',
//   },
//   {
//     illustration: require('./assets/four.webp'), // Adjust the path if needed
//     text: 'Review stored receipt data on your phone.',
//   },
// ];

// const WelcomeScreen = ({ onComplete }) => {
//   const carouselRef = useRef(null);

//   const handleComplete = async () => {
//     await AsyncStorage.setItem('hasOpened', 'true');
//     onComplete();
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.slide}>
//       <Image source={item.illustration} style={styles.illustration} />
//       <View style={styles.textContainer}>
//         <Text style={styles.text}>{item.text}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Carousel
//         ref={carouselRef}
//         data={data}
//         renderItem={renderItem}
//         sliderWidth={screenWidth}
//         itemWidth={screenWidth}
//         layout={'default'}
//       />
//       <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
//         <Text style={styles.skipButtonText}>Skip</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//   },
//   slide: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   illustration: {
//     width: '100%',
//     height: '75%',
//     resizeMode: 'contain',
//   },
//   textContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 10,
//     borderRadius: 5,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   skipButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   skipButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default WelcomeScreen;
