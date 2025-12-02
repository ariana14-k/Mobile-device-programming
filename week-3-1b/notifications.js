import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Permission not granted!");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
}
