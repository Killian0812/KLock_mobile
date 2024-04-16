import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axiosPrivate from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&/~._-]{6,24}$/;

const ChangePasswordTab = () => {
    const { auth } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [matchPassword, setMatchPassword] = useState("");
    const [submitable, setSubmitable] = useState(false);
    const [msg, setMsg] = useState("");
    const [status, setStatus] = useState("error");

    useEffect(() => {
        if (currentPassword !== "" && newPassword !== "" && matchPassword !== "") setSubmitable(true);
    }, [currentPassword, newPassword, matchPassword]);

    const handleSubmit = () => {
        const v1 = PASSWORD_REGEX.test(newPassword);
        const v2 = newPassword === matchPassword;

        if (v1 && v2) {
            axiosPrivate
                .post("/home/changePassword", { username: auth.username, currentPassword, newPassword })
                .then(() => {
                    setStatus("success");
                    setMsg("Success: Password changed");
                })
                .catch((err) => {
                    setStatus("error");
                    if (err.response.status === 400) setMsg("Failed: Current password not correct");
                    if (err.response.status === 409) setMsg("Failed: Cannot change your password to the same one you are currently using");
                });
        } else {
            setStatus("error");
            if (!v2) setMsg("Failed: Confirm password does not match");
            else if (!v1)
                setMsg(
                    `Failed: Password must contain 6 to 24 characters. Must include uppercase letters, lowercase letters, and a number. Special characters allowed: "@ $ ! % * ? & / ~ . _ -".`
                );
        }
    };

    return (
        <View>
            <View style={styles.inputGroup}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Current password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={currentPassword}
                    onChangeText={(text) => setCurrentPassword(text)}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>New password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Confirm password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={matchPassword}
                    onChangeText={(text) => setMatchPassword(text)}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={[styles.message, { color: status === 'error' ? '#7c0000' : '#007a1a' }]}>{msg}</Text>
                <TouchableOpacity disabled={!submitable} onPress={handleSubmit} style={[styles.button, !submitable && styles.disabled]}>
                    <Text style={{ fontSize: 15, color: submitable ? "#fff" : "#3f3f3f" }}>Save password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#c6c6c6',
        width: 240,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
        fontSize: 15,
    },
    disabled: {
        backgroundColor: '#6b6b6b',
    },
    message: {
        width: 240,
        marginVertical: 10,
        fontSize: 16
    },
    button: {
        borderWidth: 1,
        backgroundColor: '#c6c6c6',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default ChangePasswordTab;
