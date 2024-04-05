import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider } from "./context/AuthProvider";
import { NotificationProvider } from './context/NotificationProvider';
import { FirebaseProvider } from "./context/FirebaseProvider";

import MainContainer from './navigator/MainContainer';
import PersistLogin from './navigator/PersistLogin';

import LoginScreen from "./screens/Login.screen";
import RegisterScreen from "./screens/Register.screen";
import SplashScreen from "./screens/Splash.screen";
import Authenticate from './navigator/Authenticate';


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

        <NotificationProvider>

          <AuthProvider>

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

          </AuthProvider>

        </NotificationProvider>

      </FirebaseProvider>
    );
  }
}

export default App;