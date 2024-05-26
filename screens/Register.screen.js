import { TouchableOpacity, TextInput, Text, View, StyleSheet, ScrollView } from 'react-native';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import axiosPrivate from '../hooks/useAxios';

const USERNAME_REGEX = /^[a-zA-Z0-9-_]{3,21}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&/~._-]{6,24}$/;

export default function RegisterScreen({ navigation }) {

    // required inputs
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [matchPassword, setMatchPassword] = useState('');

    // check valid inputs (with regex)
    const [validUsername, setValidUsername] = useState(false);
    const [validFullname, setValidFullname] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidFullname(fullname !== "");
    }, [fullname])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    const handleSubmit = async function (e) {
        console.log(`${username} ${email} ${fullname} ${password}`);
        try {
            const response = await axiosPrivate.post("/api/register",
                JSON.stringify({ username, email, fullname, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response.data);
            setSuccess(true);
            setUsername('');
            setEmail('');
            setPassword('');
            setMatchPassword('');
        } catch (error) {
            if (!error?.response) {
                alert('No Server Response');
            } else if (error.response?.status === 409) {
                if (error.response.data.taken === 1)
                    alert('Email Taken');
                else
                    alert('Username Taken');
            } else {
                alert('Registration Failed');
            }
        }
    }

    const registerAgain = (e) => {
        setSuccess(false);
    }

    return (
        <>
            {success ? (
                <View style={styles.layout} >
                    <ScrollView contentContainerStyle={styles.successSection}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Successfully Registered</Text>
                        </View>
                        <Text style={{ position: "absolute", top: 200, color: "#FFFFFF", fontSize: 20 }}>SWIPE LEFT</Text>
                        <Text style={{ position: "absolute", top: 220, color: "#FFFFFF", fontSize: 20 }}>or</Text>
                        <View style={[styles.signin, { top: 250, height: 70 }]}>
                            <TouchableOpacity style={[styles.button, { height: 70 }]} onPress={() => { navigation.navigate('Login') }}>
                                <Text style={{ fontSize: 25 }}>Click to Login</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.label, { top: 400, textDecorationLine: "underline", fontSize: 20 }]}
                            onPress={() => registerAgain()}>Register another account</Text>
                    </ScrollView>
                </View >
            ) : (
                <View style={styles.layout} >
                    <ScrollView contentContainerStyle={styles.registerSection}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Register</Text>
                        </View>
                        <Formik initialValues={{ username: '', password: '', matchPassword: '' }}>
                            {() => (
                                <>
                                    <View style={styles.username}>
                                        <Text style={styles.label}>Username
                                            {username ? (
                                                <>
                                                    {validUsername ? <Icon name="check" size={30} color="#32CD32" />
                                                        : <Icon name="times" size={30} color="#FF0000" />
                                                    }
                                                </>
                                            ) : null
                                            }
                                        </Text>
                                        <TextInput style={styles.input} onChangeText={(text) => { setUsername(text) }} value={username} />
                                    </View>
                                    <View style={styles.email}>
                                        <Text style={styles.label}>Email
                                            {email ? (
                                                <>
                                                    {validEmail ? <Icon name="check" size={30} color="#32CD32" />
                                                        : <Icon name="times" size={30} color="#FF0000" />
                                                    }
                                                </>
                                            ) : null
                                            }
                                        </Text>
                                        <TextInput style={styles.input}
                                            onChangeText={(text) => { setEmail(text) }} value={email} />
                                    </View>
                                    <View style={styles.fullname}>
                                        <Text style={styles.label}>Fullname
                                            {fullname ? (
                                                <>
                                                    {validFullname ? <Icon name="check" size={30} color="#32CD32" />
                                                        : <Icon name="times" size={30} color="#FF0000" />
                                                    }
                                                </>
                                            ) : null
                                            }
                                        </Text>
                                        <TextInput style={styles.input}
                                            onChangeText={(text) => { setFullname(text) }} value={fullname} />
                                    </View>
                                    <View style={styles.password}>
                                        <Text style={styles.label}>Password
                                            {password ? (
                                                <>
                                                    {validPassword ? <Icon name="check" size={30} color="#32CD32" />
                                                        : <Icon name="times" size={30} color="#FF0000" />
                                                    }
                                                </>
                                            ) : null
                                            }
                                        </Text>
                                        <TextInput secureTextEntry={true} style={styles.input}
                                            onChangeText={(text) => { setPassword(text) }} value={password} />
                                    </View>
                                    <View style={styles.confirmPassword}>
                                        <Text style={styles.label}>Confirm Password
                                            {matchPassword ? (
                                                <>
                                                    {validMatch ? <Icon name="check" size={30} color="#32CD32" />
                                                        : <Icon name="times" size={30} color="#FF0000" />
                                                    }
                                                </>
                                            ) : null
                                            }
                                        </Text>
                                        <TextInput secureTextEntry={true} style={styles.input}
                                            onChangeText={(text) => { setMatchPassword(text) }} value={matchPassword} />
                                    </View>
                                    <View style={styles.signin}>
                                        <TouchableOpacity style={styles.button} onPress={() => { handleSubmit() }}
                                            disabled={(!username || !password || !matchPassword || !validPassword || !validUsername || !validMatch) ? true : false}>
                                            <Text style={{ fontSize: 20 }}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </Formik>
                        <View style={styles.signup}>
                            <Text style={styles.label}>Already registered?</Text>
                            <Text style={[styles.label, { marginTop: 30, textDecorationLine: "underline" }]}
                                onPress={() => navigation.navigate('Login')}>Sign In</Text>
                        </View>
                    </ScrollView>
                </View >
            )
            }
        </>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#222222",
        fontFamily: "Quicksand-Regular",
    },
    successSection: {
        width: 350,
        height: 500,
        borderRadius: 20,
        backgroundColor: "#141414",
        justifyContent: "center",
        alignItems: "center",
        top: 200
    },
    registerSection: {
        width: 350,
        height: 750,
        borderRadius: 20,
        backgroundColor: "#141414",
        justifyContent: "center",
        alignItems: "center",
        top: 80
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
        height: 40,
        width: 300,
        margin: 12,
        fontSize: 20,
        fontFamily: "Quicksand-Regular",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        paddingLeft: 10,
    },
    email: {
        position: "absolute",
        top: 200,
    },
    fullname: {
        position: "absolute",
        top: 290,
    },
    password: {
        position: "absolute",
        top: 380,
    },
    confirmPassword: {
        position: "absolute",
        top: 470,
    },
    signin: {
        position: "absolute",
        top: 580,
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
        top: 650
    }
});