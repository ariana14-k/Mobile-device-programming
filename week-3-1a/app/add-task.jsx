import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import * as Notifications from 'expo-notifications';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
export default function AddTask() {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
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
      setModalType("success")
      setModalMessage("Task created successfully!");

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Task Added!",
          body: `Task ${newTask.title} has been added successfully.`,
          data: { taskId: taskRef.id }
        },
        trigger: null,
      })

      const notifsRef = collection(db, "users", user.id, "notifications");
      await addDoc(notifsRef, {
        notificationId: notificationId,
        taskTitle: newTask.title,
        taskId: taskRef.id,
        body: "New task added successfully!",
        title: "New Task",
        scheduledAt: new Date()
      })
    } catch (e) {
      console.log("Error saving task:", e);
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

        <TouchableOpacity
          onPressIn={() => (scale.value = 0.5)}
          onPressOut={() => (scale.value = 1)}
          onPress={handleAddTask}
        >
          <Animated.View style={[styles.addTaskBtn, animatedStyle]}>
            <Text style={styles.addTaskText}>Add New Task</Text>
          </Animated.View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 180
  },
  modalBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
});
