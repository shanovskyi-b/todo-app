const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const ALL_LISTS = [
  { id: 'list-01', title: 'Home' }, 
  { id: 'list-02', title: 'Work' }
];

const TASKS = {
  'list-01': [
    { id: 'task-01', title: 'Buy bananas' },
    { id: 'task-02', title: 'Vacuum' },
  ],
  'list-02': [
    { id: 'task-03', title: 'Check Friday\'s email regarding prod issue' },
    { id: 'task-04', title: 'Write to Maria to heck her appoinment' },
  ],
}

app.get('/list/', (req, res) => {
  res.statusCode = 200;
  res.json({ lists: ALL_LISTS });
});

app.get('/list/:id', (req, res) => {
  const listId = req.params.id;
  if (!ALL_LISTS.find(list => list.id === listId)) {
    res.statusCode = 400;
  
    res.json({ error: `No list found by id: ${listId}` });
    return;
  }

  const listTasks = TASKS[listId] ?? [];

  res.statusCode = 200;
  
  res.json({ tasks: listTasks });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
