import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20 }}>Faqja nuk u gjet</Text>
      <Link href="/">Kthehu në faqen kryesore</Link>
    </View>
  );
}

