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
    //console.log('use Effect called in Todos');
    // getTodosFromAsyncStorage();
    //console.log('todos loaded from useEffect', todos);
    getUserDetailFromAsyncSrorage();
  }, []);

  useEffect(() => {
    //console.log('use Effect Todos - getting todos from Sever');
    // getTodosFromAsyncStorage();
    //console.log('todos loaded from useEffect', todos);
    //getTodoFromServer();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('use Effect called in Todos from backstack');
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
        //console.log('from AS Todos fetching Saved todos', JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      //console.log('from AS Todos fetching Saved user ERROR!');
    }
  };

  const getUserDetailFromAsyncSrorage = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        // We have data!!
        setUser(JSON.parse(value));
        //console.log('from AS Todos fetching Saved User', JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      //console.log('from AS Todos fetching Saved user ERROR!');
    }
  };

  const getTodoFromServer = () => {
    fetch(`http://10.0.2.2:8080/todo/user/${user.userId}`)
      // Converting received data to JSON
      .then(response => response.json())
      .then(json => {
        console.log(json);
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{`Todo List`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.tabContainer}>
            <View>
              <Text style={styles.tabItemText}>Todo</Text>
            </View>
            <View>
              <Text style={styles.tabItemText}>Done</Text>
            </View>
            <View>
              <Text style={styles.tabItemText}>Doing</Text>
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
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              console.log('on Press of Add Todo');
              navigation.navigate('AddTodo');
            }}>
            <Text style={styles.buttonText}>Add Todo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Todos;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F3FC',
    //flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#3D0DAD',
  },
  bottomContainer: {
    flex: 4,
    //backgroundColor: '',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
    shadowOpacity: 2.0,
  },
  headerContainer: {
    width: '100%',
  },
  flatListContainer: {
    //height: '92%',
    backgroundColor: '#F9F3FC',
    //paddingEnd: 5,
  },
  tabContainer: {
    width: '80%',
    position: 'relative',
    height: 80,
    top: -45,
    elevation: 5,
    //marginEnd: 40,
    marginLeft: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    //marginRight: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 25,
  },
  tabItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  header: {
    height: 60,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingStart: 20,
    paddingEnd: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    paddingTop: 0,
    fontWeight: 'bold',
    color: '#FFF',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 100,
    height: 40,
    position: 'absolute',
    top: 540,
    left: 270,
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
