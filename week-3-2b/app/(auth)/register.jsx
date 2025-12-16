import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {auth} from "../../firebase"
import {router} from "expo-router"

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const validateInputs = () => {
        if (email.trim() === "" || password.trim() === "" || confirmPassword.trim() ==="") {
            setError("All fields are required");
            return false;
        }

        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(email)) {
            setError("Email is not valid");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        setError("")
        return true;
    }

    const handleSignUp = async () => {
        if (!validateInputs()) return;
        setLoading(true)
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setLoading(false)
            setModalVisible(true);
            
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("Email already exists");
            } else {
                setError(error.message)
            }
            setLoading(false)
        }

    }

    const handleModalClose = () => {
        setModalVisible(false);
        router.push("/login");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                style={styles.input}
            />

            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            <TextInput
                placeholder='Confirm Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
                <Text style={styles.btnText}>{loading ? "Creating user..." : "Create"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>router.push("/login")}>
                <Text style={styles.link}>Already have an account? Log In</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>User created successfully!</Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity onPress={handleModalClose}>
                                <Text style={styles.modalBtn}>OK</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Register

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 25, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginVertical: 5,
        borderRadius: 8
    },
    btn: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 8,
        marginTop: 15
    },
    btnText: { color: "white", textAlign: "center", fontWeight: "600" },
    link: { marginTop: 10, textAlign: "center", color: "#007AFF" },
    error: { color: "red", marginTop: 10, textAlign: "center" },
    modalOverlay: {
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
        justifyContent: "center",
        width: "100%"
    },
    modalBtn: {
        backgroundColor: "#007AFF",
        color: "white",
        padding: 10,
        borderRadius: 8
    }
});