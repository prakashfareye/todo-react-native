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

const AddTodo = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [dateValidError, setDateValidError] = useState('');
  const [status, setStatus] = React.useState('checked');

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
        status: status == 'checked' ? 'Closed' : 'Open',
      });
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('');
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
