import * as Notifications from "expo-notifications"
import { Platform } from "react-native";
import { Alert } from "react-native";

export async function registerForPushNotifications() {
    const {status} = Notifications.getPermissionsAsync();

    if (status !== 'granted') {
        Alert.alert("Permission required", "You need to enable notifications to get updates")
        return ;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
      name: "default for notifications",
      importance: Notifications.AndroidImportance.MAX,
    });

    }

    return true;
}