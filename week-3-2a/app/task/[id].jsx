import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/ConfirmModal";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
   const [modalVisible, setModalVisible] = useState(false)
    const [modalType, setModalType] = useState("")
    const [modalMessage, setModalMessage] = useState("")
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [id, user])

  const loadData = async () => {
    if (user) {
      try {
        const ref = doc(db, "users", user.uid, "tasks", id)
        const getData = await getDoc(ref);
        if (getData.exists()) {
          const fetchedData = getData.data();
          setTask({ id, ...fetchedData });
          setNewTitle(fetchedData.title)
          setLoading(false);
        }
      } catch (error) {
        console.log("Error loading task:", error);
      } finally {
        setLoading(false)
      }
    }

  }

  const saveTitle = async () => {
    if (!user) return;

    if (newTitle.trim() === "") {
        setModalType("error");
        setModalMessage("Title cannot be empty!");
        setModalVisible(true);
        return;
    }

    const updatedTask = {...task, title: newTitle};
    try {
      const ref = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(ref, updatedTask);
      setModalMessage("Task title updated successfully!");
      setModalVisible(true);
      setModalType("success");
    } catch (error) {
      console.log("error: ", error)
    }
  }

  const toggleCompleted = async () => {
    if (!user || !task) return;

    const updatedTask = {...task, completed: !task.completed}

    try {
      const ref = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(ref, updatedTask);
      setModalMessage(updatedTask.completed ? "Task marked as complete" : "Task marked as incomplete");
      setTask(updatedTask);
      setModalVisible(true);
      setModalType("success");
    } catch (error) {
      console.log("error: ", error)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: 'red', fontSize: 16 }}>No task found!</Text>
      </View>
    )
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
   