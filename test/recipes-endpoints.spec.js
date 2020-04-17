const knex = require("knex");
const app = require("../src/app");
const { makeRecipesArray, makeMaliciousRecipe } = require("./recipes.fixtures");

describe("Recipes Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("recipes").truncate());

  afterEach("cleanup", () => db("recipes").truncate());

  describe(`GET /api/recipes`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/recipes").expect(200, []);
      });
    });

    context("Given there are recipes in the database", () => {
      const testRecipes = makeRecipesArray();

      beforeEach("insert recipes", () => {
        return db.into("recipes").insert(testRecipes);
      });

      it("responds with 200 and all of the recipes", () => {
        return supertest(app).get("/api/recipes").expect(200, testRecipes);
      });
    });

    context(`Given an XSS attack recipe`, () => {
      const { maliciousRecipe, expectedRecipe } = makeMaliciousRecipe();

      beforeEach("insert malicious recipe", () => {
        return db.into("recipes").insert([maliciousRecipe]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/recipes`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].title).to.eql(expectedRecipe.title);
            expect(res.body[0].content).to.eql(expectedRecipe.content);
          });
      });
    });
  });

  describe(`GET /api/recipes/:id`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(404, { error: { message: `Recipe doesn't exist` } });
      });
    });

    context("Given there are recipes in the database", () => {
      const testRecipes = makeRecipesArray();

      beforeEach("insert recipes", () => {
        return db.into("recipes").insert(testRecipes);
      });

      it("responds with 200 and the specified recipe", () => {
        const recipeId = 2;
        const expectedRecipe = testRecipes[recipeId - 1];
        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(200, expectedRecipe);
      });
    });

    context(`Given an XSS attack recipe`, () => {
      const { maliciousRecipe, expectedRecipe } = makeMaliciousRecipe();

      beforeEach("insert malicious recipe", () => {
        return db.into("recipes").insert([maliciousRecipe]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/recipes/${maliciousRecipe.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.title).to.eql(expectedRecipe.title);
            expect(res.body.content).to.eql(expectedRecipe.content);
          });
      });
    });
  });

  describe(`POST /api/recipes`, () => {
    it(`creates a recipe, responding with 201 and the new recipe`, () => {
      const newRecipe = {
        title: "Test new recipe",
        ingredients: "Test new recipe ingredients",
        instructions: "Test new recipe instructions",
        source: "Test new recipe source",
      };
      return supertest(app)
        .post("/api/recipes")
        .send(newRecipe)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(newRecipe.title);
          expect(res.body.ingredients).to.eql(newRecipe.ingredients);
          expect(res.body.instructions).to.eql(newRecipe.instructions);
          expect(res.body.source).to.eql(newRecipe.source);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/recipes/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/recipes/${res.body.id}`).expect(res.body)
        );
    });

    const requiredFields = ["title", "ingredients", "instructions", "source"];

    requiredFields.forEach((field) => {
      const newRecipe = {
        title: "Test new recipe",
        ingredients: "Test new recipe ingredients",
        instructions: "Test new recipe instructions",
        source: "Test new recipe source",
      };

      it(`responds with 500 and an error message when the '${field}' is missing`, () => {
        delete newRecipe[field];

        return supertest(app).post("/api/recipes").send(newRecipe).expect(500);
      });
    });

    it("removes XSS attack content from response", () => {
      const { maliciousRecipe, expectedRecipe } = makeMaliciousRecipe();
      return supertest(app)
        .post(`/api/recipes`)
        .send(maliciousRecipe)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(expectedRecipe.title);
          expect(res.body.content).to.eql(expectedRecipe.content);
        });
    });
  });

  describe(`DELETE /api/recipes/:id`, () => {
    context(`Given no articles`, () => {
      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .delete(`/api/recipes/${recipeId}`)
          .expect(404, { error: { message: `Recipe doesn't exist` } });
      });
    });

    context("Given there are recipes in the database", () => {
      const testRecipes = makeRecipesArray();

      beforeEach("insert recipes", () => {
        return db.into("recipes").insert(testRecipes);
      });
    });
  });

  describe(`PATCH /api/recipes/:id`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .delete(`/api/recipes/${recipeId}`)
          .expect(404, { error: { message: `Recipe doesn't exist` } });
      });
    });

    context("Given there are recipes in the database", () => {
      const testRecipes = makeRecipesArray();

      beforeEach("insert recipes", () => {
        return db.into("recipes").insert(testRecipes);
      });

      it(`responds with 500 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/recipes/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(500);
      });
    });
  });
});
