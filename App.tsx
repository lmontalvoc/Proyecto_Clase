import 'react-native-get-random-values';
import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </ThemeProvider>
  );
}