import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { router } from "expo-router";
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import Animated, {FadeIn, ZoomIn} from 'react-native-reanimated';

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  }

  const handleModalClose = () => {
    setModalVisible(false);
    router.push("/");

  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      const userRef = doc(db, "users", user.id);

      try {
        await updateDoc(userRef, { image: base64Img });
        setUser(prev => ({ ...prev, image: base64Img }));
        showModal("success", "Image uploaded successfully!");
      } catch (error) {
        console.log(error);
        showModal("error", "Failed to update image. Please try again.");
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      showModal("error", "Permission to access camera is required!");
      return;
    }

    let results = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.5,
    });

    if (!results.canceled) {
      const base64Img = `data:image/jpg;base64,${results.assets[0].base64}`;
      const userRef = doc(db, "users", user.id);

      try {
        await updateDoc(userRef, { image: base64Img });
        setUser(prev => ({ ...prev, image: base64Img }));
        showModal("success", "Image uploaded successfully!");
      } catch (error) {
        console.log(error);
        showModal("error", "Failed to update image. Please try again.");
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading user info...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.duration(700)} style={styles.title}>Profile</Animated.Text>

      {user.image ? (
        <Animated.Image
          entering={ZoomIn.duration(600)}
          source={{ uri: user.image }}
          style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }} />
      ) : (
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}>
          <Text>No image</Text>
        </View>

      )}

      <TouchableOpacity style={styles.btn} onPress={pickImage} activeOpacity={0.7}>
        <Text style={styles.btnText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: "#34C759" }]} onPress={takePhoto}>
        <Text style={styles.btnText}>Take Photo</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>

        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Feather name="log-out" size={22} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
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
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    width: 150,
    alignItems: "center"
  },
  btnText: {
    color: "white",
    fontWeight: "600"
  },
});

export default Profile;