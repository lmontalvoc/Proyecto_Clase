import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { DetectionsProvider } from './src/context/DetectionsContext';

export default function App() {
  return (
    <DetectionsProvider>
      <RootNavigator />
    </DetectionsProvider>
  );
}
