import { getDistinctCategoriesFromImages } from '@/services/database'; // Import database function
import { useRouter } from 'expo-router'; // Import useRouter
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Screen to list all categories that have images associated with them.
export default function ViewCategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories from the database when the screen loads or focuses
  useEffect(() => {
    const loadAndSetCategories = async () => {
        await loadCategories();
    };

    loadAndSetCategories(); // Load on initial mount

    // Add listener for screen focus to refresh the list
    // Note: In expo-router v2+, you might use useFocusEffect from @react-navigation/native
    // For simplicity here, we'll just load on mount. For real-time updates,
    // consider a more advanced state management or a focus effect.
    // const unsubscribe = navigation.addListener('focus', () => loadCategories());
    // return unsubscribe; // Cleanup listener
  }, []);

  // Function to load distinct categories from categorized_images table
  const loadCategories = async () => {
    try {
      const fetchedCategories = await getDistinctCategoriesFromImages();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load distinct categories:', error);
      Alert.alert('Error', 'Could not load categories.');
    }
  };

  // Handle tapping on a category
  const handleCategoryPress = (categoryName: string) => {
    // Navigate to the dynamic route for viewing images in this category
    router.push(`/view-images/${categoryName}`);
  };

  // Render each category item in the list
  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Categories</Text>

      {/* List of categories */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item} // Category name is unique
        renderItem={renderCategoryItem}
        style={styles.categoryList}
        ListEmptyComponent={<Text style={styles.emptyListText}>No categorized images found yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryList: {
    flex: 1,
    width: '100%',
  },
  categoryItem: {
    backgroundColor: '#3a3d42',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
   emptyListText: {
      color: '#ccc',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
  }
});
