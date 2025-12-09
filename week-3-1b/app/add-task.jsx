import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import * as Notifications from "expo-notifications";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated"

export default function AddTask() {
    const [task, setTask] = useState("");
    const [error, setError] = useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState("")

    const { user } = useAuth();

    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));


    const handleAddTask = async () => {
        if (task.trim() === "") {
            setError("Task is required!");
            return;
        }

        if (task.length < 3) {
            setError("Task must be at least 3 characters!");
            return;
        }

        setError("")
        const newTask = { title: task, completed: false, createdAt: new Date() };
        try {
            await addDoc(collection(db, "users", user.id, "tasks"), newTask)
            setModalType("success")
            setModalMessage("Task created successfully!")
            setModalVisible(true);

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "New Task added!",
                    body: `Task ${newTask.title} has been added successfully!`
                },
                trigger: null
            })

        } catch (error) {
            console.log("Error saving task:", error);
        }



        setTask("");
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        router.push("/");

    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <Text style={styles.title}>Add New Task</Text>
                <Link href="/" style={{ marginTop: 10, color: "#007AFF" }}>
                    ← Back to Tasks
                </Link>
            </View>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter a new task"
                    value={task}
                    onChangeText={setTask}
                />
                <TouchableOpacity
                    onPressIn={() => (scale.value = 0.95)}
                    onPressOut={() => (scale.value = 1)}
                    onPress={handleAddTask}
                >
                    <Animated.View style={[styles.addTaskBtn, animatedStyle]}>
                        <Text style={styles.addTaskText}>Add New Task</Text>
                    </Animated.View>
                </TouchableOpacity>

            </View>
            {error ? <Text style={{ color: "red", marginTop: 5, fontSize: 14 }}>{error}</Text> : null}
            <ConfirmModal
                visible={modalVisible}
                message={modalMessage}
                onClose={handleModalClose}
                type={modalType}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    row: { flexDirection: "row", marginBottom: 12 },
    input: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        paddingHorizontal: 10,
        height: 40
    },
    addBtn: {
        backgroundColor: "#007AFF",
        marginLeft: 8,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderRadius: 8,
    },
    btnText: { color: "white", fontWeight: "bold" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "white",
        width: "80%",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: 180
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#000'
    },
    modalBtn: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        borderRadius: 8
    }
});
