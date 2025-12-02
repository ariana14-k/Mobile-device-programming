import { useEffect, useState } from "react";
import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import ConfirmModal from "../../../components/ConfirmModal";
import * as Notifications from "expo-notifications";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [notificationId, setNotificationId] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (user) {
          const ref = doc(db, "users", user.id, "tasks", id);
          const getTask = await getDoc(ref);
          if (getTask.exists()) {
            const data = getTask.data();
            setTask({ id, ...data });
            setNewTitle(data.title)
            setLoading(false);
          }
        }
      } catch (e) {
        console.log("Error loading task:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, user]);

  const saveTitle = async () => {
    if (newTitle.trim() === "") {
      setModalType("error");
      setModalMessage("Title cannot be empty");
      setModalVisible(true);
      return;
    }

    const updated = { ...task, title: newTitle };
    setTask(updated);

    try {
      if (user) {
        await updateDoc(doc(db, "users", user.id, "tasks", id), {
          title: updated.title
        })

        setModalType("success");
        setModalMessage("Title updated successfully");
      }
    } catch (error) {
      setModalType("error");
      setModalMessage("Failed to update task title")
    } finally {
      setModalVisible(true)
    }

  }

  const toggleCompleted = async () => {
    if (!task) return;
    const updated = { ...task, completed: !task.completed };

    setTask(updated);

    try {
      if (user) {
        await updateDoc(doc(db, "users", user.id, "tasks", id), {
          completed: updated.completed
        })

        setModalType("success");
        setModalMessage(updated.completed ? "Task marked as completed!" : "Task marked as incomplete");
      }
    } catch (error) {
      setModalType("error");
      setModalMessage("Failed to update task")
    } finally {
      setModalVisible(true)
    }
  }

  const setReminder = async () => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder ⏰",
        body: `Don't forget: ${task.title}`,
        sound: true,
        data: {
          type: "reminder",
          taskId: id,
        }
      },
      trigger: {
        seconds: 10,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder",
        body: `Do you want to complete: ${task.title}?`,
        categoryIdentifier: "taskCategory",
        data: { taskId: id }
      },
      trigger: {
        seconds: 5,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      }
    });


    setNotificationId(notificationId);
  }

  const cancelReminder = async () => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Task not found</Text>
        <Link href="/" style={styles.link}>← Back</Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title:</Text>
      <TextInput
        value={newTitle}
        onChangeText={setNewTitle}
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveTitle}>
        <Text style={styles.saveText}>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleBtn,
          { backgroundColor: task.completed ? "green" : "gray" },
        ]}
        onPress={toggleCompleted}
      >
        <Text style={styles.toggleText}>
          {task.completed ? "Completed" : "Mark as Completed"}
        </Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            { backgroundColor: "green" },
          ]}
          onPress={setReminder}
        ><Text>Set reminder</Text></TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            { backgroundColor: "gray" },
          ]}
          onPress={cancelReminder}
        ><Text>Cancel reminder</Text></TouchableOpacity>
      </View>

      <Link href="/" style={styles.link}>
        ← Back to Tasks
      </Link>

      <ConfirmModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    width: "80%",
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveText: { color: "white", fontWeight: "bold" },
  toggleBtn: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  toggleText: {
    color: "white",
    fontWeight: "600",
  },
  notFound: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
  },
});
