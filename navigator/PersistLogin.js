import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import SplashScreen from '../screens/Splash.screen';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import useRefreshToken from '../hooks/useRefreshToken';
import useNotification from '../hooks/useNotification';

export default function PersistLogin({ navigation }) {

    const { auth } = useAuth();
    const refresh = useRefreshToken();
    // axios with jwt verification
    const axiosPrivate = useAxiosPrivate();

    // get app expo push notification token
    const { expoPushToken } = useNotification();

    useEffect(() => {
        const tryAutoLogin = async () => {
            console.log("Trying auto-login");
            if (auth?.accessToken) { // if authenticated
                // set expoPushToken to user 
                // => when there is new entry, send notification to all manager
                console.log("Expo PT: " + expoPushToken);

                axiosPrivate.post(`/home/updateExpoPushToken/${auth?.username}`, { expoPushToken: expoPushToken })
                    .then(() => { console.log("Updated expo push token") }).catch(e => console.log(e));

                navigation.navigate('Main');
            } else {
                const accessToken = await refresh();
                console.log(accessToken);
                if (accessToken === "FAILED")
                    navigation.navigate('Login');
            }
        }

        tryAutoLogin();
    }, [auth]);

    return (
        <SplashScreen></SplashScreen>
    );
}