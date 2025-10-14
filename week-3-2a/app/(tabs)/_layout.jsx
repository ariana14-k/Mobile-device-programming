import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function NavIcon({ name, color }) {
    return <Feather name={name} size={20} color={color} />;
}

export default function NavLayout() {
    //  TABS NAVIGATION
    //   return (
    //     <Tabs
    //       screenOptions={{
    //         tabBarActiveTintColor: "#007AFF",
    //         tabBarInactiveTintColor: "#888",
    //         tabBarStyle: {
    //           backgroundColor: "white",
    //           borderTopWidth: 0,
    //           elevation: 4,
    //           height: 70,
    //         },
    //         tabBarLabelStyle: {
    //           fontSize: 14,
    //           fontWeight: "600",
    //           marginBottom: 6,
    //         },
    //         headerStyle: {
    //           backgroundColor: "#007AFF",
    //         },
    //         headerTintColor: "white",
    //         headerTitleAlign: "center",
    //         headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    //       }}
    //     >
    //       <Tabs.Screen
    //         name="index"
    //         options={{
    //           title: "Tasks",
    //           tabBarIcon: ({ color }) => <NavIcon name="check-square" color={color} />,
    //         }}
    //       />
    //       <Tabs.Screen
    //         name="profile"
    //         options={{
    //           title: "Profile",
    //           tabBarIcon: ({ color }) => <NavIcon name="user" color={color} />,
    //         }}
    //       />
    //     </Tabs>
    //   );


    //  DRAWER NAVIGATION
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    drawerActiveTintColor: "#007AFF",
                    drawerInactiveTintColor: "#555",
                    drawerStyle: {
                        backgroundColor: "white",
                        width: 260,
                    },
                    headerStyle: {
                        backgroundColor: "#007AFF",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
                }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        title: "Tasks",
                        drawerIcon: ({ color }) => <NavIcon name="check-square" color={color} />,
                    }}
                />
                <Drawer.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        drawerIcon: ({ color }) => <NavIcon name="user" color={color} />,
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
