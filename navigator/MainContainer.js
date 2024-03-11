import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// screens
import HomeScreen from './screens/Home.screen';
import ProfileScreen from './screens/Profile.screen';
import RoomScreen from './screens/Room.screen';

// screen names
const homeName = 'Home';
const profileName = 'Profile';
const roomName = 'Room';

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
    return (
        <NavigationContainer>
            <Tab.Navigator styles={styles.layout} initialRouteName={homeName} screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#ffffff',
                tabBarActiveBackgroundColor: '#222222',
                tabBarLabelStyle: { marginBottom: 10, fontSize: 12 },
                tabBarStyle: { backgroundColor: '#141414', marginBottom: -20, height: 90 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;
                    if (rn === homeName)
                        iconName = focused ? 'home' : 'home-outline'
                    else if (rn === roomName)
                        iconName = focused ? 'list-circle' : 'list-circle-outline'
                    else if (rn == profileName)
                        iconName = focused ? 'person' : 'person-outline'
                    return <Ionicons name={iconName} size={size} color={color}></Ionicons>
                }
            })}>

                <Tab.Screen name={homeName} component={HomeScreen}></Tab.Screen>
                <Tab.Screen name={roomName} component={RoomScreen}></Tab.Screen>
                <Tab.Screen name={profileName} component={ProfileScreen}></Tab.Screen>

            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default MainContainer;