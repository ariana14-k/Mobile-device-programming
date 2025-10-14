import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, color: "red" }}>Page not found</Text>
      <Link href="/" style={{ color: "#007AFF", marginTop: 10 }}>
        Go back home
      </Link>
    </View>
  );
}
