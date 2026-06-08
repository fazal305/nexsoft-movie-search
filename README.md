# 🎬 MovieSearch

A responsive movie search application built for the **Nexsoft Solutions Frontend Development Internship**.

MovieSearch uses the **OMDB API** to fetch real movie data, display movie posters, show full movie information in a Bootstrap modal, and navigate results using dynamic pagination.

---

## 🌐 Live Demo

**GitHub Pages:**

https://fazal305.github.io/nexsoft-movie-search/

---

## 📂 GitHub Repository

https://github.com/fazal305/nexsoft-movie-search

---

## ✨ Features

### Movie Search

* Search movies by title
* Search using button click
* Search using Enter key
* Debounced live search (600ms)
* Default movie search on page load
* Input validation (minimum 2 characters)

### Movie Results

* Real movie data from OMDB API
* Movie posters
* Poster fallback placeholders
* Movie title
* Release year
* Animated movie cards
* Responsive movie grid

### Movie Details Modal

* Full movie details
* Large movie poster
* IMDb rating
* Visual rating bar
* Runtime
* Genre
* Director
* Actors
* Awards
* Language
* Country
* Box Office earnings
* IMDb profile link

### Pagination

* First page button
* Previous page button
* Page numbers
* Next page button
* Last page button
* Dynamic page range
* Result count display

### User Experience

* Skeleton loading cards
* Empty state
* Error state
* Retry button
* Back To Top button
* Responsive design
* Dark neon cyberpunk interface

---

## 🛠️ Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* Bootstrap 5
* jQuery 3.7.1
* OMDB API

---

## 🔑 OMDB API Setup

This project requires a free OMDB API key.

### Step 1

Visit:

https://www.omdbapi.com/

### Step 2

Click the **API Key** tab.

### Step 3

Choose the **Free Plan**.

### Step 4

Enter your email address.

### Step 5

Check your inbox and copy your API key.

### Step 6

Open:

```javascript
script.js
```

Replace:

```javascript
const API_KEY = "your_omdb_key_here";
```

With:

```javascript
const API_KEY = "YOUR_API_KEY";
```

---

## 🚀 How To Run

Clone the repository:

```powershell
git clone https://github.com/fazal305/nexsoft-movie-search.git
```

Open the project folder:

```powershell
cd nexsoft-movie-search
```

Open:

```text
index.html
```

in your browser.

No build tools or installation required.

---

## 📸 Screenshot

Add your screenshot after testing:

```markdown
![MovieSearch Screenshot](screenshot.png)
```

---

## ✅ Nexsoft Solutions Requirements Covered

### Requirement 1

Fetch movie data from API

✔ OMDB API Search Endpoint

✔ OMDB API Detail Endpoint

✔ fetch()

✔ async/await

✔ try/catch

### Requirement 2

Implement movie search functionality

✔ Search input

✔ Search button

✔ Enter key support

✔ Validation

✔ Loading state

✔ Live search

### Requirement 3

Display movie details and posters

✔ Posters

✔ Poster fallback

✔ Movie details modal

✔ IMDb ratings

✔ IMDb link

### Requirement 4

Add pagination

✔ Dynamic pagination

✔ First / Previous / Next / Last

✔ Page range display

### Requirement 5

Create responsive user interface

✔ Bootstrap responsive layout

✔ Mobile-friendly design

✔ Empty state

✔ Error state

✔ Skeleton loading

✔ Back To Top button

---

## 👨‍💻 Author

**Fazal Abbas**

Frontend Developer | Software Engineering Student

GitHub:
https://github.com/fazal305

LinkedIn:
https://www.linkedin.com/in/fazal-abbas-4653dg86

---

## 📜 License

This project is licensed under the MIT License.
