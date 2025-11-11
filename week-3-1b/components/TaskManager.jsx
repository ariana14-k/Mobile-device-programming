import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import ConfirmModal from "./ConfirmModal";

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        setLoading(true)

        const tasksRef = collection(db, "users", user.uid, "tasks");
        const dataQuery = query(tasksRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
            const fetchedData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))

            setTasks(fetchedData);
            setLoading(false);
        })

        return () => unsubscribe();

    }, [])


    const fetchExternalAPI = async () => {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
            const data = await response.json();
            const newTasks = data.map((item) => ({
                id: item.id.toString(),
                title: item.title
            }))

            const updatedTasks = [
                ...tasks,
                ...newTasks.filter((newItem) => !tasks.some((existingItem) => existingItem.id === newItem.id))
            ]

            await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
            setTasks(updatedTasks)

        } catch (error) {
            console.log("Error fetching external API:", error);
        }
    }

    const deleteTask = (task) => {
        setModalVisible(true);
        setModalType("error");
        setModalMessage(`Are you sure you want to delete "${task.title}"`);
        setSelectedTask(task);
    };

    const handleOnConfirmDelete = async () => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "users", user.uid, "tasks", selectedTask.id));
            setModalType("success");
            setModalMessage("Task deleted successfully!")
            setModalVisible(false)

        } catch (error) {
            console.log("error: ", error)
        }

    }
    const renderEmpty = () => (
        <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
    );

    const renderHeader = () => (
        <View style={{ flex: 1 }}>
            <Text style={styles.listHeader}>Your Tasks</Text>
            {/* <TouchableOpacity onPress={fetchExternalAPI}>
                <View style={styles.fetchBtn}>
                    <Text style={styles.fetchTitle}>Fetch External API</Text>
                </View>
            </TouchableOpacity> */}

        </View>
    );

    const renderFooter = () => (
        <Text style={styles.listFooter}>End of the list</Text>
    );

    const renderSeparator = () => (
        <View style={styles.separator} />
    );

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedTask(null);
    }

    return (
        <View style={{ flex: 1, width: '100%' }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    style={styles.container}
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Link href={`/task/${item.id}`}>
                                <Text style={item.completed ? styles.completed : null}>{item.title}</Text>
                            </Link>
                            <TouchableOpacity onPress={() => deleteTask(item)}>
                                <Text style={{ color: "red" }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ItemSeparatorComponent={renderSeparator}
                    ListEmptyComponent={renderEmpty}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                />
            )}

            <ConfirmModal
                visible={modalVisible}
                type={modalType}
                message={modalMessage}
                showConfirm={selectedTask !== null}
                onConfirm={selectedTask ? handleOnConfirmDelete : null}
                onClose={handleModalClose}
            />
        </View>
    )
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
    taskItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "lightblue",
        padding: 12,
        borderRadius: 8,
        marginBottom: 4,
        elevation: 2,
    },
    separator: {
        height: 8,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#888",
    },
    listHeader: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
    },
    listFooter: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 14,
        color: "#666",
    },
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
        backgroundColor: "red",
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        borderRadius: 8
    },
    modalCancelBtn: {
        backgroundColor: "gray",
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
        borderRadius: 8
    },
    fetchBtn: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        width: 150
    },
    fetchTitle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    completed: {
        textDecorationLine: "line-through",
        color: "#555"
    }
});