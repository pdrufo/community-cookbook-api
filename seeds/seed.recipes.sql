INSERT INTO recipes (title, source)
VALUES
(
  'Chicken Piccata',
  'Food Network'
),
(
  'Beef Stew',
  'NY Times'
),
(
  'Lasagna',
  'Grandma'
);

INSERT INTO ingredients (ingredient, recipe_id)
VALUES 
(
  'Salt, Pepper, Chicken, Lemon, Flour, Wine',
  1
),
(
  'Beef, Carrots, Potatoes, Celery',
  2
),
(
  'Noodle, Sauce, Bechemel, Parmigiano Reggiano',
  3
);

INSERT INTO instructions (instruction, recipe_id)
VALUES 
(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.',
  1
),
(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.',
  2
),
(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Eget gravida cum sociis natoque penatibus et magnis dis. Eu facilisis sed odio morbi quis commodo.',
  3
)
