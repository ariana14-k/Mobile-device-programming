import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import { memo } from 'react';

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

export default NotifCard;

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