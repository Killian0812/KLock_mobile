import axiosPrivate from './useAxios';
import useAuth from './useAuth';
import * as SecureStore from 'expo-secure-store';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        console.log("Getting new access token");
        const jwt = await SecureStore.getItemAsync("REFRESH_TOKEN");
        if (!jwt)
            return null;

        const headers = {
            'Content-Type': 'application/json',
        }
        const response = await axiosPrivate.get("/api/refresh", {
            headers: headers,
            timeout: 5000
        });
        if (response.status == 200) {
            setAuth({
                username: response.data.username,
                fullname: response.data.fullname,
                email: response.data.email,
                roles: response.data.roles,
                accessToken: response.data.accessToken // replace old access token
            });
            return response.data.accessToken;
        }
        else
            return null;
    }
    return refresh;
};

export default useRefreshToken;