const express = require('express');
const cors = require('cors');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())

const ROOT = './tmp/';
const LISTS_FILE = ROOT + 'lists.txt';
const TASKS_FILE = ROOT + 'tasks.txt';

if (!fs.existsSync(ROOT)){
  fs.mkdirSync(ROOT);
}

if (!fs.existsSync(LISTS_FILE)) {
  const ALL_LISTS = [
    { id: 'list-01', title: 'Home' }, 
    { id: 'list-02', title: 'Work' }
  ];
  
  fs.writeFileSync(LISTS_FILE, JSON.stringify(ALL_LISTS));
}

if (!fs.existsSync(TASKS_FILE)) {
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
  
  fs.writeFileSync(TASKS_FILE, JSON.stringify(TASKS));
}

app.get('/list/', (req, res) => {
  fs.readFile(LISTS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
      return;
    }

    res.statusCode = 200;
    res.json({ lists: JSON.parse(data) });
  });
});

app.post('/list/', (req, res) => {
  if (!req.body?.title || typeof req.body.title !== 'string') {
    res.statusCode = 500;
    res.json({ error: '"Title" is invalid' });
    return;
  }

  fs.readFile(LISTS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
      return;
    }

    let lists = JSON.parse(data);
    const newList = { id: uuidv4(), title: req.body.title };

    lists = [
      ...lists,
      newList
    ];

    fs.writeFile(LISTS_FILE, JSON.stringify(lists), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err });
        return;
      }

      res.statusCode = 200;
      res.json({ list: newList });
    });
  });
});

app.get('/list/:id', (req, res) => {
  const listId = req.params.id;
  
  fs.readFile(LISTS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
      return;
    }

    const lists = JSON.parse(data);

    if (!lists.find(list => list.id === listId)) {
      res.statusCode = 400;
    
      res.json({ error: `No list found by id: ${listId}` });
      return;
    }

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err });
        return;
      }
      const tasks = JSON.parse(data);
      const listTasks = tasks[listId] ?? [];
    
      res.statusCode = 200;
      res.json({ tasks: listTasks });
    });
  });
});

app.put('/list/:id', (req, res) => {
  const listId = req.params.id;

  if (
    !req.body?.list 
    || !req.body.list.title 
    || typeof req.body.list.title !== 'string'
    || req.body.list.id !== listId
  ) {
    res.statusCode = 500;
    res.json({ error: 'List is invalid' });
    return;
  }

  fs.readFile(LISTS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
      return;
    }

    let lists = JSON.parse(data);
    let editedList = lists.find(list => list.id === listId);

    if (!editedList) {
      res.statusCode = 400;
    
      res.json({ error: `No list found by id: ${listId}` });
      return;
    }

    editedList = req.body.list;
    lists = lists.map(
      list => list.id === listId 
        ? editedList
        : list
    );

    fs.writeFile(LISTS_FILE, JSON.stringify(lists), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err });
        return;
      }

      res.statusCode = 200;
      res.json({ list: editedList });
    });
  });
});

app.delete('/list/:id', (req, res) => {
  const listId = req.params.id;

  fs.readFile(LISTS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
      return;
    }

    let lists = JSON.parse(data);
    let deletedList = lists.find(list => list.id === listId);

    if (!deletedList) {
      res.statusCode = 400;
    
      res.json({ error: `No list found by id: ${listId}` });
      return;
    }

    lists = lists.filter(
      list => list.id !== listId
    );

    fs.writeFile(LISTS_FILE, JSON.stringify(lists), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err });
        return;
      }

      res.statusCode = 200;
      res.json(null);
    });
  });
});

//////////// Individual task ///////////////
// Create
app.post('/list/:listId/task', (req, res) => {
  const listId = req.params.listId;

  if (!req.body?.title || typeof req.body.title !== 'string') {
    res.statusCode = 500;
    res.json({ error: '"Title" is invalid' });
    return;
  }

  fs.readFile(LISTS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
      return;
    }

    const lists = JSON.parse(data);
    const editedList = lists.find(list => list.id === listId);

    if (!editedList) {
      res.statusCode = 400;
    
      res.json({ error: `No list found by id: ${listId}` });
      return;
    }

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err });
        return;
      }
      const tasks = JSON.parse(data);
      const newTask = { id: uuidv4(), title: req.body.title };
      let listTasks = tasks[listId] ?? [];
      listTasks = [...listTasks, newTask];
      
      fs.writeFile(TASKS_FILE, JSON.stringify(listTasks), (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.json({ error: err });
          return;
        }
  
        res.statusCode = 200;
        res.json({ task: newTask, allTasks: listTasks });
      });
    });

  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
