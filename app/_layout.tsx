import { initDatabase } from '@/services/database'; // Import database initialization
import { Stack } from 'expo-router';
import { useEffect } from 'react';

// This is the root layout of your app.
// It handles navigation and other global configurations.
export default function RootLayout() { // Ensure export default is here
  // Initialize the database when the app starts
useEffect(() => {
  if (typeof initDatabase === 'function') {
    initDatabase()
      .then(() => console.log('Database initialized successfully'))
      .catch(e => console.error("Failed to initialize database:", e));
  } else {
    console.warn('initDatabase function is not defined or not imported correctly');
  }
}, []);

  return (
    // Stack navigator provides a way for your app to transition between screens
    // where each new screen is placed on top of a stack.
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#25292e', // Dark header background
        },
        headerTintColor: '#fff', // White header text color
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackVisible: false, // Hide back button
      }}
    >
      {/* Define your screens here. The 'name' corresponds to the file name in the 'app' directory. */}

      {/* The index route is the default route when the app starts */}
      <Stack.Screen name="index" options={{ title: 'Main Menu' }} />

      {/* Screen for editing categories */}
      <Stack.Screen name="edit-categories" options={{ title: 'Edit Categories' }} />

      {/* Screen for selecting and editing an image */}
      <Stack.Screen name="select-image" options={{ title: 'Select & Edit Image' }} />

      {/* Screen/Modal for adding details after saving an image */}
      {/* Use presentation: 'modal' for a modal appearance */}
      <Stack.Screen name="add-image-details" options={{ title: 'Add Image Details', presentation: 'modal' }} />

      {/* Screen to view the list of categories */}
      <Stack.Screen name="view-categories" options={{ title: 'View Categories' }} />

      {/* Dynamic route screen to view images within a specific category */}
      {/* Corrected route name to match the file name [category].tsx */}
      <Stack.Screen name="view-images/[category]" options={{ title: 'Images' }} />

      {/* Add other screens here as you create them */}
    </Stack>
  );
}
