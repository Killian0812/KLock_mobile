import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider } from "./context/AuthProvider";
import { PushNotificationProvider } from './context/PushNotificationProvider';
import { FirebaseProvider } from "./context/FirebaseProvider";
import { SocketProvider } from "./context/SocketProvider";

import MainContainer from './navigator/MainContainer';
import PersistLogin from './navigator/PersistLogin';

import LoginScreen from "./screens/Login.screen";
import RegisterScreen from "./screens/Register.screen";
import SplashScreen from "./screens/Splash.screen";
import Authenticate from './navigator/Authenticate';
import { NotificationProvider } from "./context/NotificationProvider";


const Stack = createStackNavigator();

function App() {

  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("./assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Bold": require("./assets/fonts/Quicksand-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <SplashScreen></SplashScreen>
    )
  } else {
    return (
      <FirebaseProvider>
        <PushNotificationProvider>
          <AuthProvider>
            <SocketProvider>
              <NotificationProvider>

                <NavigationContainer>

                  <Stack.Navigator initialRouteName={'PersistLogin'} screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="PersistLogin" component={PersistLogin} />
                    <Stack.Screen name="Authenticate" component={Authenticate} />

                    <Stack.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} />

                    {/* disable gesture to prevent slide back to login */}
                    <Stack.Screen name="Main" component={MainContainer} options={{ gestureEnabled: false }} />
                  </Stack.Navigator>

                </NavigationContainer>
      
              </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
        </PushNotificationProvider>
      </FirebaseProvider>
    );
  }
}

export default App;