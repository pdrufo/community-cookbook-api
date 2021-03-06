function makeRecipesArray() {
  return [
    {
      id: 1,
      title: "Chicken Piccata",
      ingredients: "Salt, Pepper, Chicken, Lemon, Flour, Wine",
      instructions:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.",
      source: "Food Network",
    },
    {
      id: 2,
      title: "Beef Stew",
      ingredients: "Beef, Carrots, Potatoes, Celery",
      instructions:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.",
      source: "NY TIMES",
    },
    {
      id: 3,
      title: "Lasagna",
      ingredients: "Noodle, Sauce, Bechemel, Parmigiano Reggiano",
      instructions:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.",
      source: "Grandma",
    },
  ];
}

function makeMaliciousRecipe() {
  const maliciousRecipe = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    ingredients: "bad stuff",
    instructions:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.",
    source: "not grandma",
  };
  const expectedRecipe = {
    ...maliciousRecipe,
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    ingredients: "bad stuff",
    instructions:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.",
    source: "not grandma",
  };
  return {
    maliciousRecipe,
    expectedRecipe,
  };
}
module.exports = { makeRecipesArray, makeMaliciousRecipe };
