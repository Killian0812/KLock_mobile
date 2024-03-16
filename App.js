import { useFonts } from "expo-font";
import { StyleSheet, View, Image, Text } from "react-native";
import MainContainer from './navigator/MainContainer';
import OuterContainer from './navigator/OuterContainer';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from "./navigator/screens/Login.screen";
import RegisterScreen from "./navigator/screens/Register.screen";

const Stack = createStackNavigator();

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/splash.png')} style={styles.logo} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

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
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* disable gesture to prevent slide back to login */}
          <Stack.Screen name="Main" component={MainContainer} options={{ gestureEnabled: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;