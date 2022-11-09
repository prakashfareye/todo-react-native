import React, {useEffect, useState} from 'react';
import {Node} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import Realm from 'realm';
import {TaskSchema} from '../database/schema/TaskSchema';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  AlertIOS,
  Image,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// schema for database objects

const AddTodo = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [dueDate, setDueDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [dateValidError, setDateValidError] = useState('');

  useEffect(() => {
    //console.log('use Effect called in Todos');
    // getTodosFromAsyncStorage();
    getFromAsync();
  }, []);

  useEffect(() => {
    //console.log('use Effect called in Todos');
    // getTodosFromAsyncStorage();
    validateDate();
  });

  const onDateChange = (evant, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    // validate date
    validateDate();
    ///////////////
    let tempDate = new Date(selectedDate);
    let fDate =
      tempDate.getFullYear() +
      '-' +
      (tempDate.getMonth() + 1) +
      '-' +
      tempDate.getDate();
    setDueDate(fDate);
    setShow(!show);
    console.log(fDate);
  };

  const validateDate = () => {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    console.log(now);
    console.log(date);
    if (date < now) {
      setDateValidError('Selected date is in the past');
      //console.log('Selected date is in the past');
    } else {
      setDateValidError('');
    }
  };

  const changeShowMode = () => {
    setShow(!show);
  };

  const saveTodo = () => {
    const todo = {
      title: title,
      description: description,
      dueDate: dueDate,
      status: false,
    };
    console.log('Todos before addition', todos);
    setTodos([...todos, todo]);
    console.log('Todos after addition', todos);

    console.log('Current Todo', todo);

    AsyncStorage.setItem('todos', JSON.stringify(todos))
      .then(json => {
        console.log('Saving Todo Success!!');
        //navigation.dispatch(StackActions.pop(1));
      })
      .catch(error => console.log('Empty Todos creation in AS error!'));
    // // show Alert
    // alert('Todo Saved');
    // pop the backstack
    //navigation.dispatch(StackActions.pop(1));
  };

  const getFromAsync = async () => {
    try {
      const value = await AsyncStorage.getItem('todos');
      if (value !== null) {
        // We have data!!
        setTodos(JSON.parse(value));
        console.log('from As TodoList', JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  const getFromAsyncWithoutUpdatingtodos = async () => {
    try {
      const value = await AsyncStorage.getItem('todos');
      if (value !== null) {
        // We have data!!
        //setTodos(JSON.parse(value));
        console.log(
          'from As TodoList after clicking check todos',
          JSON.parse(value),
        );
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TextInput
        label="Title"
        style={styles.textTitleBOx}
        placeholder="Enter Todo Title"
        placeholderTextColor="#CCCCCC"
        value={title}
        onChangeText={text => {
          //
          setTitle(text);
        }}
      />
      <TextInput
        label="Description"
        style={styles.textTitleBOx}
        placeholder="Enter Todo Description"
        placeholderTextColor="#CCCCCC"
        multiline={true}
        value={description}
        onChangeText={text => {
          //
          setDescription(text);
        }}
      />
      <View style={styles.dueDateView}>
        <TextInput
          label="dueDate"
          placeholder="Enter Due Date"
          placeholderTextColor="#CCCCCC"
          style={styles.textInputPassword}
          value={dueDate}
          onChangeText={text => {
            // set date
          }}
        />
        <TouchableOpacity style={styles.wrapperIcon} onPress={changeShowMode}>
          <Image
            source={require('../assets/calender.png')}
            style={styles.icon}
            onPress={() => {
              //
            }}
          />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            //value={date}
            testID="datePicker"
            mode={mode}
            is24Hour={true}
            value={date}
            minDate={new Date()}
            display="default"
            //onChange={onDateSelected}
            style={styles.datePicker}
            onChange={onDateChange}
          />
        )}
      </View>
      {dateValidError ? (
        <Text style={styles.errorText}>{dateValidError}</Text>
      ) : null}
      <TouchableOpacity style={styles.loginButton} onPress={saveTodo}>
        <Text style={styles.buttonText}> Save Todo To AS</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTodo;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#F9F3FC',
  },
  textTitleBOx: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 0.6,
    underlineColor: '#000000',
    activeUnderlineColor: '#000000',
    paddingEnd: 25,
  },
  wrapperIcon: {
    position: 'absolute',
    right: 0,
    paddingRight: 10,
    marginEnd: 20,
  },

  icon: {
    width: 20,
    height: 20,
  },
  textInputPassword: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    underlineColor: '#000000',
    activeUnderlineColor: '#000000',
    paddingEnd: 25,
  },
  dueDateView: {
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    color: '#FFFFFF',
    borderRadius: 10,
    backgroundColor: '#8E0082',
    marginLeft: 40,
    marginEnd: 40,
    marginTop: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  datePicker: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 260,
    display: 'flex',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
  },
});
