import React, {useEffect, useState} from 'react';
import {Node} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';

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
  TouchableOpacity,
  ToastAndroid,
  Platform,
  AlertIOS,
  Image,
  FlatList,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ListItem from './ListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Todos = ({navigation}) => {
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log('use Effect called in Todos');
    // getTodosFromAsyncStorage();
    //console.log('todos loaded from useEffect', todos);
    getUserDetailFromAsyncSrorage();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('use Effect called in Todos from backstack');
      getTodosFromAsync();
    });
    return unsubscribe;
  }, [navigation]);

  const notifyMessage = message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(message);
    }
  };

  const getTodosFromAsync = async () => {
    try {
      const value = await AsyncStorage.getItem('todos');
      if (value !== null) {
        // We have data!!
        setTodos(JSON.parse(value));
        console.log('from AS Todos fetching Saved todos', JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      console.log('from AS Todos fetching Saved user ERROR!');
    }
  };

  const getUserDetailFromAsyncSrorage = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        // We have data!!
        setUser(JSON.parse(value));
        console.log('from AS Todos fetching Saved User', JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      console.log('from AS Todos fetching Saved user ERROR!');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{`Hello, ${user.firstName}`}</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                navigation.navigate('AddTodo');
              }}>
              <Text style={styles.buttonText}>Add Todo</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.flatListContainer}>
          {todos.length === 0 && (
            <View style={styles.noTodos}>
              <Text style={styles.noTodosText}>No Todos.</Text>
            </View>
          )}
          <FlatList
            data={todos}
            renderItem={({item}) => {
              //console.log('inside flat List', item);
              return <ListItem {...item} />;
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Todos;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F3FC',
    flexDirection: 'column',
  },
  headerContainer: {
    height: '8%',
    width: '100%',
    marginEnd: 20,
  },
  flatListContainer: {
    height: '92%',
    backgroundColor: '#F9F3FC',
    //paddingEnd: 5,
  },
  header: {
    height: 60,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingStart: 20,
    paddingEnd: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 100,
    height: 40,
    color: '#FFFFFF',
    borderRadius: 10,
    backgroundColor: '#8E0082',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  noTodos: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  noTodosText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#000',
    marginTop: 20,
  },
});
