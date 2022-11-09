import React, {useEffect, useState} from 'react';
import {Node} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import Realm from 'realm';

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

const AddTodo = ({route, navigation}) => {
  const {edit} = route.params;
  const {taskToUpdate} = route.params;

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const [title, setTitle] = useState(edit ? taskToUpdate.name : '');
  const [description, setDescription] = useState(
    edit ? taskToUpdate.description : '',
  );
  const [dueDate, setDueDate] = useState(edit ? taskToUpdate.dueDate : '');
  const [status, setStatus] = React.useState(
    edit ? taskToUpdate.status : 'Todo',
  );

  const [dateValidError, setDateValidError] = useState('');

  // realm related variables
  const [realm, setRealm] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);

  useEffect(() => {
    (async () => {
      // initialize realm...
      const realm = await Realm.open({
        path: 'myrealm1',
        schema: [TaskSchema],
      }).then(realm => {
        // load data in the database...
        const tasks = realm.objects('Task1');

        // set variable for tasks read from database
        setTasks([...tasks]);

        // get realm instance to use later in app
        setRealm(realm);

        // set up listener to update task list when the
        // data is updated
        try {
          tasks.addListener(() => {
            setTasks([...tasks]);
          });
        } catch (error) {
          console.error(`Error updating tasks: ${error}`);
        }
      });
    })();
  }, []);

  /**
   * deleting of tasks must happen in a transaction, we just
   * need the id of the task to delete
   */
  const deleteTask = task => {
    realm.write(() => {
      try {
        let myTask = realm.objectForPrimaryKey('Task1', task._id);
        realm.delete(myTask);
        myTask = null;
        realm.refresh();
      } catch (error) {
        console.log('delete', error);
      }
    });
  };

  /**
   * get the values from the local state and add a new
   * task to the database
   */
  let task;
  const adddTask = () => {
    realm.write(() => {
      task = realm.create('Task1', {
        _id: Date.now(),
        name: title,
        description: description,
        dueDate: dueDate,
        status: status,
      });
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('');
    navigation.dispatch(StackActions.pop(1));
  };

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
  };

  const validateDate = () => {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
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
      <TextInput
        label="Status"
        style={styles.textTitleBOx}
        placeholder="Enter Todo Status"
        placeholderTextColor="#CCCCCC"
        multiline={false}
        value={status}
        onChangeText={text => {
          //
          setStatus(text);
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
            //source={require('../assets/calender.png')}
            source={require('../../assets/calender.png')}
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
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          //adddTask();
          adddTask();
        }}>
        <Text style={styles.buttonText}> Save Todo To Realm</Text>
      </TouchableOpacity>
      {edit && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            // delete task
            deleteTask(taskToUpdate);
            navigation.dispatch(StackActions.pop(1));
            // setTimeout(() => {

            // }, 1000);
          }}>
          <Text style={styles.buttonText}> Delete Todo From Realm</Text>
        </TouchableOpacity>
      )}
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
    borderBottomWidth: 1,
    underlineColor: '#000000',
    activeUnderlineColor: '#000000',
    paddingEnd: 25,
    marginBottom: 5,
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
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    color: '#FFFFFF',
    borderRadius: 10,
    backgroundColor: '#960000',
    marginLeft: 40,
    marginEnd: 40,
    marginTop: 20,
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
