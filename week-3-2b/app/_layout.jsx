import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          contentStyle: { backgroundColor: "#f2f4f8" },
        }}
      >
          <Stack.Screen name="task/[id]" options={{ headerShown: true, title: 'Task Details', headerTitleAlign: 'center' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/profile" options={{headerShown: true, title: "Profile Page"}} />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8" },
});
