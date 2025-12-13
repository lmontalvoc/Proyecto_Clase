import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import ResultScreen from "../screens/ResultScreen";
import AppearanceScreen from "../screens/AppearanceScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { ThemeContext } from "../theme/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

import { Ionicons } from '@expo/vector-icons';
import LogoutButton from '../components/LogoutButton';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerLeft: () => <LogoutButton />,
        headerRight: () => <ThemeToggle />,
        tabBarActiveTintColor: theme.button,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: { backgroundColor: theme.card },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Inicio') {
            return <Ionicons name="home" size={size} color={color} />;
          }
          if (route.name === 'Cámara') {
            return <Ionicons name="camera" size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Historial" component={require('../screens/HistoryScreen').default} />
      <Tab.Screen name="Cámara" component={CameraScreen} />
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <NavigationContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </NavigationContainer>
    );
  }

  const navTheme: any = {
    dark: mode === "dark",
    colors: {
      background: theme.background,
      card: theme.card,
      text: theme.text,
      primary: theme.button,
      border: theme.card,
    },
    fonts: {
      // react-navigation native-stack expects a `fonts` object; provide safe defaults
      regular: { fontFamily: '' },
      medium: { fontFamily: '' },
      light: { fontFamily: '' },
      thin: { fontFamily: '' },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerRight: () => <ThemeToggle /> }}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} />
            <Stack.Screen name="Apariencia" component={AppearanceScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
