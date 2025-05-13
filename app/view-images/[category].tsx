import { getImagesByCategory } from '@/services/database'; // Import database function
import { useLocalSearchParams } from 'expo-router'; // Import hook to get route params
import { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';

// Define a type for image records
interface ImageRecord {
    uri: string;
    description: string;
}

// Screen to display images belonging to a specific category.
export default function ImagesByCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>(); // Get category name from route params
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true); // State to indicate loading

 /* Fetch images for the category when the screen loads or category changes
  useEffect(() => {
    if (category) {
      loadImages(category);
    } else {
        setLoading(false);
        Alert.alert('Error', 'Category not specified.');
    }
  }, [category]); // Reload if the category parameter changes
*/

useEffect(() => {
  const testDatabase = async () => {
    try {
      const testImages = await getImagesByCategory('test-category'); // Replace with a test category
      console.log('Test images fetched successfully:', testImages);
    } catch (error) {
      console.error('Error testing database connection:', error);
    }
  };

  if (category) {
    loadImages(category);
    testDatabase(); // Call the test function
  } else {
    setLoading(false);
    Alert.alert('Error', 'Category not specified.');
  }
}, [category]); // Reload if the category parameter changes



  // Function to load images by category from the database
  const loadImages = async (categoryName: string) => {
    setLoading(true);
    try {
      const fetchedImages = await getImagesByCategory(categoryName);
      setImages(fetchedImages);
    } catch (error) {
      console.error(`Failed to load images for category ${categoryName}:`, error);
      Alert.alert('Error', `Could not load images for category "${categoryName}".`);
    } finally {
        setLoading(false);
    }
  };

  // Render each image item in the grid
  const renderImageItem = ({ item }: { item: ImageRecord }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      {item.description ? (
          <Text style={styles.imageDescription}>{item.description}</Text>
      ) : null}
    </View>
  );

  if (loading) {
      return (
          <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading images...</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category ? `Images in ${category}` : 'Categorized Images'}</Text>

      {images.length === 0 ? (
          <Text style={styles.emptyListText}>No images found in this category.</Text>
      ) : (
          <FlatList
            data={images}
            keyExtractor={(item) => item.uri} // URI should be unique
            renderItem={renderImageItem}
            numColumns={2} // Display images in a 2-column grid
            columnWrapperStyle={styles.row} // Style for rows in the grid
            contentContainerStyle={styles.imageGrid} // Style for the content within the FlatList
          />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 10, // Reduced padding for grid layout
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#25292e',
  },
  loadingText: {
      fontSize: 18,
      color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageGrid: {
      justifyContent: 'center', // Center grid items
  },
  row: {
    flex: 1,
    justifyContent: 'space-around', // Space out items in a row
    marginBottom: 10, // Space between rows
  },
  imageItem: {
    backgroundColor: '#3a3d42',
    borderRadius: 10,
    padding: 5, // Padding inside each item
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 15, // Calculate width for 2 columns with spacing
  },
  image: {
    width: '100%', // Image takes full width of its container
    height: 150, // Fixed height for images
    resizeMode: 'cover', // Cover the area, may crop
    borderRadius: 8, // Rounded corners for images
    marginBottom: 5, // Space between image and description
  },
  imageDescription: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
      paddingHorizontal: 5, // Padding for text
      paddingBottom: 5,
  },
  emptyListText: {
      color: '#ccc',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
  }
});
