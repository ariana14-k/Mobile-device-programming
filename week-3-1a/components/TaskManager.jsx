import { Link } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import ConfirmModal from "./ConfirmModal";

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        if (!user) return;
        setLoading(true)

        const tasksRef = collection(db, "users", user.uid, "tasks")

        const ordered = query(tasksRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(ordered, (snapshot) => {
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


    const fetchExternalAPI = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
            const data = await response.json();
            const newData = data.map((item) => ({
                id: item.id.toString(),
                title: item.title
            }))
            const mergedTasks = [
                ...tasks,
                ...newData.filter((item) => !tasks.some((task) => task.id === item.id))
            ]
            setTasks(mergedTasks);
            await AsyncStorage.setItem("tasks", JSON.stringify(mergedTasks));
            console.log("Fetched data from external API:", data);

        } catch (error) {
            console.log("Error fetching external API:", error);
        } finally {
            setLoading(false);
        }
    }

    const deleteTask = (task) => {
        setSelectedTask(task);
        setModalVisible(true);
        setModalMessage(`Are you sure you want to delete "${task.title}"?`)
        setModalType("error");
    };

    const handleOnConfirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "tasks", selectedTask.id));

            setModalVisible(true);
            setModalType("success");
            setModalMessage("Task deleted successfully!");
        } catch (error) {
            setModalVisible(true);
            setModalType("error");
            setModalMessage("Task could not delete. Please try again!");
        }

    }

    const handleModalClose = async () => {
        setModalVisible(false);
        setSelectedTask(null);
    }

    const renderEmpty = () => (
        <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
    );

    const renderHeader = () => (
        <View>
            <Text style={styles.listHeader}>Your Tasks</Text>
            {/* <TouchableOpacity style={styles.fetchBtn} onPress={fetchExternalAPI}>
                <Text style={styles.fetchText}>Fetch Example Tasks (API)</Text>
            </TouchableOpacity> */}
        </View>
    );

    const renderFooter = () => (
        <Text style={styles.listFooter}>End of the list</Text>
    );

    const renderSeparator = () => (
        <View style={styles.separator} />
    );

    return (
        <View>
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
    separator: { height: 8 },
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
    fetchBtn: {
        backgroundColor: "#007AFF",
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 10,
        width: 200,
    },
    fetchText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    modalOVerlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBox: {
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
        width: "80%",
        minHeight: 180
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    modalBtnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    modalBtn: {
        backgroundColor: "red",
        color: "white",
        padding: 10,
        borderRadius: 8
    },
    modalCancelBtn: {
        backgroundColor: "gray",
        color: "black",
        padding: 10,
        borderRadius: 8
    },
    completed: {
        textDecorationLine: "line-through",
        color: "#555"
    }
});