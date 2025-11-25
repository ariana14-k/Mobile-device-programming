import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc} from "firebase/firestore";
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!user) return;
        setLoading(true)
console.log("user", user)
        const tasksRef = collection(db, "users", user.id, "tasks")

        const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
            const fetchedData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(fetchedData)
            setLoading(false)
        },
            (error) => {
                console.log("Error loading tasks", error)
                setLoading(false)
            })

        return () => unsubscribe();
    }, [])

    const deleteTask = (task) => {
        setModalVisible(true);
        setModalType("error");
        setModalMessage(`Are you sure you want to delete "${task.title}"?`);
        setSelectedTask(task)
    };

    const handleOnConfirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "tasks", selectedTask.id));
            setModalType("success");
            setModalMessage("Task deleted successfully!");
        } catch (error) {
            setModalType("error");
            setModalMessage("Task cannot be deleted. Please try again!");
        } finally {
            setModalVisible(true);
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

    const fetchExternalAPI = async () => {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
            const data = await response.json();
            const newTasks = data.map((item) => ({
                id: item.id.toString(),
                title: item.title
            }))
            const mergedTasks = [
                ...tasks,
                ...newTasks.filter((task) => !tasks.some((existing) => existing.id === task.id))
            ]

            await AsyncStorage.setItem("tasks", JSON.stringify(mergedTasks));
            setTasks(mergedTasks);


        } catch (error) {
            console.log("Error fetching external API:", error);
        }
    }

    const renderFooter = () => (
        <Text style={styles.listFooter}>End of the list</Text>
    );

    const renderSeparator = () => (
        <View style={styles.separator} />
    );

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedTask(null)
    }

    if (authLoading || !user) {
        return null
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
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
                onClose={handleModalClose}
                showConfirm={selectedTask !== null}
                onConfirm={selectedTask ? handleOnConfirmDelete : null}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    row: { flex: 1, flexDirection: "row", marginBottom: 12 },
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
        minWidth: 250,
        gap: 20
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
        backgroundColor: "red",
        borderRadius: 8,
        padding: 10
    },
    modalCancelBtn: {
        backgroundColor: "gray",
        borderRadius: 8,
        padding: 10
    },
    fetchBtn: {
        backgroundColor: "#007AFF",
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
        width: 150,
        marginBottom: 15
    },
    fetchTitle: {
        color: "white",
        fontWeight: "bold",
    },
    completed: {
        textDecorationLine: "line-through",
        color: "#555"
    }
});