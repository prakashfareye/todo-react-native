/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
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
  TouchableWithoutFeedback,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ListItem from '../ListItem';

import Realm from 'realm';
import ListItemRealm from './ListItemRealm';
import AsyncStorage from '@react-native-async-storage/async-storage';

// schema for database objects
const TaskSchema = {
  name: 'Task1',
  properties: {
    _id: 'int',
    name: 'string',
    description: 'string',
    dueDate: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
};

const TodosFromRealm = ({navigation}) => {
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const isDarkMode = useColorScheme() === 'dark';
  // const theme = useTheme();

  // input fields data
  const [user, setUser] = useState({});

  // realm related variables
  const [realm, setRealm] = React.useState(null);

  const [tasks, setTasks] = React.useState([]);
  const [doneTask, setDoneTask] = React.useState([]);
  const [doingTask, setDoingTask] = React.useState([]);

  const [selected, setSelected] = useState('Todo');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('use Effect called in Todos from backstack');
      (async () => {
        // initialize realm...
        const realm = await Realm.open({
          path: 'myrealm1',
          schema: [TaskSchema],
        }).then(realm => {
          // load data in the database...
          const tasks = realm.objects('Task1');

          // set values to Todo
          let todoList = tasks.filter(function (item) {
            return item.status === 'Todo';
          });

          setTasks(todoList);

          // set values to Done
          let doneList = tasks.filter(function (item) {
            return item.status === 'Done';
          });
          //console.log('done', doneList);
          setDoneTask(doneList);

          // set values to Done
          let doingList = tasks.filter(function (item) {
            return item.status === 'Doing';
          });
          //console.log('doing', doingList);
          setDoingTask(doingList);

          // get realm instance to use later in app
          setRealm(realm);

          // set up listener to update task list when the
          // data is updated
          // try {
          //   tasks.addListener(() => {
          //     let todoList = tasks.filter(function (item) {
          //       return item.status === 'Todo';
          //     });
          //     console.log('todolist', todoList);

          //     setTasks(todoList);

          //     let doneList = tasks.filter(function (item) {
          //       return item.status === 'Done';
          //     });
          //     //console.log('done', doneList);
          //     setDoneTask(doneList);

          //     let doingList = tasks.filter(function (item) {
          //       return item.status === 'Doing';
          //     });
          //     //console.log('doing', doingList);
          //     setDoingTask(doingList);
          //   });
          // } catch (error) {
          //   console.error(`Error updating tasks: ${error}`);
          // }
        });
      })();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    //console.log('use Effect called in Todos');
    // getTodosFromAsyncStorage();
    //console.log('todos loaded from useEffect', todos);
    getUserDetailFromAsyncSrorage();
  }, []);

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

  /**
   * deleting of tasks must happen in a transaction, we just
   * need the id of the task to delete
   */
  // const deleteTask = task => {
  //   realm.write(() => {
  //     try {
  //       let myTask = realm.objectForPrimaryKey('Task1', task._id);
  //       realm.delete(myTask);
  //       myTask = null;
  //       realm.refresh();
  //     } catch (error) {
  //       console.log('delete', error);
  //     }
  //   });
  // };

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
              <Text
                style={styles.headerText}>{`Hello, ${user.firstName}`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.tabContainer}>
            <View>
              <TouchableOpacity>
                <Text
                  style={
                    selected == 'Todo'
                      ? styles.tabItemTextSelected
                      : styles.tabItemText
                  }
                  onPress={() => {
                    //
                    //showTodoScreen();
                    setSelected('Todo');
                  }}>
                  Todo
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity>
                <Text
                  style={
                    selected == 'Done'
                      ? styles.tabItemTextSelected
                      : styles.tabItemText
                  }
                  onPress={() => {
                    //
                    //showDoneScreen();
                    setSelected('Done');
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity>
                <Text
                  style={
                    selected == 'Doing'
                      ? styles.tabItemTextSelected
                      : styles.tabItemText
                  }
                  onPress={() => {
                    //
                    //showDoingScreen();
                    setSelected('Doing');
                  }}>
                  Doing
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.flatListContainer}>
            {tasks.length === 0 && (
              <View style={styles.noTodos}>
                <Text style={styles.noTodosText}>No Todos.</Text>
              </View>
            )}
            <FlatList
              data={
                selected === 'Todo'
                  ? tasks
                  : selected === 'Done'
                  ? doneTask
                  : doingTask
              }
              renderItem={({item}) => {
                //console.log('inside flat List', item);
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      //
                      navigation.navigate('Add Todo realm', {
                        edit: true,
                        taskToUpdate: item,
                      });
                    }}>
                    {/* <ListItemRealm {...item} /> */}
                    <View style={styles.listContainer}>
                      <View style={styles.listItem}>
                        <View style={styles.imageView}>
                          <Image
                            source={require('../../assets/suitcase.png')}
                            style={styles.icon}
                            onPress={() => {
                              //
                            }}
                          />
                        </View>
                        <View style={styles.textBox}>
                          <View style={styles.titleBox}>
                            <Text style={styles.todoTitle}>{item.name}</Text>
                            <Text style={styles.todoDueDate}>
                              {item.dueDate}
                            </Text>
                          </View>
                          <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionText}>
                              {item.description}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              navigation.navigate('Add Todo realm', {
                edit: false,
              });
            }}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F3FC',
    //flexDirection: 'column',
    height: '100%',
    width: '100%',
    paddingTop: 0,
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
    marginTop: 50,
    //paddingEnd: 5,
  },
  tabContainer: {
    width: '80%',
    position: 'absolute',
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
    color: '#CCC',
  },
  tabItemTextSelected: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D0DAD',
  },
  tabItemTextDone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CCC',
  },
  tabItemTextDoing: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CCC',
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
    width: 60,
    backgroundColor: '#3D0DAD',
    height: 60,
    position: 'absolute',
    bottom: 40,
    right: 35,
    color: '#FFFFFF',
    borderRadius: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 25,
    alignItems: 'center',
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
  listContainer: {
    width: '94%',
    height: 80,
    shadowColor: '#000',
    shadowRadius: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 12,
  },
  listItem: {
    //backgroundColor: '#F9F3FC',

    flex: 1,
    borderRadius: 10,
    direction: 'flex',
    flexDirection: 'row',
  },
  imageView: {
    flex: 1.2,
    //backgroundColor: '#CCC',
    justifyContent: 'center',
    alignContent: 'center',
    paddingStart: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginLeft: 8,
  },
  textBox: {
    flex: 5,
    //backgroundColor: '#F9F3FC',
    flexDirection: 'column',
    paddingLeft: 10,
  },
  titleBox: {
    flex: 2,
    //backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingEnd: 10,
    marginEnd: 5,
  },
  descriptionBox: {
    flex: 5,
    paddingTop: 5,
  },
  todoTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  todoDueDate: {
    fontSize: 12,
    color: '#000000',
    marginEnd: 10,
  },
  descriptionText: {
    fontSize: 11,
    color: '#677182',
    marginEnd: 10,
  },
});

export default TodosFromRealm;
