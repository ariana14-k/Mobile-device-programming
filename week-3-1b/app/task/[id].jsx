import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore"
import ConfirmModal from "../../components/ConfirmModal";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("")
   const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const {user} = useAuth();

  useEffect(() => {
    loadData();
  }, [id, user])

  const loadData = async () => {
    try {
      if (user) {
          const ref = doc(db, "users", user.uid, "tasks", id);
          const getTask = await getDoc(ref);
          if (getTask.exists()) {
            const data = getTask.data();
            setTask({id, ...data});
            setNewTitle(data.title)
            setLoading(false);
          }
        }
    } catch (error) {
      console.log("Error loading tasks:", error);
    } finally {
      setLoading(false)
    }
  }

  const saveTitle = async () => {
    if (newTitle.trim() === "") {
      setModalType("error");
      setModalMessage("Title cannot be empty!")
    }

    const updatedTask = {...task, title: newTitle}

    try {

      await updateDoc(doc(db, "users", user.uid, "tasks", id), updatedTask);
      setModalType("success");
      setModalMessage("Task title updated successfully!");
      setModalVisible(true);
      
    } catch (error) {
      console.log(error)
    }

  }

  const toggleCompleted = async () => {
    if (!user) return;

    const updatedTask = {...task, completed: !task.completed}
try {

      await updateDoc(doc(db, "users", user.uid, "tasks", id), updatedTask);
      setModalType("success");
      setModalMessage(updatedTask.completed ? "Task marked as completed!" : "Task marked as uncomplete!");
      setModalVisible(true);
      setTask(updatedTask)
      
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{color: 'red', fontSize: 20, fontWeight: 'bold'}}>Task not found!</Text>
        <Link href="/">← Back to tasks</Link>
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