import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
// This code defines a root layout for a React Native app using Expo Router.
// It imports the Stack component from 'expo-router' and defines a functional component
// called RootLayout. Inside this component, a Stack is created with two screens:
// "index" (Home) and "about" (About). The options prop is used to set the title for each screen.
// The RootLayout component is exported as the default export of the module.