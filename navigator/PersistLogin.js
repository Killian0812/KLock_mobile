import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import SplashScreen from '../screens/Splash.screen';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from '../hooks/useRefreshToken';
import usePushNotification from '../hooks/usePushNotification';

export default function PersistLogin({ navigation }) {

    const { auth } = useAuth();
    const refresh = useRefreshToken();
    // axios with jwt verification
    const axiosPrivate = useAxiosPrivate();

    // get app expo push notification token
    const { expoPushToken } = usePushNotification();

    useEffect(() => {

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.log(error);
            } finally {
                navigation.navigate('Authenticate');
            }
        }

        console.log("Trying auto-login");
        if (!auth?.accessToken) {
            verifyRefreshToken();
        } else {
            // if authenticated save expoPushToken to user in db 
            // => when there is a new entry, send a notification to all managers
            console.log("Expo PT: " + expoPushToken);

            axiosPrivate.post(`/home/updateExpoPushToken/${auth?.username}`, { expoPushToken: expoPushToken })
                .then(() => { console.log("Updated expo push token") })
                .catch(e => console.log(e));
                
            navigation.navigate('Main');
        }

    }, [auth]);

    return (
        <SplashScreen></SplashScreen>
    );
}