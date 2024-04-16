import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useSocket from '../../hooks/useSocket';

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const FULLNAME_REGEX = /^(?!\d+$).+$/;

const ProfileTab = ({ navigation }) => {
    const { auth, setAuth } = useAuth();
    const { socket, setSocket } = useSocket();
    const axiosPrivate = useAxiosPrivate();

    const [initialEmail] = useState(auth.email);
    const [email, setEmail] = useState(auth.email);
    const [initialFullname] = useState(auth.fullname);
    const [fullname, setFullname] = useState(auth.fullname);
    const [changesMade, setChangesMade] = useState(false);

    const [msg, setMsg] = useState("");
    const [status, setStatus] = useState("error");

    const logout = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync("REFRESH_TOKEN");
            await SecureStore.deleteItemAsync("REFRESH_TOKEN");
            // await SecureStore.deleteItemAsync("USERNAME");
            // await SecureStore.deleteItemAsync("ACCESS_TOKEN");
            if (refreshToken)
                await axiosPrivate.post('/logout/mobile', ({ refreshToken: refreshToken }));
            socket.close();
            setSocket(null);
            navigation.navigate("Login");
        } catch (error) {
            console.error(error);
        }
    };
    const handleLogout = async () => {
        Alert.alert(
            "Logout confirmation",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Logout", onPress: () => logout() }
            ],
            { cancelable: false }
        );
    }

    useEffect(() => {
        const emailChanged = (email !== initialEmail);
        const fullnameChanged = (fullname !== initialFullname);
        setChangesMade(emailChanged || fullnameChanged);
    }, [email, initialEmail, fullname, initialFullname]);

    useEffect(() => {
        return setMsg('');
    }, []);

    const handleSubmit = () => {
        const v1 = EMAIL_REGEX.test(email);
        let trimmedFullname = fullname.replace(/\s+/g, ' ');
        const v2 = FULLNAME_REGEX.test(trimmedFullname);
        setFullname(trimmedFullname);
        if (v1 && v2) {
            axiosPrivate.post("/home/updateUserInfo", { username: auth.username, fullname, email })
                .then(() => {
                    setStatus("success");
                    setAuth({ ...auth, fullname: fullname, email: email })
                    setMsg("Success: Information have been updated");
                }).catch(() => {
                    setStatus("error");
                    setMsg("Failed: Unexpected error");
                })
        }
        else {
            setStatus("error");
            if (!v1)
                setMsg("Failed: Not a valid email address");
            if (!v2)
                setMsg("Failed: Not a valid fullname");
        }
    }

    return (
        <View>
            <View style={styles.inputGroup}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Username:</Text>
                <TextInput style={[styles.input, styles.disabled]} readOnly>{auth.username}</TextInput>
            </View>
            <View style={styles.inputGroup}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Fullname:</Text>
                <TextInput value={fullname} onChangeText={(text) => setFullname(text)} style={styles.input} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Email:</Text>
                <TextInput value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Roles:</Text>
                <TextInput style={[styles.input, styles.disabled]} readOnly>{auth.roles.toString()}</TextInput>
            </View>
            <Text style={[styles.message, { color: status === 'error' ? '#7c0000' : '#007a1a' }]}>{msg}</Text>
            <View style={styles.inputGroup}>
                <TouchableOpacity disabled={!changesMade} onPress={handleSubmit} style={[styles.button, changesMade ? null : styles.disabled]}>
                    <Text style={[{ fontSize: 15 }, changesMade ? null : { color: '#3f3f3f' }]}>Save changes</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.logoutBtn}>
                <TouchableOpacity onPress={handleLogout} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name='logout' size={20} color={'#c91212'} />
                    <Text style={styles.logoutText}>Sign out</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

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
    logoutBtn: {
        marginTop: 60,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        width: 120,
        backgroundColor: '#434343',
    },
    logoutText: {
        fontSize: 15,
        color: '#c91212'
    }
});

export default ProfileTab;
