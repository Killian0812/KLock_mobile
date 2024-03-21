import axiosPrivate from './useAxios';
import useAuth from './useAuth';
import * as SecureStore from 'expo-secure-store';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        console.log("Getting new access token");
        const jwt = await SecureStore.getItemAsync("REFRESH_TOKEN");
        if (!jwt) {
            return "NO JWT";
        }
        const cookies = `jwt=${jwt};`;
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': cookies
        }
        const response = await axiosPrivate.get("/refresh", {
            headers: headers,
            timeout: 5000
        });
        setAuth({
            username: response.data.username,
            roles: response.data.roles,
            accessToken: response.data.accessToken // replace old access token
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;