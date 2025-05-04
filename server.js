const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let movies = [];

fs.createReadStream(path.join(__dirname, "movies.csv"))

  .pipe(csv())
  .on("data", (row) => {
    movies.push({
      id: row.movieId,
      title: row.title,
      genres: row.genres.split("|").map((g) => g.trim()),
    });
  })

  .on("end", () => {
    console.log("✅ CSV loaded");
  });

app.get("/movies", (req, res) => {
  res.json(movies);
});

function calculateSimilarity(movie1, movie2) {
  return movie1.genres.filter((genre) => movie2.genres.includes(genre)).length;
}

function getRecommendations(selectedTitle) {
  const selected = movies.find((m) => m.title === selectedTitle);
  if (!selected) return [];

  return movies
    .filter((m) => m.title !== selectedTitle)
    .map((m) => ({
      title: m.title,
      score: calculateSimilarity(selected, m),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

app.post("/api/recommend", (req, res) => {
  const { movie } = req.body;
  const recs = getRecommendations(movie);
  res.json(recs);
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
