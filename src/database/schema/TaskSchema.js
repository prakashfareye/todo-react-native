const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'int',
    title: 'string',
    description: 'string',
    dueDate: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
};

export default TaskSchema;
