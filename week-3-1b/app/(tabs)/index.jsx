import { router } from "expo-router";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import TaskManager from "../../components/TaskManager";
import { useEffect, useState } from "react";
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from '../../firebase'
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const {user} =  useAuth();

  console.log("user", user)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email)
        setLoading(false)
      } else {
        setLoading(false)
        router.replace("/login")
      }
    })

    return () => unsubscribe();
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome {userEmail || "User"}!</Text>
      <TaskManager />

      <TouchableOpacity
        onPress={() => router.push("/add-task")}
        style={styles.addTaskBtn}
      >
        <Text style={styles.addTaskText}>
          Add New Task
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  addTaskBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    height: 40,
  },
  addTaskText: { color: "white", fontWeight: "bold" },
});
