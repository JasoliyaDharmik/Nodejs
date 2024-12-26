const express = require('express');

const app = express();

// Order's of route is matters

app.use('/hello/:id', (req, res) => {
  res.send('Hello with id');
});

app.use('/hello', (req, res) => {
  res.send('Hello');
});

app.use('/test', (req, res) => {
  res.send('Test');
});

app.use('/', (req, res) => {
  res.send('Hello World new');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});