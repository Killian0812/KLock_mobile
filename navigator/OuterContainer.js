import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './screens/Login.screen';
import RegisterScreen from './screens/Register.screen';

const Stack = createStackNavigator();

const OuterContainer = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'Login'} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default OuterContainer;
