const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json({ taskLists: [{ id: 'list-01', title: 'List 1' }, { id: 'list-02', title: 'List 2' }] })
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
