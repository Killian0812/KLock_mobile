import { createContext, useState, useEffect, useRef } from "react";
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import SplashScreen from "../screens/Splash.screen";

Notifications.setNotificationHandler({ // notification recieved when opening app
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const PushNotificationContext = createContext({});

export const PushNotificationProvider = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [pushTokenAvailable, setPushTokenAvailable] = useState(false);

    useEffect(() => {
        async function registerForPushNotificationsAsync() {
            let token;

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return null;
                }
                token = await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig.extra.eas.projectId,
                });
            } else {
                alert('Must use physical device for Push Notifications');
                return null;
            }

            return token.data;
        }

        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token);
            setPushTokenAvailable(true);
        });

        // notifications recieved when opening app
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => { 
            setNotification(notification);
        });

        // notifications recieved when clicked on notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Clicked on notification", response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        !pushTokenAvailable ? <SplashScreen></SplashScreen> :
            <PushNotificationContext.Provider value={{ expoPushToken, notification }}>
                {children}
            </PushNotificationContext.Provider>
    );

}

export default PushNotificationContext;