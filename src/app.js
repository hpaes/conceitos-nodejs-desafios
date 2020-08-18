const express = require("express");
const cors = require("cors");

const {
    v4: uuid
} = require("uuid");
const {
    isUuid
} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const {
        title,
        url,
        techs
    } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    };

    repositories.push(repository);

    return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
    const {
        id
    } = request.params;
    const {
        title,
        url,
        techs
    } = request.body;

    let repository = repositories.find(repository => repository.id === id);

    if (!repository) {
      return response.status(400).json({ error: 'Repository not found!'});
    }

    repository = {
      ...repository,
      title,
      url,
      techs
    };

    return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
    const {
        id
    } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({
            error: 'Repository not found!'
        });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoAddLike = repositories.find(repository => repository.id === id);

  if (!repoAddLike) {
    return response.status(400).json({ error: 'Repository not found!'});
  }
  repoAddLike.likes += 1;

  return response.json(repoAddLike);
});

module.exports = app;
