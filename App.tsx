<<<<<<< HEAD
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
=======
import "react-native-get-random-values";
import React from "react";

import { Provider } from "react-redux";
import store from "./src/store";
import { ThemeProvider } from "./src/theme/ThemeContext";
>>>>>>> development
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
<<<<<<< HEAD
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
=======
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
>>>>>>> development
  );
}
