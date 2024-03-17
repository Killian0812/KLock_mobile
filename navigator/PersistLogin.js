import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import SplashScreen from '../screens/Splash.screen';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function PersistLogin({ navigation }) {

    const { auth, setAuth } = useAuth();

    useEffect(() => {
        const tryAutoLogin = async () => {
            console.log("Trying auto-login");
            if (auth?.accessToken) {
                navigation.navigate('Main');
            } else {
                const jwt = await SecureStore.getItemAsync("REFRESH_TOKEN");
                if (!jwt) {
                    navigation.navigate('Login');
                    return;
                }
                const cookies = `jwt=${jwt};`;
                const instance = axios.create({
                    baseURL: 'http://192.168.1.10:8080',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': cookies
                    }
                });
                const res = await instance.get("/refresh");
                // console.log(res?.data);
                if (!res?.status == 401 || !res?.data) {
                    navigation.navigate('Login');
                } else {
                    setAuth({ username: res.data.username, accessToken: res.data.accessToken });
                }
            }
        }

        tryAutoLogin();
    }, [auth]);

    return (
        <SplashScreen></SplashScreen>
    );
}