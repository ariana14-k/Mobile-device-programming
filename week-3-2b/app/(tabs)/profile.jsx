import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { Feather } from "@expo/vector-icons"
import { auth, db } from "../../firebase"
import { signOut } from 'firebase/auth'
import { useAuth } from '../../context/AuthContext'
import * as ImagePicker from 'expo-image-picker';
import ConfirmModal from '../../components/ConfirmModal'
import { doc, updateDoc } from 'firebase/firestore'
import { Image } from 'react-native'
import Animated, { ZoomIn } from 'react-native-reanimated'

const profile = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const { user, logout, loading, setUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showModal("error", "Permission to access media library is required!")
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true
    })

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
      const userRef = doc(db, "users", user.id);
      try {
        await updateDoc(userRef, { image: base64Img });
        setUser(prev => ({ ...prev, image: base64Img }));
        showModal("success", "Profile image updated successfully!")
      } catch (error) {
        showModal("error", "Image cannot be updated. Please try again!")
      }
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      showModal("error", "Permission to access camera is required!")
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.5,
      base64: true
    })

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
      const userRef = doc(db, "users", user.id);
      try {
        await updateDoc(userRef, { image: base64Img });
        setUser(prev => ({ ...prev, image: base64Img }));
        showModal("success", "Profile image uploaded successfully!")
      } catch (error) {
        showModal("error", "Image cannot be uploaded. Please try again!")
      }
    }
  }

  const handleModalClose = () => {
    setModalVisible(false);
  }

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.welcome}>Loading user info...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user.image ? (
        <Animated.Image entering={ZoomIn.duration(600)} style={{width: 120, height: 120, borderRadius: 60, marginBottom: 20}} source={{ uri: user.image }} />
      ) : (
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "#E5E7EB", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
          <Text>No image</Text>
        </View>
      )}
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {backgroundColor: "gray"}]} onPress={takePhoto}>
        <Text style={styles.btnText}>Take Photo</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>

      <TouchableOpacity onPress={logout}>
        <View style={styles.logoutBtn}>
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign out</Text>
        </View>
      </TouchableOpacity>
      <ConfirmModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </View>
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 40,
  },
  label: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#FF3B30",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  btn: {
    width: 150,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#007AFF",
    marginBottom: 20,
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  }
});