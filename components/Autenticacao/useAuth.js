import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../config/config';
import { CommonActions } from '@react-navigation/native';

export const useAuth = (navigation) => {
  const [usuario, setUsuario] = useState('');
  const [token, setToken] = useState('');
  const [tokenValido, setTokenValido] = useState(false);

  useEffect(() => {
    // listener de autenticação
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const newToken = await user.getIdToken();
        await AsyncStorage.setItem('firebaseToken', newToken);
        await AsyncStorage.setItem('userEmail', user.email);
        setUsuario(user.email);
        setToken(newToken);
        setTokenValido(true);
      } else {
        setTokenValido(false);
        navigation.navigate('Login');
      }
    });
    verificarToken();

    return () => unsubscribe();
  }, []);

  const verificarToken = async () => {
    try {
      const user = auth.currentUser;
      const tokenStorage = await AsyncStorage.getItem('firebaseToken');
      const emailStorage = await AsyncStorage.getItem('userEmail');
      
      if (user && tokenStorage && emailStorage) {
        const novoToken = await user.getIdToken(true);
        await AsyncStorage.setItem('firebaseToken', novoToken);
        
        setTokenValido(true);
        setToken(novoToken);
        setUsuario(emailStorage);
      } else {
        setTokenValido(false);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('Erro ao verificar token:', error);
      setTokenValido(false);
    }
  };

  const fazerLogout = async () => {
    try {
      await AsyncStorage.removeItem('firebaseToken');
      await AsyncStorage.removeItem('userEmail');
      await auth.signOut();


      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );

      
    } catch (error) {
      console.log('Erro no logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout');
    }
  };

  return {
    usuario,
    token,
    tokenValido,
    fazerLogout
  };
};