const API_KEY = "http://www.omdbapi.com/?i=tt3896198&apikey=debf653a";
const API_BASE = "https://www.omdbapi.com/";
const RESULTS_PER_PAGE = 10;

const appState = {
  currentQuery: "",
  currentPage: 1,
  totalResults: 0,
  totalPages: 0,
  isLoading: false
};

// Searches movies from OMDB API and renders the results.
async function searchMovies(query, page = 1) {
  if (appState.isLoading) return;

  appState.isLoading = true;
  appState.currentQuery = query;
  appState.currentPage = page;

  showLoading();

  try {
    const searchUrl = `${API_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=${page}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.Response === "False") {
      appState.totalResults = 0;
      appState.totalPages = 0;
      showEmptyState(query);
      return;
    }

    appState.totalResults = Number(data.totalResults);
    appState.totalPages = Math.ceil(appState.totalResults / RESULTS_PER_PAGE);

    renderMovies(data.Search);
    renderPagination(appState.totalResults, appState.currentPage);

    const startResult = (page - 1) * RESULTS_PER_PAGE + 1;
    const endResult = Math.min(page * RESULTS_PER_PAGE, appState.totalResults);

    $("#results-title").text(`Showing results for "${query}"`);
    $("#results-count").text(`Showing results ${startResult}-${endResult} of ${appState.totalResults}`);
    $("#clear-search-btn").removeClass("d-none");
  } catch (error) {
    showError("Unable to reach OMDB API. Please verify your API key, internet connection, or daily request limit.");
  } finally {
    appState.isLoading = false;
  }
}

// Fetches full movie details using the IMDb ID.
async function fetchMovieDetail(imdbId) {
  const detailUrl = `${API_BASE}?apikey=${API_KEY}&i=${imdbId}&plot=full`;
  const response = await fetch(detailUrl);
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie details not found.");
  }

  return data;
}

// Builds and displays movie cards inside the grid.
function renderMovies(movies) {
  $("#movies-grid").empty();

  movies.forEach(function (movie) {
    $("#movies-grid").append(buildMovieCard(movie));
  });

  $("#status-area").empty();
}

// Builds a single movie card element.
function buildMovieCard(movie) {
  const posterHtml = movie.Poster !== "N/A"
    ? `<img src="${movie.Poster}" alt="${movie.Title} poster" class="movie-poster" onerror="handlePosterError(this)" />`
    : `
      <div class="poster-placeholder">
        <div>
          <span>🎬</span>
          <p>${movie.Title}</p>
        </div>
      </div>
    `;

  return `
    <article class="movie-card">
      ${posterHtml}
      <div class="movie-card-body">
        <h3 class="movie-title">${movie.Title}</h3>
        <p class="movie-year">${movie.Year}</p>
        <button class="view-detail-btn" type="button" data-imdb-id="${movie.imdbID}">
          View Details
        </button>
      </div>
    </article>
  `;
}

// Opens the modal, shows loading, fetches movie detail, and renders it.
async function showMovieDetail(imdbId) {
  $("#movie-modal-title").text("Loading Movie...");
  $("#movie-modal-body").html(`
    <div class="modal-loading">
      <div class="spinner-border text-info" role="status"></div>
      <p>Fetching full movie details...</p>
    </div>
  `);

  $("#movie-modal").modal("show");

  try {
    const movie = await fetchMovieDetail(imdbId);
    renderModal(movie);
  } catch (error) {
    $("#movie-modal-title").text("Unable to load details");
    $("#movie-modal-body").html(`
      <section class="error-state">
        <div>
          <span>⚠️</span>
          <h3>Details Error</h3>
          <p>${error.message}</p>
        </div>
      </section>
    `);
  }
}

// Fills the Bootstrap modal with full movie information.
function renderModal(movie) {
  const posterHtml = movie.Poster !== "N/A"
    ? `<img src="${movie.Poster}" alt="${movie.Title} poster" class="modal-poster" />`
    : `
      <div class="modal-poster-placeholder">
        <div>
          <span>🎬</span>
          <p>No poster available</p>
        </div>
      </div>
    `;

  $("#movie-modal-title").text(movie.Title);

  $("#movie-modal-body").html(`
    <section class="modal-movie-layout">
      <div>${posterHtml}</div>

      <div class="modal-info">
        <h3>${movie.Title}</h3>

        <div class="detail-meta">
          <span class="detail-badge">${movie.Year}</span>
          <span class="detail-badge">${movie.Rated}</span>
          <span class="detail-badge">${movie.Runtime}</span>
          <span class="detail-badge">${movie.Genre}</span>
        </div>

        ${buildRatingBar(movie.imdbRating)}

        <p class="plot-text">${movie.Plot}</p>

        <div class="detail-list">
          <p><strong>Director:</strong> ${movie.Director}</p>
          <p><strong>Actors:</strong> ${movie.Actors}</p>
          <p><strong>Awards:</strong> ${movie.Awards}</p>
          <p><strong>Language:</strong> ${movie.Language}</p>
          <p><strong>Country:</strong> ${movie.Country}</p>
          <p><strong>Box Office:</strong> ${movie.BoxOffice || "N/A"}</p>
        </div>

        <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" rel="noopener noreferrer" class="imdb-link-btn">
          🎥 View on IMDb
        </a>
      </div>
    </section>
  `);
}

// Converts IMDb rating into a visual rating bar.
function buildRatingBar(rating) {
  const ratingNumber = rating === "N/A" ? 0 : Number(rating);
  const ratingPercentage = Math.min(ratingNumber * 10, 100);

  return `
    <div class="rating-block">
      <p class="rating-text">⭐ IMDb Rating: ${rating}/10</p>
      <div class="rating-track">
        <div class="rating-fill" style="width: ${ratingPercentage}%"></div>
      </div>
    </div>
  `;
}

// Builds dynamic pagination controls.
function renderPagination(totalResults, currentPage) {
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  if (totalPages <= 1) {
    $("#pagination-area").empty();
    return;
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  let paginationHtml = `<ul class="pagination-list">`;

  paginationHtml += `
    <li><button class="page-btn" data-page="1" ${currentPage === 1 ? "disabled" : ""}>« First</button></li>
    <li><button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>‹ Prev</button></li>
  `;

  for (let page = startPage; page <= endPage; page++) {
    paginationHtml += `
      <li>
        <button class="page-btn ${page === currentPage ? "active" : ""}" data-page="${page}">
          ${page}
        </button>
      </li>
    `;
  }

  paginationHtml += `
    <li><button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next ›</button></li>
    <li><button class="page-btn" data-page="${totalPages}" ${currentPage === totalPages ? "disabled" : ""}>Last »</button></li>
  `;

  paginationHtml += `</ul>`;

  $("#pagination-area").html(paginationHtml);
}

// Changes page and fetches the same query again.
function goToPage(page) {
  const pageNumber = Number(page);

  if (pageNumber < 1 || pageNumber > appState.totalPages || pageNumber === appState.currentPage) return;

  searchMovies(appState.currentQuery, pageNumber);
  scrollToTop();
}

// Shows skeleton loading cards while API data loads.
function showLoading() {
  $("#status-area").empty();
  $("#pagination-area").empty();
  $("#movies-grid").empty();

  for (let index = 0; index < RESULTS_PER_PAGE; index++) {
    $("#movies-grid").append(`
      <article class="skeleton-card">
        <div class="skeleton-poster"></div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-button"></div>
        </div>
      </article>
    `);
  }
}

// Shows a friendly error message with a retry button.
function showError(message) {
  $("#movies-grid").html(`
    <section class="error-state">
      <div>
        <span>⚠️</span>
        <h3>API Error</h3>
        <p>${message}</p>
        <button class="retry-btn" id="retry-btn" type="button">Try Again</button>
      </div>
    </section>
  `);

  $("#pagination-area").empty();
  $("#results-title").text("Unable to load movies");
  $("#results-count").text("Check your API key, internet connection, or daily OMDB limit.");
}

// Shows empty state when no movies are found.
function showEmptyState(query) {
  $("#movies-grid").html(`
    <section class="empty-state">
      <div>
        <span>🔍</span>
        <h3>No movies found</h3>
        <p>No movies found for "${query}". Try another movie title, actor name, or year.</p>
      </div>
    </section>
  `);

  $("#status-area").empty();
  $("#pagination-area").empty();
  $("#results-title").text(`No results for "${query}"`);
  $("#results-count").text("Try a different movie title.");
  $("#clear-search-btn").removeClass("d-none");
}

// Replaces a broken poster image with a styled placeholder.
function handlePosterError(imgElement) {
  const movieTitle = $(imgElement).attr("alt").replace(" poster", "");

  $(imgElement).replaceWith(`
    <div class="poster-placeholder">
      <div>
        <span>🎬</span>
        <p>${movieTitle}</p>
      </div>
    </div>
  `);
}

// Smoothly scrolls back to the results area.
function scrollToTop() {
  const resultsOffset = $(".main-content").offset().top - 20;

  window.scrollTo({
    top: resultsOffset,
    behavior: "smooth"
  });
}

// Reads the input, validates it, and starts a new search.
function handleSearch() {
  const searchValue = $("#search-input").val().trim();

  if (searchValue.length < 2) {
    $("#validation-message").text("Please enter at least 2 characters.");
    return;
  }

  $("#validation-message").text("");
  $(".genre-pill").removeClass("active");
  $('.genre-pill[data-genre="all"]').addClass("active");
  searchMovies(searchValue, 1);
}

// Delays live search until the user stops typing.
function debounce(callback, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(function () {
      callback.apply(this, args);
    }, delay);
  };
}

const liveSearch = debounce(function () {
  const query = $("#search-input").val().trim();

  if (query.length >= 2) {
    $("#validation-message").text("");
    searchMovies(query, 1);
  }
}, 600);

// Starts the app after the HTML page is fully loaded.
$(document).ready(function () {
  searchMovies("batman", 1);

  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    handleSearch();
  });

  $("#search-input").on("input", function () {
    liveSearch();
  });

  $(".genre-pill").on("click", function () {
    const selectedGenre = $(this).data("genre");

    $(".genre-pill").removeClass("active");
    $(this).addClass("active");

    if (selectedGenre === "all") {
      searchMovies("batman", 1);
      return;
    }

    searchMovies(`${selectedGenre} movie`, 1);
  });

  $(document).on("click", ".view-detail-btn", function () {
    const imdbId = $(this).data("imdb-id");
    showMovieDetail(imdbId);
  });

  $(document).on("click", ".page-btn", function () {
    const selectedPage = $(this).data("page");
    goToPage(selectedPage);
  });

  $("#clear-search-btn").on("click", function () {
    $("#search-input").val("");
    $("#validation-message").text("");
    $(".genre-pill").removeClass("active");
    $('.genre-pill[data-genre="all"]').addClass("active");
    searchMovies("batman", 1);
  });

  $(document).on("click", "#retry-btn", function () {
    searchMovies(appState.currentQuery || "batman", appState.currentPage || 1);
  });

  $("#back-to-top").on("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 300) {
      $("#back-to-top").addClass("show");
    } else {
      $("#back-to-top").removeClass("show");
    }
  });
});