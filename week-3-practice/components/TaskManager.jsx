import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState } from "react";

export default function TaskManager() {
    const [tasks, setTasks] = useState([
        {id: '1', title: 'Work on assignment'},
        {id: '2', title: 'Make Lunch'},
        {id: '3', title: 'Clean the house'},
    ]);
    
      const deleteTask = (id) => {
        setTasks(tasks.filter((item) => item.id !== id));
      };
    
      const renderEmpty = () => (
        <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
      );
    
      const renderHeader = () => (
        <Text style={styles.listHeader}>Your Tasks</Text>
      );
    
      const renderFooter = () => (
        <Text style={styles.listFooter}>End of the list</Text>
      );
    
      const renderSeparator = () => (
        <View style={styles.separator} />
      );

    return (
        <FlatList
            style={styles.container}
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.taskItem}>
                    <Link href={`/task/${item.id}`}>
                        <Text>{item.title}</Text>
                    </Link>                    
                    <TouchableOpacity onPress={() => deleteTask(item.id)}>
                        <Text style={{ color: "red" }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
            ItemSeparatorComponent={renderSeparator}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
        />
    )
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
});