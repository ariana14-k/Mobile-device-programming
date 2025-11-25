import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from "@expo/vector-icons"
import { auth } from "../../firebase"
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { router } from 'expo-router'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import * as ImagePicker from 'expo-image-picker';
import ConfirmModal from '../../components/ConfirmModal'
import { Image } from 'react-native'

const profile = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            const fetchUserData = async () => {
              const userRef = doc(db, "users", currentUser.uid);
              const docSnap = await getDoc(userRef);
              console.log(docSnap.data());
              setCurrentUser(docSnap.data());
              setLoading(false);
            }
            fetchUserData();
          } else {
            router.replace('/login');
          }
        })
      } else {
        router.replace('/login');
      }
    })

    return () => unsubscribe();
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log(error)
    }
  }

  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  }

   const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      showModal("error", "Permission to access media library is required!");
      return;
    }
  
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.5,
    });
  
    if (!results.canceled) {
      const base64Img = `data:image/jpg;base64,${results.assets[0].base64}`;
      const userRef = doc(db, "users", currentUser.id);
  
      try {
        await updateDoc(userRef, { image: base64Img });
        setCurrentUser(prev => ({ ...prev, image: base64Img }));
        showModal("success", "Image uploaded successfully!");
      } catch (error) {
        console.log(error);
        showModal("error", "Failed to update image. Please try again.");
      }
    }
  };

  const takePhoto = async () => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      showModal("error", "Permission to access camera is required!");
      return;
  }

  const results = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.5,
    });

    if (!results.canceled) {
      const base64Img = `data:image/jpg;base64,${results.assets[0].base64}`;
      const userRef = doc(db, "users", currentUser.id);
  
      try {
        await updateDoc(userRef, { image: base64Img });
        setCurrentUser(prev => ({ ...prev, image: base64Img }));
        showModal("success", "Image uploaded successfully!");
      } catch (error) {
        console.log(error);
        showModal("error", "Failed to update image. Please try again.");
      }
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.title}>Loading user...</Text>
      </View>
    )
  }
  console.log('currentUser', currentUser);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {currentUser.image ? (
        <Image source={{ uri: currentUser.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, {backgroundColor: "#E5E7EB"}]}>
          <Text>No Image</Text>
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {backgroundColor: "gray"}]} onPress={takePhoto}>
        <Text style={styles.btnText}>Take Image</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{currentUser.email}</Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{currentUser.uid}</Text>
      </View>

      <TouchableOpacity onPress={handleSignOut}>
        <View style={styles.logoutBtn}>
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign out</Text>
        </View>
      </TouchableOpacity>
      <ConfirmModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleCloseModal}
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
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    width: 120,
    marginBottom: 20,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  }
})