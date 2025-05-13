import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

import Button from '@/components/Button';
import CircleButton from '@/components/CircleButton';
import EmojiList from '@/components/EmojiList';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiSticker from '@/components/EmojiSticker';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';

import domtoimage from 'dom-to-image';

// Image used when no user image is selected
const PlaceholderImage = require('@/assets/images/background-image.png');

export default function SelectImageScreen() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string>();
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState<any>();

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const imageContainerRef = useRef<View>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      Alert.alert('Info', 'You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(undefined);
    setPickedEmoji(undefined);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        if (permissionResponse?.status !== 'granted') {
          const permissionResult = await requestPermission();
          if (permissionResult.status !== 'granted') {
            Alert.alert('Permission Required', 'Access to media library is required.');
            return;
          }
        }

        if (viewShotRef.current) {
          const uri = viewShotRef.current?.capture ? await viewShotRef.current.capture() : null;
          if (!uri) {
            Alert.alert('Error', 'Failed to capture the view.');
            return;
          }
          await MediaLibrary.saveToLibraryAsync(uri);
          Alert.alert('Saved!', 'Image saved to photo library.');
          router.push({ pathname: '/add-image', params: { imageUri: uri } });
        } else {
          Alert.alert('Error', 'Capture view is not available.');
        }
      } catch (e) {
        console.error('Native image save error:', e);
        Alert.alert('Error', 'Failed to save the image.');
      }
    } else {
      try {
        if (imageContainerRef.current) {
          const htmlNode = imageContainerRef.current as unknown as HTMLElement;
          const uri = await domtoimage.toPng(htmlNode);
          const link = document.createElement('a');
          link.href = uri;
          link.download = 'sticker-smash-image.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          Alert.alert('Downloaded!', 'Image downloaded successfully!');
        }
      } catch (error) {
        console.error('Web download error:', error);
        Alert.alert('Error', 'Failed to download the image.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer} ref={imageContainerRef}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={80} stickerSource={pickedEmoji} />}
        </ViewShot>
      </View>

      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}

      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 50,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
