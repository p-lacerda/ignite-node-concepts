const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userExists = users.some(user => user.username === username);

  if (!userExists) {
    return response.status(400).json({ error: 'User not exist' });
  }

  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (!name || !username) {
    return response.status(400).json({ error: 'Name or username is missing' });
  }

  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: 'User already exists' });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const userFiltered = users.find(user => user.username === username);

  return response.status(200).json(userFiltered.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const userFiltered = users.find(user => user.username === username);

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date(),
  }

  userFiltered.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;