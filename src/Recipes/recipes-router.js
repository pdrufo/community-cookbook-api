const express = require('express');
const logger = require('../logger');
const xss = require('xss');

const recipesService = require('./recipes-service');

const bodyParser = express.json();
const recipesRouter = express.Router();

const serializeRecipe = recipe => ({
  id: recipe.id,
  title: xss(recipe.title),
  ingredients: xss(recipe.ingredients),
  instructions: xss(recipe.instructions),
  source: xss(recipe.source),
  date_created: recipe.date_created
});

recipesRouter
.route('/api/recipes')
.get((req, res, next) => {
  recipesService.getAllRecipes(req.app.get('db'))
  .then(recipes => {
    res.json(recipes.map(serializeRecipe));
  })
  .catch(next);
})
.post(bodyParser, (req,res,next) => {
  const {title, ingredients, instructions, source} = req.body;

  if (!title || !ingredients || !instructions || !source) {
    logger.error('Title, instructions, ingredients and source are required')
  }
  const newRecipe = {title, ingredients, instructions, source};

  recipesService.insertRecipe(req.app.get('db'), newRecipe)
  .then(recipe => {
    logger.info(`note with id ${recipe.id} has been created.`);
    res.status(201)
      .location(`/api/recipes/${recipe.id}`)
      .json(serializeNote(recipe));
  })
  .catch(next);
});
recipesRouter
  .route('/api/recipes/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    recipesService.getById(req.app.get('db'), id)
      .then(recipe => {
        if (!recipe) {
          logger.error(`recipe with id ${id} not found`);
          return res
            .status(404)
            .send('recipe not found');
        }
        res.recipe = recipe;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeRecipe(res.recipe)); 
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    recipesService.deleteRecipe(req.app.get('db'), id)
      .then(rowsAffected => {
        if (rowsAffected < 1) {
          logger.info(`recipe with id ${id} not found`);
          res.status(404).send('recipe not found');
        }
        logger.info(`recipe with id ${id} deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const {title, ingredients, instructions, source} = req.body;
    const recipeToUpdate = {title, ingredients, instructions, source};

    recipesService.updateRecipe(req.app.get('db'), req.params.recipe_id, recipeToUpdate)
      .then(numFieldsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = recipesRouter;
