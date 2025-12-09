import { memo, useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { Text } from "react-native";
import { FlatList } from "react-native";
import * as Notifications from "expo-notifications";

const NotifCard = memo(({ item, cancel }) => (
  <View style={styles.card}>
    <Text style={styles.taskTitle}>Task: {item.taskTitle}</Text>

    <Text style={styles.bodyText}>{item.body}</Text>
    <Text style={styles.time}>Scheduled: {item.scheduledAt?.toLocaleString()}</Text>

    <TouchableOpacity
      style={styles.cancelBtn}
      activeOpacity={0.7}
      onPress={() => cancel(item.notificationId)}
    >
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>
  </View>
));


export default function NotificationsScreen() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [notifsList, setNotifsList] = useState([]);

    useEffect(() => {
        if (!user.id) return;

        const ref = collection(db, "users", user.id, "notifications");
        const notifQuery = query(ref, orderBy("scheduledAt", "desc"));
        const unsubscribe = onSnapshot(notifQuery, (snapshot) => {
            const list = snapshot.docs.map((docSnapshot) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.uid,
                    ...data,
                    scheduledAt: data.scheduledAt.toDate()
                }
            })

            setNotifsList(list)
        })

        return () => unsubscribe();

    }, [user.id])

    const cancelNotification = async (item) => {
        try {
            await Notifications.cancelScheduledNotificationAsync(item.notificationId);
            Alert.alert("Cancel notification", "Notification cancelled successfully!")
        } catch (error) {
            console.log("error", error)
        }

    }

    const renderItem = useCallback(({item}) => {
        return (
            <NotifCard item={item} onCancel={cancelNotification}/>
        )
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All scheduled notifications</Text>
            <FlatList
                data={notifsList}
                keyExtractor={(item) => item.uid}
                renderItem={renderItem}
                maxToRenderPerBatch={5}
                initialNumToRender={5}
            />

        </View>
    )
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
