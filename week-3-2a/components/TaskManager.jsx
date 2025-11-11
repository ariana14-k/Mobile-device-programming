import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import {onSnapshot, collection, query, orderBy, doc, deleteDoc} from "firebase/firestore"
import { db } from "../firebase";
import ConfirmModal from "./ConfirmModal";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)
    const [modalType, setModalType] = useState("")
    const [modalMessage, setModalMessage] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const {user} = useAuth();

  useEffect(() => {
      if (!user) return;
      setLoading(true);

      const tasksRef = collection(db, "users", user.uid, "tasks");

      const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(tasksQuery, (results) => {
        if (results) {
          const fetchedData = results.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setTasks(fetchedData);
          setLoading(false);
        }
      })

      return () => unsubscribe()

    }, [user])


  const deleteTask = async (task) => {
    setModalVisible(true);
    setModalType("error");
    setModalMessage(`Are you sure you want to delete "${task.title}"?`);
    setSelectedTask(task);
  };

  const handleOnConfirmDelete = async () => {
     try {
      await deleteDoc(doc(db, "users", user.uid, "tasks", selectedTask.id));
      setModalType("success");
      setModalMessage("Task deleted successfully");
      setModalVisible(false);
    } catch (e) {
      console.log("Error deleting task", e);
    }
  } 

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  }

  const fetchExternalTasks = async () => {
  setLoading(true);
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    const data = await response.json();
    const newTasks = data.map((item) => ({
        id: item.id.toString(),
        title: item.title
    }))

    const mergedTasks = [
        ...tasks,
        ...newTasks.filter((item) => !tasks.some((existing) => existing.id === item.id))
    ]
    setTasks(mergedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(mergedTasks));
  } catch (e) {
    console.log("Error fetching tasks", e);
  } finally {
    setLoading(false);
  }
};

  const renderEmpty = () => (
    <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
  );

  const renderHeader = () => (
    <View>
      <Text style={styles.listHeader}>Your Tasks</Text>
      {/* <TouchableOpacity style={styles.fetchBtn} onPress={fetchExternalTasks}>
        <Text style={styles.fetchText}>Fetch Example Tasks (API)</Text>
      </TouchableOpacity> */}
    </View>
  );

  const renderFooter = () => (
    <Text style={styles.listFooter}>End of the list</Text>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          style={styles.container}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Link href={`/task/${item.id}`}>
                <Text style={item.completed ? styles.completed : null}>{item.title}</Text>
              </Link>
              <TouchableOpacity onPress={() => deleteTask(item)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
        />
      )}

      <ConfirmModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        showConfirm={selectedTask !== null}
        onConfirm={selectedTask ? handleOnConfirmDelete : null}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    elevation: 2,
    minWidth: 250, 
    gap: 20
  },
  separator: { height: 8 },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  listFooter: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  fetchBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
    width: 200,
  },
  fetchText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#555"
  }
});
