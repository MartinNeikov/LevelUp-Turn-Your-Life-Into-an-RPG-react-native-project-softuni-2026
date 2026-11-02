import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WelcomeScreen from "./components/welcome-screen/WelcomeScreen";


export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <WelcomeScreen />
    </SafeAreaProvider>
  );
}