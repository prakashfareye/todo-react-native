// import Realm from 'realm';
// import {Tasks} from '../database/schema/Tasks';

// const SCHEMA_VERSION = 1;

// const schema = [Tasks];

// let realm = new Realm({
//   path: 'myrealm',
//   schema: schema,
// });

// const saveToRealm = (id, title, description, dueDate, status) => {
//   console.log('inside realm');
//   let task1;

//   realm.write(() => {
//     task1 = realm.create('Task', {
//       _id: id,
//       title: title,
//       description: description,
//       dueDate: dueDate,
//       status: status,
//     });
//     console.log(`created two tasks: ${task1.name}`);
//   });
// };

// const readFromRealm = () => {
//   const tasks = realm.objects('Task');
//   console.log(`The lists of tasks are: ${tasks.map(task => task.name)}`);
// };

// export default {saveToRealm, readFromRealm};
