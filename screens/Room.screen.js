import { Text, View } from 'react-native';
import useAuth from '../hooks/useAuth';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import privateAxios from '../hooks/useAxios';

export default function RoomScreen({ navigation }) {

    const { auth } = useAuth();

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync("REFRESH_TOKEN");
            await SecureStore.deleteItemAsync("USERNAME");
            await SecureStore.deleteItemAsync("ACCESS_TOKEN");
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={getInfo}>Get info</Text>
            <Text style={{ marginTop: 40 }} onPress={logout}>Logout</Text>
        </View>
    );
}
