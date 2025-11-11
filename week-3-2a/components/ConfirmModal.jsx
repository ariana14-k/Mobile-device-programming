import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Modal } from 'react-native'
import { TouchableOpacity } from 'react-native'

const ConfirmModal = ({
    visible,
    type = "success",
    message,
    onClose,
    showConfirm,
    onConfirm
}) => {
    const isSuccess = type === "success"
  return (
    <Modal visible={visible} transparent animationType='fade'>
        <View style={styles.overlay}>
            <View style={[styles.box, isSuccess ? styles.successBox : styles.errorBox]}>
                <Text style={[styles.title, isSuccess ? styles.successText : styles.errorText]}>{isSuccess ? "Success" : "Error"}</Text>
                <Text>{message}</Text>
                <View style={styles.buttons}>
                    {showConfirm && onConfirm && (
                        <TouchableOpacity style={[styles.btn, isSuccess ? styles.successBtn : styles.errorBtn]}
                        onPress={() => {
                            onConfirm();
                            onClose();
                        }}>
                        <Text style={styles.btnText}>Confirm</Text>
                    </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.btn, {backgroundColor: "gray"}]}
                    onPress={onClose}>
                        <Text style={styles.btnText}>{showConfirm ? "Cancel" : "OK"}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    </Modal>
  )
}

export default ConfirmModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        width: "75%",
        alignItems: "center",
        borderWidth: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
    },
    // success styles
    successBox: { borderColor: "#28a745" },
    successText: { color: "#28a745" },
    successBtn: { backgroundColor: "#28a745" },
    // error styles
    errorBox: { borderColor: "#dc3545" },
    errorText: { color: "#dc3545" },
    errorBtn: { backgroundColor: "#dc3545" },
});