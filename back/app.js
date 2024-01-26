const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/list/', (req, res) => {
  res.statusCode = 200;
  res.json({ lists: [{ id: 'list-01', title: 'List 1' }, { id: 'list-02', title: 'List 2' }] });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
