import { useEffect, useState, useCallback, memo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import NotifCard from "../../components/NotifCard";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifList, setNotifList] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const ref = collection(db, "users", user.id, "notifications");
    const notifsQuery = query(ref, orderBy("scheduledAt", "desc"));
    const unsubscribe = onSnapshot(notifsQuery, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          scheduledAt: data.scheduledAt?.toDate(),
        };
      });

      setNotifList(list);
    });

    return () => unsubscribe();
  }, [user?.id]);


  const cancelNotif = useCallback(async (id) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      alert("Notification cancelled");
    } catch (e) {
      alert("Failed to cancel");
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => <NotifCard item={item} cancel={cancelNotif} />,
    [cancelNotif]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduled Notifications</Text>

      <FlatList
        data={notifList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        ListEmptyComponent={
          <Text style={{ color: "#555", marginTop: 20 }}>No notifications scheduled</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginBottom: 12,
  },
  taskTitle: { fontSize: 17, fontWeight: "700", color: "black" },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 5,
  },
  badgeText: { color: "white", fontWeight: "600", fontSize: 12 },
  bodyText: { marginTop: 8, color: "#333", fontSize: 14 },
  time: { marginTop: 8, color: "#555" },
  cancelBtn: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: { color: "white", fontWeight: "bold" },
});
