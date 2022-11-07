import React, {useEffect, useState} from 'react';
import {Node} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

const ListItem = item => {
  return (
    <View style={styles.listContainer}>
      <View style={styles.listItem}>
        <View style={styles.imageView}>
          <Image
            source={require('../assets/suitcase.png')}
            style={styles.icon}
            onPress={() => {
              //
            }}
          />
        </View>
        <View style={styles.textBox}>
          <View style={styles.titleBox}>
            <Text style={styles.todoTitle}>{item.title}</Text>
            <Text style={styles.todoDueDate}>{item.dueDate}</Text>
          </View>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
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
