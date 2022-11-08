import React from 'react';
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

const ChoseDB = () => {
  return (
    <View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          //
          //
        }}>
        <Text style={styles.buttonText}> Use Async Storage</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          //
          //onsole.log('From Realm', tasks);
        }}>
        <Text style={styles.buttonText}> Use Realm Db</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChoseDB;

const styles = StyleSheet.create({
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
});
