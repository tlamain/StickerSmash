import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

// This is the main menu screen of your app.
export default function MainMenuScreen() { // Ensure export default is here
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Categorizer</Text>

      {/* Link to the Edit Categories screen */}
      <Link href="/edit-categories" style={styles.link}>
        Edit Categories
      </Link>

      {/* Link to the Select Image screen */}
      <Link href="/select-image" style={styles.link}>
        Select Images
      </Link>

      {/* Link to the View Categories screen */}
      <Link href="/view-categories" style={styles.link}>
        View Images
      </Link>

      {/* Add other menu options here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e', // Dark background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // White text
    marginBottom: 40,
  },
  link: {
    fontSize: 18,
    color: '#007BFF', // Blue link color
    textDecorationLine: 'underline',
    marginVertical: 10, // Vertical spacing between links
  },
});
