import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StyleSheet } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { useEffect } from "react";
import { registerPushNotifications } from "../notifications";
import * as Notifications from 'expo-notifications';
import {router} from 'expo-router'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {

  useEffect(() =>{
    registerPushNotifications()

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const actionId = response.actionIdentifier;
        if (data?.taskId) {
          router.push(`/task/${data.taskId}`);
        }
        if (actionId === "accept") {
          router.push(`/task/${data.taskId}`);
        }
        if (actionId === "deny") {
          router.push(`(tabs)/`);
        }
      }
    );

    Notifications.setNotificationCategoryAsync("taskCategory", [
      {
        identifier: "accept",
        buttonTitle: "Accept",
      },
      {
        identifier: "deny",
        buttonTitle: "Deny",
        options: { isDestructive: true },
      },
    ]);

    return () => subscription.remove();
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <AuthProvider>
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
          <Stack.Screen name="+not-found" options={{headerShown: true}} />
          <Stack.Screen name="(auth)/register" options={{headerShown: false}} />
          <Stack.Screen name="(auth)/login" options={{headerShown: false}} />
      </Stack>
      </AuthProvider>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8" },
});
