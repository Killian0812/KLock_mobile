import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import useListenEvent from '../hooks/useListenEvent';

// screens
import HomeScreen from '../screens/Home.screen';
import ProfileScreen from '../screens/Profile.screen';
import RoomScreen from '../screens/Room.screen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    layout: {
        backgroundColor: 'red'
    },
    container: {
        flex: 1,
    },
    text: {
        fontSize: 30,
        fontWeight: '500',
    },
});

const MainContainer = () => {

    useListenEvent();

    const navigation = useNavigation();

    useEffect(() => {
        // Navigate to the home screen when notification is clicked
        const responseListener = Notifications.addNotificationResponseReceivedListener(() => {
            navigation.navigate('Home');
        });

        return () => {
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, [navigation]);

    return (
        <Tab.Navigator styles={styles.layout} initialRouteName={'Home'} screenOptions={({ route }) => ({
            headerStyle: {
                backgroundColor: '#424242',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#ffffff',
            tabBarLabelPosition: "beside-icon",
            tabBarInactiveTintColor: '#ffffff',
            tabBarActiveBackgroundColor: '#222222',
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: '#141414', height: 90 },
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                let rn = route.name;
                if (rn === 'Home')
                    iconName = focused ? 'home' : 'home-outline'
                else if (rn === 'Rooms')
                    iconName = focused ? 'list-circle' : 'list-circle-outline'
                else if (rn == 'Profile')
                    iconName = focused ? 'person' : 'person-outline'
                return <Ionicons name={iconName} size={size} color={color}></Ionicons>
            }
        })}>

            <Tab.Screen name='Home' component={HomeScreen}></Tab.Screen>
            <Tab.Screen name='Rooms' component={RoomScreen}></Tab.Screen>
            <Tab.Screen name='Profile' component={ProfileScreen} ></Tab.Screen>

        </Tab.Navigator>
    );
};

export default MainContainer;