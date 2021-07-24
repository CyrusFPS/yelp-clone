require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db");
const app = express();
const port = process.env.PORT;

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Restaurant API Routes

app.get("/api/v1/restaurants", async (req, res) => {
  // Get all restaurants
  try {
    const restaurants = await db.query(
      "SELECT * FROM restaurants LEFT JOIN(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id"
    );
    res.status(200).json({
      status: "success",
      results: restaurants.rows.length,
      data: {
        restaurants: restaurants.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/v1/restaurants/:id", async (req, res) => {
  // Get one restaurant
  try {
    const restaurants = await db.query(
      "SELECT * FROM restaurants LEFT JOIN(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id WHERE id = $1",
      [req.params.id]
    );
    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1",
      [req.params.id]
    );
    res.status(200).json({
      status: "success",
      results: restaurants.rows.length + reviews.rows.length,
      data: {
        restaurant: restaurants.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/restaurants", async (req, res) => {
  // Create one restaurant
  const restaurant = req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *",
      [restaurant.name, restaurant.location, restaurant.price_range]
    );
    res.status(201).json({
      status: "success",
      results: rows.length,
      data: {
        restaurant: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/v1/restaurants/:id", async (req, res) => {
  // Update one restaurant
  const restaurant = req.body;
  try {
    const { rows } = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [
        restaurant.name,
        restaurant.location,
        restaurant.price_range,
        req.params.id,
      ]
    );
    res.status(200).json({
      status: "success",
      results: rows.length,
      data: {
        restaurant: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  // Delete one restaurant
  try {
    const results = await db.query("DELETE FROM restaurants WHERE id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/restaurants/:id/reviews", async (req, res) => {
  try {
    const { rows } = await db.query(
      "INSERT INTO reviews(restaurant_id, name, body, rating) VALUES($1, $2, $3, $4) returning *",
      [req.params.id, req.body.name, req.body.body, req.body.rating]
    );
    res.status(201).json({
      status: "success",
      results: rows.length,
      data: {
        review: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`SERVER LISTENING ON PORT ${port}`);
});
