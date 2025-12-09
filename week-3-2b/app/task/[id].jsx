import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDoc, doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import ConfirmModal from "../../components/ConfirmModal";
import * as Notifications from "expo-notifications"

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("")
  const [modalMessage, setModalMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [notificationId, setNotificationId] = useState("");

  useEffect(() => {
    loadData();
  }, [id])

  const loadData = async () => {
    try {
      if (user) {
          const ref = doc(db, "users", user.id, "tasks", id);
          const getTask = await getDoc(ref);
          if (getTask.exists()) {
            const data = getTask.data();
            setTask({id, ...data});
            setNewTitle(data.title)
            setLoading(false);
          }
        }


    } catch (error) {
      console.log("Error loading task data:", error);
    } finally {
      setLoading(false);
    }
  }

  const updateTitle = async () => {
    if (newTitle.trim() === "") return;

    const updatedTask = {...task, title: newTitle}
    try {
      const taskRef = doc(db, "users", user.id, "tasks", id);
      await updateDoc(taskRef, updatedTask);
      setModalType("success");
      setModalMessage("Task title updated successfully!");
      setModalVisible(true);
      setTask(updatedTask);
      
    } catch (error) {
      console.log("error: ", error)
      
    }
  }

  const toggleCompleted = async () => {
    if (!user) return;
    const updatedTask = {...task, completed: !task.completed}
    try {
      const taskRef = doc(db, "users", user.id, "tasks", id);
      await updateDoc(taskRef, updatedTask);
      setModalType("success");
      setModalMessage(updatedTask.completed ? "Task marked as complete!" : "Task marked as incomplete!");
      setModalVisible(true);
      setTask(updatedTask);
      
    } catch (error) {
      console.log("error: ", error)
      
    }
  }

  const setReminder = async () => {
    const notifsId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Set reminder",
        body: `A reminder for task ${task.title}`,
        sound: true,
        data: {
          taskId: id
        }
      },
      trigger: {
        seconds: 10,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
      }
    })

    const ref = collection(db, "users", user.id, "notifications")
    await addDoc(ref, {
      notificationId: notifsId,
      title: "New reminder",
      body: "New reminder has been set!",
      taskTitle: task.title,
      taskId: id,
      scheduledAt: new Date(Date.now() + 10 * 1000)
    })

    setNotificationId(notifsId)

    // await Notifications.scheduleNotificationAsync({
    //             content: {
    //                 title: "New Task added!",
    //                 body:  `Task ${task.title} has been added successfully!`,
    //                 sound: true,
    //                 categoryIdentifier: "taskCategory",
    //                 data: {
    //                   taskId: id
    //                 }
    //             },
    //             trigger: {
    //                 seconds: 7,
    //                 type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
    //             }
    //         })
  }

  const cancelNotification = async () => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    setNotificationId("");
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: 'bold', color: "red" }}>Task not found!</Text>

        <Link href="/">← Back</Link>
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
   
         <TouchableOpacity style={styles.saveBtn} onPress={updateTitle}>
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

         <TouchableOpacity
           style={[
             styles.toggleBtn,
             { backgroundColor: "blue" },
           ]}
           onPress={setReminder}
         >
           <Text style={styles.toggleText}>
            Set Reminder
           </Text>
         </TouchableOpacity>

         <TouchableOpacity
           style={[
             styles.toggleBtn,
             { backgroundColor: "gray" },
           ]}
           onPress={cancelNotification}
         >
           <Text style={styles.toggleText}>
            Cancel Notification
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
   