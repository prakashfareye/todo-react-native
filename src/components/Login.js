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

const Login = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signInMode, setSignInMode] = useState(true);
  const [users, setUsers] = useState([]);
  const [showEyeIcon, setShowEyeIcon] = useState(true);

  const SavedCredential = {
    email: 'p@gmail.com',
    password: 'abcdefghi',
  };

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
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(message);
    }
  };

  const handleSignUpLoginButtonClick = () => {
    //notifyMessage(`${email} ${password}`);
    if (signInMode) {
      //sign up
    } else {
      // login
      if (emailValidError === '' && password.length >= 8) {
        // verify user
        if (
          SavedCredential.email === email &&
          SavedCredential.password === password
        ) {
          notifyMessage('User Logged In');
        } else {
          notifyMessage('Bad Credential');
        }
      }
    }
  };

  var icon = showEyeIcon
    ? require('../assets/open-eye.png')
    : require('../assets/closed-eye.png');

  //   useEffect(() => {
  //     var icon = showEyeIcon
  //       ? require('../assets/open-eye.png')
  //       : require('../assets/closed-eye.png');
  //   }, [showEyeIcon]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
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
                  label="Name"
                  style={styles.textInputPassword}
                  placeholder="Enter Your Name"
                  placeholderTextColor="#CCCCCC"
                  onChangeText={text => {
                    setName(text);
                  }}
                />
              )}
              <TextInput
                label="Email"
                style={styles.textInputEmail}
                placeholder="Your Email id"
                placeholderTextColor="#CCCCCC"
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
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor="#CCCCCC"
                  style={styles.textInputPassword}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                />
                {/* <Image
                  source={icon}
                  onPress={() => {
                    setShowEyeIcon(!showEyeIcon);
                    notifyMessage(showEyeIcon);
                  }}
                /> */}
              </View>

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
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#CCCCCC',
  },
  heroContainer: {
    flex: 1,
    // display: 'flex',
    height: 180,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#CCCCCC',
  },
  loginContainer: {
    flex: 3,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },
  passwordView: {
    // flex: 1,
    // flexDirection: 'row',
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
    textAlign: 'center', // <-- the magic
    fontSize: 15,
    color: '#000',
    marginTop: 5,
  },
  signupText: {
    fontSize: 15,
    color: '#8E0082',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Login;
