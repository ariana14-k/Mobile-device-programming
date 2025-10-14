import { StyleSheet, Text, View, Button, StatusBar, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {Link, router} from 'expo-router'
const index = () => {
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState("")

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {id: Date.now().toString(), title: task}

    setTasks([...tasks, newTask])
    setTask("")
  }

  const renderSeparator = () => (
      <View style={styles.separator} />
  );

  const renderHeader = () => (
    <Text style={styles.listHeader}>Your Tasks</Text>
  )

  const renderFooter = () => (
    <Text style={styles.listFooter}>End of the list</Text>
  )

  const renderEmptyList = () => (
    <Text style={styles.emptyText}>No tasks yet. Please add one!</Text>
  )

  const deleteTask =(id) => {
    setTasks(tasks.filter((item) => item.id !== id))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ccc" barStyle="dark-content" />
      <Text style={styles.title}>Task Manager</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} value={task} onChangeText={setTask} placeholder='Add a new task...'/>
        <TouchableOpacity onPress={addTask}>
          <View style={styles.addBtn}>
            <Text>Add Task</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList style={styles.list} data={tasks} keyExtractor={(item) => item.id} renderItem={({item}) => (
        <View style={styles.taskItem}>
          <Link href="/task/1">
          <Text>{item.title}</Text>
          </Link>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{color: 'red'}}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyList}
      />

    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  },
  row: {
    paddingHorizontal: 20,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 5,
    marginLeft: 15,
    height: '100%',
    justifyContent: "center",
  },
  taskItem: {
    backgroundColor: "lightblue",
    padding:15,
    color: "#000",
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8
  },
  list: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 8,
  },
  listHeader: {
    fontSize: 24,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 10
  },
  listFooter: {
    fontSize:16,
    color: "gray",
    marginTop:10,
    textAlign: "center"
  },
  emptyText: {
    fontSize:16,
    color: "gray",
    marginTop:10,
    textAlign: "center"
  }
})