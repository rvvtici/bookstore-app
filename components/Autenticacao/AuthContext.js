// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../config/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedBooks, setSavedBooks] = useState([]);

  useEffect(() => {
    loadUserData();
    setupAuthListener();
  }, []);

  const setupAuthListener = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0]
        };
        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('@user');
      }
      setLoading(false);
    });
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      const savedBooksData = await AsyncStorage.getItem('@savedBooks');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      if (savedBooksData) {
        setSavedBooks(JSON.parse(savedBooksData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const login = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Formato do email inválido';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, name = '') => {
    try {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email.toLowerCase(), password);
      
      if (name && user) {
        await user.updateProfile({
          displayName: name
        });
      }
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Esse email já está em uso';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha fraca, digite outra senha';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Formato do email inválido';
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null);
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const saveBook = async (book) => {
    try {
      const bookWithId = {
        ...book,
        id: book.id || Date.now().toString(),
        savedAt: new Date().toISOString()
      };
      
      const updatedBooks = [...savedBooks, bookWithId];
      setSavedBooks(updatedBooks);
      await AsyncStorage.setItem('@savedBooks', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
    }
  };

  const removeSavedBook = async (bookId) => {
    try {
      const updatedBooks = savedBooks.filter(book => book.id !== bookId);
      setSavedBooks(updatedBooks);
      await AsyncStorage.setItem('@savedBooks', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Erro ao remover livro:', error);
    }
  };

  const isBookSaved = (bookId) => {
    return savedBooks.some(book => book.id === bookId);
  };

  const value = {
    user,
    loading,
    savedBooks,
    login,
    register,
    logout,
    saveBook,
    removeSavedBook,
    isBookSaved,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};