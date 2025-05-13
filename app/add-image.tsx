import { getAllCategories, insertCategorizedImage } from '@/services/database'; // Import database functions
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import hooks from expo-router
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Screen/Modal to add category and description to a saved image.
export default function AddImageDetailsScreen() { // Ensure export default is here
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>(); // Get imageUri from route params

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // State to control dropdown visibility

  // Fetch categories when the screen mounts
  useEffect(() => {
    loadCategories();
  }, []);

  // Load categories from the database
  const loadCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      Alert.alert('Error', 'Could not load categories for selection.');
    }
  };

  // Function to save the image details to the database
  const saveDetails = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'No image URI provided.');
      return;
    }
    if (!category.trim()) {
      Alert.alert('Error', 'Please enter or select a category.');
      return;
    }

    try {
      await insertCategorizedImage(imageUri, category.trim(), description.trim());
      console.log('Image details saved to database');
      Alert.alert('Success', 'Details saved!');
      // Navigate back or to the categories view after saving
      router.back(); // Go back to the previous screen (SelectImageScreen)
      // Or navigate to categories: router.replace('/view-categories');
    } catch (error: any) {
       console.error('Error saving image details:', error);
       if (error.message && error.message.includes('UNIQUE constraint failed')) {
           Alert.alert('Error', 'This image has already been categorized.');
       } else {
           Alert.alert('Error', 'Failed to save details.');
       }
    }
  };

    // Handle category selection from dropdown
    const selectCategory = (selectedCategoryName: string) => {
        setCategory(selectedCategoryName);
        setShowCategoryDropdown(false); // Close dropdown after selection
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Image Details</Text>

      {/* Display the saved image */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      {/* Category Input */}
      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter or select category"
        placeholderTextColor="#ccc"
        value={category}
        onChangeText={setCategory}
        onFocus={() => setShowCategoryDropdown(true)} // Show dropdown on focus
      />

      {/* Category Dropdown */}
      {showCategoryDropdown && categories.length > 0 && (
          <View style={styles.dropdownContainer}>
              <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                      <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => selectCategory(item.name)}
                      >
                          <Text style={styles.dropdownItemText}>{item.name}</Text>
                      </TouchableOpacity>
                  )}
              />
          </View>
      )}


      {/* Description Input */}
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter description (optional)"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
        multiline={true} // Allow multiple lines for description
      />

      {/* Save Button */}
      <TouchableOpacity onPress={saveDetails} style={styles.saveButton}>
        <Text style={styles.buttonText}>Save Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    alignSelf: 'flex-start', // Align label to the left
  },
  input: {
    width: '100%',
    backgroundColor: '#3a3d42',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
      minHeight: 80, // Give more space for description
      textAlignVertical: 'top', // Align text to the top in multiline input
  },
  dropdownContainer: {
      width: '100%',
      maxHeight: 150, // Limit height of dropdown
      backgroundColor: '#3a3d42',
      borderRadius: 10,
      marginBottom: 15,
      overflow: 'hidden', // Hide scrollbar on edges
  },
  dropdownItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#555',
  },
  dropdownItemText: {
      color: '#fff',
      fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
