import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, View, Image, Platform } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ResultScreen from "../screens/ResultScreen";
import SettingsScreen from "../screens/SettingsScreeen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { theme } = useContext(ThemeContext);

  const icons: Record<string, any> = {
    Inicio: require("../assets/Inicio.png"),
    "Cámara": require("../assets/Camara.png"),
    Historial: require("../assets/Historial.png"),
  };

  const inactiveTint = theme.text === "#FFFFFF" ? "#BBBBBB" : "#666666";

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => {
          const src = icons[route.name];
          return <Image source={src} style={{ width: size, height: size, opacity: focused ? 1 : 0.6 }} resizeMode="contain" />;
        },
        tabBarActiveTintColor: theme.button,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: { backgroundColor: theme.background },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Cámara" component={CameraScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { theme, mode } = useContext(ThemeContext);

  const navTheme = {
    dark: mode === "dark",
    colors: {
      primary: theme.button,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.card,
      notification: theme.button,
    },
    fonts: {
      regular: { fontFamily: Platform.OS === "android" ? "Roboto" : "System" },
      medium: { fontFamily: Platform.OS === "android" ? "Roboto" : "System" },
    },
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <NavigationContainer theme={navTheme}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} />
            <Stack.Screen name="Apariencia" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
