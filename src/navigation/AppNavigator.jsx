import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../screens/welcome-screen/WelcomeScreen";
import LoginScreen from "../screens/login-screen/LoginScreen";
import RegisterScreen from "../screens/register-screen/RegisterScreen";
import ChoosePathScreen from "../screens/choose-path-screen/ChoosePathScreen";
import HomeScreen from "../screens/home-screen/HomeScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,                 
          animation: "none",
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ChoosePath" component={ChoosePathScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
