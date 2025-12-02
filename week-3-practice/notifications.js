import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
  const {status} = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert("Permission not granted")
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
  })
}

}