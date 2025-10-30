import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Card, Paragraph, Appbar } from 'react-native-paper';

import Inicio from './components/Home/Inicio';
import ContainerLivros from './components/Home/ContainerLivros';

import Busca from './components/Busca/Busca';
import BuscaResultado from './components/Busca/BuscaResultado';
import Livro from './components/Busca/Livro';
import LivroDetalhes from './components/Busca/LivroDetalhes';

import Salvos from './components/Salvos/Salvos';

import Perfil from './components/Perfil/Perfil';
import Login from './components/Perfil/Login';
import Cadastro from './components/Perfil/Cadastro';
import Carrinho from './components/Perfil/Carrinho';
import Compras from './components/Perfil/Compras';
import EditarPerfil from './components/Perfil/EditarPerfil';


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const BuscaStack = createStackNavigator();
const SalvosStack = createStackNavigator();
const PerfilStack = createStackNavigator();


function NavBusca() {
  return (
    <BuscaStack.Navigator>
      <BuscaStack.Screen name="Busca" component={Busca} />
      <BuscaStack.Screen
        name="Resultado"
        component={BuscaResultado}
        options={{
          title: 'Título',
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <Appbar.Action
                icon="filter"
                color="black"
                size={24}
                onPress={() => {
                  console.log('Filtro pressionado');
                }}
              />
            </View>
          ),
        }}
      />
      <BuscaStack.Screen name="LivroDetalhes" component={LivroDetalhes} />
      <BuscaStack.Screen name="Carrinho" component={Carrinho} />
    </BuscaStack.Navigator>
  );
}

function NavPerfil() {
  return (
    <PerfilStack.Navigator>
      <PerfilStack.Screen name="Perfil" component={Perfil} />
      <PerfilStack.Screen name="Login" component={Login} />
      <PerfilStack.Screen name="Cadastro" component={Cadastro} />
    
      <PerfilStack.Screen name="Carrinho" component={Carrinho} />
      <PerfilStack.Screen name="Compras" component={Compras} />
      <PerfilStack.Screen name="Editar Perfil" component={EditarPerfil} />
    
    </PerfilStack.Navigator>
  );
}

function NavHome() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Inicio" component={Inicio} />
      <HomeStack.Screen name="ContainerLivros" component={ContainerLivros} />
      <HomeStack.Screen name="LivroDetalhes" component={LivroDetalhes} />
    </HomeStack.Navigator>
  );
}

function NavSalvos() {
  return (
    <SalvosStack.Navigator>
      <SalvosStack.Screen name="Salvos" component={Salvos} />
      <SalvosStack.Screen name="LivroDetalhes" component={LivroDetalhes} />
    </SalvosStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>

      <Tab.Screen
        name="Inicio"
        component={NavHome}
        options={{
          tabBarIcon: ({color,size}) => (
            <MaterialCommunityIcons name="home"
            color={color} size={size}/>
          ),
          headerShown: false,
        }}
        />
      
      <Tab.Screen
        name="Busca"
        component={NavBusca}
        options={{
          tabBarIcon: ({color,size}) => (
            <MaterialCommunityIcons name="search-web"
            color={color} size={size}/>
          ),
          headerShown: false,
        }}
        />

      <Tab.Screen
        name="Salvos"
        component={NavSalvos}
        options={{
          tabBarIcon: ({color,size}) => (
            <MaterialCommunityIcons name="bookmark"
            color={color} size={size}/>
          ),
          headerShown: false,
        }}
        />

        <Tab.Screen
          name="Perfil"
          component={NavPerfil}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />

        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
