import { router } from "expo-router";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import TaskManager from "../../components/TaskManager";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {onAuthStateChanged} from 'firebase/auth'
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user, setUser, logout, loading } = useAuth();

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading...</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome {user.email || "User"}</Text>
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

