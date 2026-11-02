import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RegisterScreen from "./components/register-screen/RegisterScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RegisterScreen/>
    </SafeAreaProvider>
  );
}