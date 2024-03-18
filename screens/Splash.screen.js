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
        backgroundColor: '#c4c4c4',
    },
    logo: {
        width: 500,
        height: 500,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});