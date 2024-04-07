import { Text, View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import axiosPrivate from '../hooks/useAxios';

export default function ProfileScreen({ navigation }) {

    const { auth } = useAuth();
    const { socket, setSocket } = useSocket();
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

    const getInfo = async () => {
        try {
            privateAxios.defaults.headers.common['Authorization'] = `Bearer ${auth?.accessToken}`;
            const res = await privateAxios.get(`/home/getUserInfo/${auth?.username}`);
            console.log(res?.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.layout}>
            <Text onPress={getInfo}>Get info</Text>
            <Text style={{ marginTop: 40 }} onPress={logout}>Logout</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    layout: {
        flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "grey"
    }
});