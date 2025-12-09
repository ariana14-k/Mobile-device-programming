import { router } from "expo-router";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import TaskManager from "../../components/TaskManager";
import { useAuth } from "../../context/AuthContext";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useCallback } from "react";

export default function Home() {
  const { user, loading } = useAuth();

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAddTask = useCallback(() => {
    router.push("/add-task");
  }, []);

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Animated.Text
        entering={FadeIn.duration(700)}
        style={styles.welcome}
      >
        Welcome {user.email || "User"}
      </Animated.Text>
      <TaskManager />

      {/* <TouchableOpacity
        onPress={handleAddTask}
        style={styles.addTaskBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.addTaskText}>
          Add New Task
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPressIn={() => (scale.value = 0.95)}
        onPressOut={() => (scale.value = 1)}
        onPress={handleAddTask}
      >
        <Animated.View style={[styles.addTaskBtn, animatedStyle]}>
          <Text style={styles.addTaskText}>
            Add New Task
          </Text>
        </Animated.View>

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