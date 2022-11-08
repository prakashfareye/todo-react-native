import React, {useEffect, useState} from 'react';
import {Node} from 'react';
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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [signInMode, setSignInMode] = useState(true);
  const [users, setUsers] = useState([]);
  const [seePassword, setSeePassword] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('p4@gmail.com');
  const [password, setPassword] = useState('abcdefghi');
  const [role, setRole] = useState('');
  const [githubId, setGithubId] = useState('');

  useEffect(() => {
    //console.log('use Effect called in Todos');
    // getTodosFromAsyncStorage();
    //console.log('todos loaded from useEffect', todos);
    getUserDetailFromAsyncSrorage();
  });

  const [emailValidError, setEmailValidError] = useState('');

  const validateEmailRunTime = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setEmailValidError('');
    if (reg.test(text) === false) {
      setEmailValidError('Email is Not Correct');
    } else if (reg.test(text) === true) {
      setEmailValidError('');
      setEmail(text);
    }
  };

  const notifyMessage = message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      AlertIOS.alert(message);
    }
  };

  const handleSignUpLoginButtonClick = () => {
    //signUpUser();
    //loginUser();
    //notifyMessage(`${email} ${password}`);
    if (signInMode) {
      //sign up
      signUpUser();
    } else {
      // login
      if (emailValidError === '' && password.length >= 8) {
        // verify user
        loginUser();
      }
    }
  };

  const loginUser = () => {
    console.log(email, password);
    fetch('http://10.0.2.2:8080/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${email}&password=${password}`,
    })
      .then(response => response.json())
      .then(res => {
        //console.log(res);
        //save returned user detail to Async Storage
        saveUserToAsyncStorage(res);
        // save emapty todos to Async Storage
        AsyncStorage.setItem('todos', JSON.stringify(todos))
          .then(json => console.log('Empty Todos creation in AS success!'))
          .catch(error => console.log('Empty Todos creation in AS error!'));
        // navigate to todos page
        navigation.navigate('Todos');
      })
      .catch(error => console.log('fetchToken error: ', error));
  };

  const signUpUser = () => {
    console.log('Inside signup');
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: role,
      githubUserId: githubId,
    };
    console.log(user);

    fetch('http://10.0.2.2:8080/user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        created: null,
        role: role,
        githubUserId: githubId,
      }),
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log('fetchToken error: ', error));
  };

  const saveUserToAsyncStorage = user => {
    AsyncStorage.setItem('user', JSON.stringify(user))
      .then(json => console.log('User Detail Saving success!'))
      .catch(error => console.log('User Detail Saving error!'));
  };

  const getUserDetailFromAsyncSrorage = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        // We have data!!
        // navigate to todos page
        navigation.navigate('Todos');
        //console.log('from AS Todos fetching Saved User', JSON.parse(value));
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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.heroContainer}>
            <Text style={styles.heroTitle}>Todo App</Text>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.title}>
              {signInMode ? 'Sign Up' : 'Log In'}
            </Text>
            <View>
              {signInMode && (
                <TextInput
                  label="FirstName"
                  style={styles.textInputPassword}
                  placeholder="Enter Your First Name"
                  placeholderTextColor="#CCCCCC"
                  value={firstName}
                  onChangeText={text => {
                    setFirstName(text);
                  }}
                />
              )}
              {signInMode && (
                <TextInput
                  label="LastName"
                  style={styles.textInputPassword}
                  placeholder="Enter Your Last Name"
                  placeholderTextColor="#CCCCCC"
                  value={lastName}
                  onChangeText={text => {
                    setLastName(text);
                  }}
                />
              )}
              <TextInput
                label="Email"
                style={styles.textInputEmail}
                placeholder="Your Email id"
                placeholderTextColor="#CCCCCC"
                value={email}
                onChangeText={text => {
                  validateEmailRunTime(text);
                }}
              />
              {emailValidError ? (
                <Text style={styles.errorText}>{emailValidError}</Text>
              ) : null}
              <View style={styles.passwordView}>
                <TextInput
                  label="Passwordd"
                  secureTextEntry={seePassword}
                  placeholder="Password"
                  placeholderTextColor="#CCCCCC"
                  style={styles.textInputPassword}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                />
                <TouchableOpacity
                  style={styles.wrapperIcon}
                  onPress={() => setSeePassword(!seePassword)}>
                  <Image
                    source={
                      seePassword
                        ? require('../assets/open.png')
                        : require('../assets/closed.png')
                    }
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
              {signInMode && (
                <TextInput
                  label="Role"
                  style={styles.textInputPassword}
                  placeholder="Enter Your Role"
                  placeholderTextColor="#CCCCCC"
                  value={role}
                  onChangeText={text => {
                    setRole(text);
                  }}
                />
              )}

              {signInMode && (
                <TextInput
                  label="GithubId"
                  style={styles.textInputPassword}
                  placeholder="Enter Your Github Id"
                  placeholderTextColor="#CCCCCC"
                  value={githubId}
                  onChangeText={text => {
                    setGithubId(text);
                  }}
                />
              )}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  handleSignUpLoginButtonClick();
                }}>
                <Text style={styles.buttonText}>
                  {signInMode ? 'Sign-Up' : 'Log-In'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.dontHaveAccountText}>
                {signInMode
                  ? 'Already Have an Account? '
                  : "Don't Have an Account?"}
                <TouchableOpacity
                  onPress={() => {
                    setSignInMode(!signInMode);
                  }}>
                  <Text style={styles.signupText}>
                    {signInMode ? ' Log In' : ' Sign Up'}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFF',
  },
  mainContainer: {
    height: '100%',
    width: '100%',
    direction: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#CCC',
  },
  heroContainer: {
    flex: 1,
    height: 180,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#CCCCCC',
  },
  loginContainer: {
    flex: 3,
    backgroundColor: '#FFFFFF',
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
  heroTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#000',
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: '#000',
    marginTop: 20,
  },
  textInputEmail: {
    padding: 10,
    margin: 20,
    borderBottomWidth: 0.6,
    underlineColor: '#000000',
    activeUnderlineColor: '#000000',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
  },
  textInputPassword: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 0.6,
    underlineColor: '#000000',
    activeUnderlineColor: '#000000',
    paddingEnd: 25,
  },
  passwordView: {
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  myButton: {
    marginLeft: 40,
    marginEnd: 40,
    marginTop: 20,
    borderWidth: 0.5,
    borderRadius: 10,
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
  dontHaveAccountText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    color: '#000',
    marginTop: 10,
    padding: 10,
  },
  signupText: {
    fontSize: 15,
    color: '#8E0082',
    fontWeight: 'bold',
  },
  wrapperIcon: {
    position: 'absolute',
    right: 0,
    paddingRight: 10,
    marginEnd: 20,
  },

  icon: {
    width: 25,
    height: 20,
  },
});

export default Login;
