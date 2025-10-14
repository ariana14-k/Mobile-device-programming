import { router } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";
import TaskManager from "../../components/TaskManager";

export default function Home() {
  return (
    <View style={{ flex: 1,  flexDirection: 'row',padding: 20 }}>
      <TaskManager />

      <TouchableOpacity
        onPress={() => router.push("/add-task")}
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 8,
          marginTop: 20,
          alignItems: "center",
          height: 40
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Add New Task
        </Text>
      </TouchableOpacity>
    </View>
  );
}
