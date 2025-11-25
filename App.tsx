import "react-native-get-random-values";
import React from "react";

import { Provider } from "react-redux";
import store from "./src/store";
import { ThemeProvider } from "./src/theme/ThemeContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}
