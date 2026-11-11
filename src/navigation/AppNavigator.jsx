import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { supabase } from "../lib/supabase";
import WelcomeScreen from "../screens/welcome-screen/WelcomeScreen";
import LoginScreen from "../screens/login-screen/LoginScreen";
import RegisterScreen from "../screens/register-screen/RegisterScreen";
import ChoosePathScreen from "../screens/choose-path-screen/ChoosePathScreen";
import QuestDetailsScreen from "../screens/quest-details-screen/QuestDetailsScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [startupRoute, setStartupRoute] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      let route = { name: "Welcome" };

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          const selectedAttributes =
            data.session.user.user_metadata?.focus_attributes;

          const hasChosenPath =
            Array.isArray(selectedAttributes) &&
            (selectedAttributes.length === 2 || selectedAttributes.length === 3);

          route = hasChosenPath
            ? { name: "Home", params: { selectedAttributes } }
            : { name: "ChoosePath" };
        }
      } catch (error) {
        console.warn("Could not restore the session:", error.message);
      }

      if (isActive) {
        setStartupRoute(route);
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  if (!startupRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={startupRoute.name}
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ChoosePath" component={ChoosePathScreen} />
        <Stack.Screen
          name="Home"
          component={MainTabNavigator}
          initialParams={startupRoute.params}
        />
        <Stack.Screen name="QuestDetails" component={QuestDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#12121F",
    alignItems: "center",
    justifyContent: "center",
  },
});