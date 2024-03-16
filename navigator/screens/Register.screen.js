import { TouchableOpacity, TextInput, Text, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';

export default function RegisterScreen({ navigation }) {

    return (
        <View style={styles.layout}>
            <View style={styles.loginSection}>
                <View style={styles.header}>
                    <Text style={styles.title}>Register</Text>
                </View>
                <Formik
                    initialValues={{ email: '' }}
                    onSubmit={values => console.log(values)}>
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <>
                            <View style={styles.username}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput style={styles.input} />
                            </View>
                            <View style={styles.password}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput secureTextEntry={true} style={styles.input} />
                            </View>
                            <View style={styles.signin}>
                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={{ fontSize: 20 }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Formik>
                <View style={styles.signup}>
                    <Text style={styles.label}>Need an account?</Text>
                    <Text style={[styles.label, { marginTop: 30, textDecorationLine: "underline" }]}
                        onPress={() => navigation.navigate('Login')}>Sign In</Text>
                </View>
            </View>
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
        position: "absolute"
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