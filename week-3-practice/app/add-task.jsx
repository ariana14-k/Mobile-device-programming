import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import * as Notifications from "expo-notifications";

export default function AddTask() {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const { user } = useAuth();

  const addTask = async () => {
    if (task.trim() === "") {
      setError("Task name is required.");
      return;
    }
    if (task.length < 3) {
      setError("Task name must be at least 3 characters long.");
      return;
    }

    setError("");
    const newTask = { title: task, completed: false, createdAt: new Date() };

    try {
      const taskRef = await addDoc(collection(db, "users", user.id, "tasks"), newTask);
      setTask("");
      setModalVisible(true);
      setModalType("success");
      setModalMessage("Task created successfully!");

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Task Added!",
          body: `Task "${newTask.title}" created successfully!`,
          sound: true,
          priority: Notifications.AndroidImportance.HIGH,
          data: {
            taskId: taskRef.id,
          },
        },
        trigger: null,
      });

      await addDoc(collection(db, "users", user.id, "notifications"), {
        notificationId: notificationId,
        taskId: taskRef.id,
        taskTitle: task.title,
        title: "New Task added!",
        body: `Task ${newTask.title} has been added successfully!`,
        scheduledAt: new Date(),
      });
    } catch (e) {
      setModalType("error");
      setModalMessage("Failed to add task");
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.title}>Add New Task</Text>
        <Link href="/" style={{ marginTop: 10, color: "#007AFF" }}>
          ← Back to Tasks
        </Link>
      </View>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <ConfirmModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    height: 40,
  },
  addBtn: {
    backgroundColor: "#007AFF",
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});