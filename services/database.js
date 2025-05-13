import { openDatabase } from 'expo-sqlite';

const db = openDatabase('images.db');

// Initialize the database: create tables if they don't exist
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create table for categorized images
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS categorized_images (id INTEGER PRIMARY KEY AUTOINCREMENT, media_library_uri TEXT UNIQUE, category TEXT, description TEXT, saved_at INTEGER);',
        [],
        () => console.log('categorized_images table created successfully or already exists'),
        (_, error) => {
          console.error('Error creating categorized_images table:', error);
          reject(error);
          return true; // Indicate that the error was handled
        }
      );

      // Create table for categories (optional, but good for managing category names)
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);',
        [],
        () => {
          console.log('categories table created successfully or already exists');
          resolve(); // Resolve the promise after all tables are checked/created
        },
        (_, error) => {
          console.error('Error creating categories table:', error);
          reject(error);
          return true; // Indicate that the error was handled
        }
      );
    });
  });
};

// --- Functions for Categorized Images ---

// Insert a new categorized image record
export const insertCategorizedImage = (uri, category, description) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO categorized_images (media_library_uri, category, description, saved_at) VALUES (?, ?, ?, ?);',
                [uri, category, description, Date.now()],
                (_, result) => resolve(result),
                (_, error) => {
                    console.error('Error inserting categorized image:', error);
                    reject(error);
                    return true; // Indicate error was handled
                }
            );
        });
    });
};

// Get all images for a specific category
export const getImagesByCategory = (category) => {
     return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT media_library_uri as uri, description FROM categorized_images WHERE category = ?;',
                [category],
                (_, { rows: { _array } }) => resolve(_array),
                (_, error) => {
                    console.error(`Error fetching images for category ${category}:`, error);
                    reject(error);
                    return true; // Indicate error was handled
                }
            );
        });
    });
};

// --- Functions for Categories Table ---

// Insert a new category
export const insertCategory = (name) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO categories (name) VALUES (?);',
                [name],
                (_, result) => resolve(result),
                (_, error) => {
                    console.error('Error inserting category:', error);
                    reject(error);
                    return true; // Indicate error was handled
                }
            );
        });
    });
};

// Get all categories
export const getAllCategories = () => {
     return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT id, name FROM categories ORDER BY name ASC;',
                [],
                (_, { rows: { _array } }) => resolve(_array),
                (_, error) => {
                    console.error('Error fetching all categories:', error);
                    reject(error);
                    return true; // Indicate error was handled
                }
            );
        });
    });
};

// Update a category name
export const updateCategory = (id, newName) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE categories SET name = ? WHERE id = ?;',
                [newName, id],
                (_, result) => resolve(result),
                (_, error) => {
                    console.error(`Error updating category with id ${id}:`, error);
                    reject(error);
                    return true; // Indicate error was handled
                }
            );
        });
    });
};

// Delete a category
export const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM categories WHERE id = ?;',
                [id],
                (_, result) => resolve(result),
                (_, error) => {
                    console.error(`Error deleting category with id ${id}:`, error);
                    reject(error);
                    return true; // Indicate error was handled
                }
            );
        });
    });
};

// Get distinct categories from categorized_images table (alternative if you don't use the categories table)
export const getDistinctCategoriesFromImages = () => {
     return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT DISTINCT category FROM categorized_images WHERE category IS NOT NULL AND category != "";',
                [],
                (_, { rows: { _array } }) => resolve(_array.map(item => item.category)),
                (_, error) => {
                    console.error('Error fetching distinct categories from images:', error);
                    reject(error);
                    return true; // Indicate error was handled
                }
            );
        });
    });
};

// Export the database instance if needed elsewhere, though using helper functions is often preferred
export default db;