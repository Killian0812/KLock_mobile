import axios from 'axios';
import useAuth from './useAuth';
import * as SecureStore from 'expo-secure-store';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        console.log("Getting new access token");
        const jwt = await SecureStore.getItemAsync("REFRESH_TOKEN");
        if (!jwt) {
            return "FAILED";
        }
        const cookies = `jwt=${jwt};`;
        const axiosInstance = axios.create({
            baseURL: 'http://192.168.1.10:8080',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        });
        axiosInstance.get("/refresh").then((res) => {
            setAuth({ username: res.data.username, accessToken: res.data.accessToken });
            // console.log(res.data.accessToken);
            return res.data.accessToken;
        }).catch((e) => {
            console.log(e);
            return "FAILED";
        });
    }
    return refresh;
};

export default useRefreshToken;