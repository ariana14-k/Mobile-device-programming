import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifList, setNotifList] = useState([]);

  // Fetch notifications stored in Firestore
  const loadNotifications = async () => {
    try {
      const tasksRef = collection(db, "users", user.id, "tasks");
      const snapshot = await getDocs(tasksRef);

      const all = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log("data", data)
        if (data.notifications) {
          data.notifications.forEach((n) => {
            all.push({ ...n, taskTitle: data.title, id: n.notificationId });
          });
        }
      });

      setNotifList(all);
    } catch (e) {
      console.log("Error loading notifications", e);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const cancelNotif = async (id) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      alert("Notification cancelled");
    } catch (e) {
      alert("Failed to cancel");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Notifications</Text>

      <FlatList
        data={notifList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.taskTitle}>Task: {item.taskTitle}</Text>
            <Text style={styles.type}>Type: {item.type}</Text>
            <Text style={styles.time}>Scheduled: {item.scheduledAt.toString()}</Text>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => cancelNotif(item.id)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  type: {
    marginTop: 4,
  },
  time: {
    marginTop: 4,
    color: "#555",
  },
  cancelBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
});