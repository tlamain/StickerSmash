import { type ImageSource } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import CircleButton from '@/components/CircleButton';
import EmojiList from '@/components/EmojiList';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiSticker from '@/components/EmojiSticker';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';

// Placeholder image used when no image is selected
const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  // State to store the selected image URI
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  // State to toggle between app options and footer buttons
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);

  // State to control the visibility of the emoji picker modal
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // State to store the selected emoji
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);

  // Function to open the image picker and allow the user to select an image
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Only allow image selection
      allowsEditing: true,    // Allow basic editing like cropping
      quality: 1,             // Set the image quality to maximum
    });

    if (!result.canceled) {
      // If an image is selected, update the state and show app options
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      // Alert the user if no image is selected
      alert('You did not select any image.');
    }
  };

  // Function to reset the app state
  const onReset = () => {
    setShowAppOptions(false);
  };

  // Function to open the emoji picker modal
  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  // Function to close the emoji picker modal
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  // Placeholder function to save the image (to be implemented later)
  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  return (
    <View style={styles.container}>
      {/* Image container to display the selected image or placeholder */}
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        {/* Display the selected emoji sticker if one is picked */}
        {pickedEmoji && <EmojiSticker imageSize={80} stickerSource={pickedEmoji} />}
      </View>

      {/* Conditional rendering: Show app options or footer buttons */}
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            {/* Reset button */}
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            {/* Add sticker button */}
            <CircleButton onPress={onAddSticker} />
            {/* Save image button */}
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          {/* Button to choose a photo */}
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          {/* Button to use the selected photo */}
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}

      {/* Emoji picker modal */}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* Emoji list to select an emoji */}
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </View>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    backgroundColor: '#25292e', // Dark background color
    alignItems: 'center', // Center content horizontally
  },
  imageContainer: {
    flex: 1, // Take up the remaining space
  },
  footerContainer: {
    flex: 1 / 3, // Take up one-third of the screen
    alignItems: 'center', // Center content horizontally
  },
  optionsContainer: {
    position: 'absolute', // Position at the bottom of the screen
    bottom: 80, // Offset from the bottom
  },
  optionsRow: {
    alignItems: 'center', // Center items horizontally
    flexDirection: 'row', // Arrange items in a row
  },
});
