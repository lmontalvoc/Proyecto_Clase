import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebaseConfig';

export default function LogoutButton() {
  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth.signOut();
          } catch (e) {
            console.log('Error signing out:', e);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 12 }} accessibilityLabel="Cerrar sesión">
      <Ionicons name="log-out-outline" size={22} color="#666" />
    </TouchableOpacity>
  );
}
