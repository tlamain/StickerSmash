import { deleteCategory, getAllCategories, insertCategory, updateCategory } from '@/services/database'; // Import database functions
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define a type for category objects
interface Category {
    id: number;
    name: string;
}

// Screen for adding, editing, and deleting categories.
export default function EditCategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null); // State to hold category being edited

  // Fetch categories from the database when the screen loads or when categories change
  useEffect(() => {
    loadCategories();
  }, []);

  // Function to load categories from the database
  const loadCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      Alert.alert('Error', 'Could not load categories.');
    }
  };

  // Function to add a new category
  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }
    try {
      await insertCategory(newCategoryName.trim());
      setNewCategoryName(''); // Clear input field
      loadCategories(); // Refresh the list
      Alert.alert('Success', 'Category added.');
    } catch (error: any) { // Use any for error type to access message
      console.error('Failed to add category:', error);
       if (error.message && error.message.includes('UNIQUE constraint failed')) {
           Alert.alert('Error', 'Category already exists.');
       } else {
           Alert.alert('Error', 'Could not add category.');
       }
    }
  };

  // Function to start editing a category
  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name); // Populate input with current name
  };

  // Function to save edited category
  const saveEditedCategory = async () => {
      if (!editingCategory || !newCategoryName.trim()) {
          Alert.alert('Error', 'Category name cannot be empty.');
          return;
      }
      try {
          await updateCategory(editingCategory.id, newCategoryName.trim());
          setEditingCategory(null); // Exit editing mode
          setNewCategoryName(''); // Clear input field
          loadCategories(); // Refresh the list
          Alert.alert('Success', 'Category updated.');
      } catch (error: any) {
          console.error('Failed to update category:', error);
           if (error.message && error.message.includes('UNIQUE constraint failed')) {
               Alert.alert('Error', 'Category already exists.');
           } else {
               Alert.alert('Error', 'Could not update category.');
           }
      }
  };

  // Function to cancel editing
  const cancelEditing = () => {
      setEditingCategory(null);
      setNewCategoryName('');
  };


  // Function to delete a category
  const deleteCategoryHandler = (category: Category) => {
      Alert.alert(
          'Confirm Delete',
          `Are you sure you want to delete the category "${category.name}"?`,
          [
              {
                  text: 'Cancel',
                  style: 'cancel',
              },
              {
                  text: 'Delete',
                  onPress: async () => {
                      try {
                          await deleteCategory(category.id);
                          loadCategories(); // Refresh the list
                          Alert.alert('Success', 'Category deleted.');
                      } catch (error) {
                          console.error('Failed to delete category:', error);
                          Alert.alert('Error', 'Could not delete category.');
                      }
                  },
                  style: 'destructive',
              },
          ]
      );
  };

  // Render each category item in the list
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item.name}</Text>
      <View style={styles.categoryButtons}>
        <TouchableOpacity onPress={() => startEditing(item)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCategoryHandler(item)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editingCategory ? 'Edit Category' : 'Add New Category'}</Text>

      {/* Input field for category name */}
      <TextInput
        style={styles.input}
        placeholder={editingCategory ? 'Enter new category name' : 'Enter new category name'}
        placeholderTextColor="#ccc"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
      />

      {/* Add/Save/Cancel buttons */}
      {editingCategory ? (
          <View style={styles.buttonRow}>
              <TouchableOpacity onPress={saveEditedCategory} style={[styles.button, styles.saveButton]}>
                  <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelEditing} style={[styles.button, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
          </View>
      ) : (
          <TouchableOpacity onPress={addCategory} style={[styles.button, styles.addButton]}>
              <Text style={styles.buttonText}>Add Category</Text>
          </TouchableOpacity>
      )}


      <Text style={styles.listTitle}>Existing Categories</Text>

      {/* List of existing categories */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
        style={styles.categoryList}
        ListEmptyComponent={<Text style={styles.emptyListText}>No categories added yet.</Text>}
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
  input: {
    width: '100%',
    backgroundColor: '#3a3d42',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Take equal space in buttonRow
    marginHorizontal: 5, // Space between buttons
  },
  addButton: {
      backgroundColor: '#007BFF', // Blue
  },
  saveButton: {
      backgroundColor: '#28a745', // Green
  },
  cancelButton: {
      backgroundColor: '#dc3545', // Red
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    flex: 1, // Allow text to take available space
    marginRight: 10, // Space between text and buttons
  },
  categoryButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#ffc107', // Yellow
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  emptyListText: {
      color: '#ccc',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
  }
});
