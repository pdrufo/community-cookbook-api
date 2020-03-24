const recipesService = {

  getAllRecipes(knex) {
    return knex
    .join('instructions', 'recipe_id', '=', 'instructions.recipe_id')
    .join('ingredients', 'recipe_id', '=', 'ingredients.recipe_id')
    .select('title', 'ingredients', 'instructions', 'source')
    .from('recipes')
  },

  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select('*')
      .from('recipes')
      .where('id', id)
      .first();
  },
  deleteRecipe(db, id) {
    return db('recipes')
      .where({ id })
      .delete();
  },
  updateRecipe(db, id, newRecipeFields) {
    return db('recipes')
      .where({ id })
      .update(newRecipeFields);
  }
}
module.exports = recipesService;