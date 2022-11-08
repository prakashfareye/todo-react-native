/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {Node} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Login from './components/Login';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';
import TodosFromRealm from './components/todosInRealm/TodosFromRealm';
import AddTodorealm from './components/todosInRealm/AddTodorealm';

import ChoseDB from './ChoseDB';

const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  return (
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //     backgroundColor={backgroundStyle.backgroundColor}
    //   />
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Todos"
          component={Todos}
          options={{header: () => null}}
        />
        <Stack.Screen name="AddTodo" component={AddTodo} />
        <Stack.Screen name="Choose db" component={ChoseDB} />
        <Stack.Screen name="Realm Db" component={TodosFromRealm} />
        <Stack.Screen name="Add Todo realm" component={AddTodorealm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
