import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useCallback, useEffect, useState, memo } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Text } from "react-native";

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
    const [notifsList, setNotifsList] = useState([]);

    useEffect(() => {
        if (!user.id) return;

        const ref = collection(db, "users", user.id, "notifications");
        const notifQuery = query(ref, orderBy("scheduledAt", "desc"))
        const unsubscribe = onSnapshot(notifQuery, (response) => {
            const list = response.docs.map((snapshot) => {
                const data = snapshot.data();
                return {
                    id: snapshot.id,
                    ...data,
                    scheduledAt: data.scheduledAt.toDate()
                }
            })
            setNotifsList(list);
        })

        return () => unsubscribe();

    }, [user.id])

    const cancelNotif = useCallback(async (id) => {
        try {
            await Notifications.cancelScheduledNotificationAsync(id);
            alert("Notification cancelled");
        } catch (e) {
            alert("Failed to cancel");
        }
    }, []);

    const renderItem = useCallback(({ item }) => {
        return (
            <NotifCard item={item} cancel={cancelNotif} />
        )
    }, [cancelNotif])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>All scheduled notifications</Text>
            <FlatList
                data={notifsList}
                keyExtractor={(item) => item.id}
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
