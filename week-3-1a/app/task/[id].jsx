import { useLocalSearchParams, Link } from "expo-router";
import { View, Text } from "react-native";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Task ID: {id}</Text>
      <Link href="/">← Back</Link>
    </View>
  );
}
