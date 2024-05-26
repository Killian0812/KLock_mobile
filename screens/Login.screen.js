import { useState } from 'react';
import { TouchableOpacity, TextInput, Text, View, StyleSheet, ScrollView } from 'react-native';
import { Formik } from 'formik';
import axiosPrivate from '../hooks/useAxios';
import * as SecureStore from 'expo-secure-store';
import useAuth from '../hooks/useAuth';

export default function LoginScreen({ navigation }) {

    const { setAuth } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async function (e) {
        console.log(username);
        console.log(password);
        try {
            const response = await axiosPrivate.post("/api/login/mobile", JSON.stringify({ username, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const setCookieHeader = response?.headers["set-cookie"][0];
            const refreshToken = setCookieHeader.substring(4, setCookieHeader.indexOf(';')); // get refreshtoken since set-cookie doest work on mobile
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            const fullname = response?.data?.fullname;
            const email = response?.data?.email;
            setAuth({ username, fullname, email, accessToken, roles });
            setUsername('');
            setPassword('');
            await SecureStore.setItemAsync("REFRESH_TOKEN", refreshToken); // save it to SecureStore cause cant save it http-only cookie like browser
            navigation.navigate('Main', { screen: 'Home' }); // navigate to a screen in a nested navigator
        } catch (error) {
            if (!error?.response) {
                alert('No Server Response')
                console.log(error);
            } else if (error.response?.status === 400) {
                console.log(error.response.data);
                alert(error.response.data);
            } else if (error.response?.status === 401) {
                console.log(error.response.data);
                alert('Unauthorized');
            } else {
                console.log(error.response.data);
                alert('Login Failed');
            }
        }
    }

    return (
        <View style={styles.layout}>
            <ScrollView contentContainerStyle={styles.loginSection}>
                <View style={styles.header}>
                    <Text style={styles.title}>Login</Text>
                </View>
                <Formik initialValues={{ username: '', password: '' }}>
                    {() => (
                        <>
                            <View style={styles.username}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput style={styles.input}
                                    onChangeText={(text) => { setUsername(text) }} value={username} />
                            </View>
                            <View style={styles.password}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput secureTextEntry={true} style={styles.input}
                                    onChangeText={(text) => { setPassword(text) }} value={password} />
                            </View>
                            <View style={styles.signin}>
                                <TouchableOpacity style={styles.button} onPress={() => { handleSubmit() }} disabled={(!username || !password) ? true : false}>
                                    <Text style={{ fontSize: 20 }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Formik>
                <View style={styles.signup}>
                    <Text style={styles.label}>Need an account?</Text>
                    <Text style={[styles.label, { marginTop: 30, textDecorationLine: "underline" }]}
                        onPress={() => navigation.navigate('Register')}>Sign Up</Text>
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#222222",
        fontFamily: "Quicksand-Regular",
    },
    loginSection: {
        width: 350,
        height: 500,
        borderRadius: 20,
        backgroundColor: "#141414",
        justifyContent: "center",
        alignItems: "center",
        top: 200
    },
    header: {
        position: "absolute",
        top: 30
    },
    title: {
        color: "#FFFFFF",
        fontSize: 40,
        fontFamily: "Quicksand-Bold"
    },
    username: {
        position: "absolute",
        top: 110,
    },
    label: {
        fontSize: 25,
        position: "absolute",
        color: "#FFFFFF",
        alignSelf: "center",
        fontFamily: "Quicksand-Regular",
    },
    input: {
        marginTop: 35,
        height: 50,
        width: 300,
        margin: 12,
        fontSize: 20,
        fontFamily: "Quicksand-Regular",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        padding: 10,
    },
    password: {
        position: "absolute",
        top: 210,
    },
    signin: {
        position: "absolute",
        top: 330,
        width: 230,
        height: 50,
        backgroundColor: "#BFBFBF",
        color: "#FFFFFF",
        borderRadius: 10,
    },
    button: {
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
    signup: {
        width: 300,
        position: "absolute",
        top: 410
    }
});