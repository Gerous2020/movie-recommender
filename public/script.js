let movies = [];
let filteredMovies = [];

// serverla fetch panrathuku
fetch(
  "http://localhost:5000/movies" ||
    "https://movie-recommender-9n05.onrender.com/movies"
)
  .then((response) => response.json())
  .then((data) => {
    movies = data;
    filteredMovies = data;
    populateMovieSelect(filteredMovies);
    displayMovies(filteredMovies); // movies show aagrathuku
  });

// dropdown options oda irukkum
function populateMovieSelect(moviesList) {
  const selectElement = document.getElementById("movieSelect");
  selectElement.innerHTML = '<option value="">Select a movie</option>'; // reset panrathuku

  moviesList.forEach((movie) => {
    const option = document.createElement("option");
    option.value = movie.title;
    option.textContent = movie.title;
    selectElement.appendChild(option);
  });
}

// input vachi movie filter panrathuku
function filterMovies() {
  const query = document.getElementById("searchBar").value.toLowerCase();

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(query)
  );

  populateMovieSelect(filteredMovies); // dropdown update ku
  displayMovies(filteredMovies); // Display the filtered movies
}

// Function to display movies in the HTML
function displayMovies(moviesList) {
  const movieListContainer = document.getElementById("movieList");
  movieListContainer.innerHTML = ""; // previous ah ullatha remove pannum

  moviesList.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");
    movieItem.innerHTML = `
      <h3>${movie.title}</h3>
      <p>${movie.genres.join(" | ")}</p>
      <button class=btns  onclick="getRecommendations('${
        movie.title
      }')">Get Recommendations</button>
    `;
    movieListContainer.appendChild(movieItem);
  });
  const btns = document.getElementsByClassName("btns");
  for (let index = 0; index < btns.length; index++) {
    btns[index].addEventListener("click", () => {
      document
        .getElementById("recommendations")
        .classList.add("recommendations");
      document
        .getElementById("recommendations")
        .classList.remove("recommendationson");
    });
  }
}

// ithan recommended movies solum
function getRecommendations(selectedMovie) {
  fetch("http://localhost:5000/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ movie: selectedMovie }),
  })
    .then((response) => response.json())
    .then((recommendations) => {
      const recContainer = document.getElementById("recommendations");
      recContainer.innerHTML = `<h3>Recommended Movies based on "${selectedMovie}":</h3>`;

      recommendations.forEach((rec) => {
        const recItem = document.createElement("div");
        recItem.innerHTML = `<p>${rec.title}</p>`;
        recContainer.appendChild(recItem);
      });
      const recBtn = document.createElement("button");
      recBtn.classList.add("btns");
      recContainer.appendChild(recBtn);
      recBtn.innerHTML = "Close Recommendations";
      recBtn.addEventListener("click", () => {
        recContainer.innerHTML = "";
        document
          .getElementById("recommendations")
          .classList.remove("recommendations");
        // recommandation ah remove pannum
        displayMovies(filteredMovies); // return movies ah show pannum
      });
    });
}
