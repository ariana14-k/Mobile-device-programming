import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import {addDoc, collection} from "firebase/firestore"
import {db} from "../firebase"
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

export default function AddTask() {
    const [task, setTask] = useState("");
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("")
    const [modalMessage, setModalMessage] = useState("")

    const {user} = useAuth();

    const addTask = async () => {
        if (task.trim() === "") {
            setError("Task is required");
            return;
        }

        if (task.length < 3) {
            setError("Task must be at least 3 characters!");
            return;
        }

        setError("");
        const newTask = { title: task, completed: false, createdAt: new Date() };

        try {
            await addDoc(collection(db, "users", user.uid, "tasks"), newTask);
            setTask("");
            setModalVisible(true);
            setModalType("success");
            setModalMessage("Task created successfully!")
        } catch (error) {
            console.log("Error adding task:", error);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        router.push("/")
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
                <TouchableOpacity style={styles.addBtn} onPress={addTask}>
                    <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
            </View>
            {error ? <Text style={{color: 'red', fontSize: 14}}>{error}</Text> : null}
            <ConfirmModal
                visible={modalVisible}
                type={modalType}
                message={modalMessage}
                onClose={handleModalClose}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {padding: 20 },
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
        alignItems: "center"
    },
    modalBox: {
        backgroundColor: "white",
        padding: 20,
        width: "80%",
        minHeight: 180,
        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: 12
    },
    modalTitle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20
    },
    modalBtn: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        padding: 10
    },
});
