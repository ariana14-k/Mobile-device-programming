import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import {router} from "expo-router";
import { useAuth } from "../context/AuthContext";
import {addDoc, collection} from "firebase/firestore"
import { db } from "../firebase";
import ConfirmModal from "../components/ConfirmModal";

export default function AddTask() {
    const [task, setTask] = useState("");
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState(false)
    const [modalType, setModalType] = useState("")
    const [modalMessage, setModalMessage] = useState("")

    const {user} = useAuth();

    const addTask = async () => {
        if (task.trim() === "") {
            setError("Task cannot be empty");
            return;
        }

        if (task.length < 3) {
            setError("Task cannot be less than 3 characters");
            return;
        }

        setError("")
        const newTask = {title: task, completed: false, createdAt: new Date() };
        try {
            await addDoc(collection(db, "users", user.uid, "tasks"), newTask);
            setModalType("success");
            setModalMessage("Task created successfully!");
            setModalVisible(true);

        } catch (error) {
            console.log("Error saving task:", error);
        }
        setTask("");
    };

    const handleCloseModal = () => {
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
                <TouchableOpacity style={styles.addBtn} onPress={addTask}>
                    <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
            </View>
            {error ? <Text style={{ fontSize: 14, color: 'red' }}>{error}</Text> : null}
            
            <ConfirmModal 
                visible={modalVisible}
                type={modalType}
                message={modalMessage}
                onClose={handleCloseModal}
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        height: 180,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    modalBtn: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8 
    }
});
