CREATE TABLE recipes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  source TEXT NOT NULL,
  photo_url TEXT NOT NULL
);