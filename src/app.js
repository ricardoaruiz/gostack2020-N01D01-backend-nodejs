const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

// Middleware validate id
const validateId = (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ message: 'Invalid id'});
  }
  return next();
};
app.use('/repositories/:id', validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const newRepository = {
    id: uuid(),
    likes: 0,
    ...request.body
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);

});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0 ) {
    return response.status(400).send();
  }

  const oldRepository = repositories[repositoryIndex];
  const updatedRepository = {
    ...request.body,
    id,
    likes: oldRepository.likes,
  };

  repositories.splice(repositoryIndex, 1, updatedRepository);
  return response.json(updatedRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  const actualRepo = repositories[repositoryIndex];
  const likes = actualRepo.likes + 1;
  const likedRepo = {
    ...actualRepo,
    likes
  };

  repositories.splice(repositoryIndex, 1, likedRepo);

  return response.json({ likes });

});

module.exports = app;
