import { View, Image, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/splash.png')} style={styles.logo} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
});