let movieLists = JSON.parse(localStorage.getItem('movieLists')) || [];

function displayMovieLists() {
    const movieListsContainer = document.getElementById('movie-lists');
    movieListsContainer.innerHTML = '';

    movieLists.forEach((list, index) => {
        const listElement = document.createElement('div');
        listElement.classList.add('col-md-6', 'mb-4');
        listElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${list.name}</h5>
                    <button class="btn btn-danger btn-sm float-end" onclick="deleteList(${index})">Delete</button>
                    <div class="row">
                        ${list.movies.map(movie => `
                            <div class="col-md-6">
                                <div class="card movie-card">
                                    <img src="${movie.image}" class="card-img-top" alt="${movie.title}">
                                    <div class="card-body">
                                        <h6 class="card-title">${movie.title}</h6>
                                        <p class="card-text">${movie.description}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
        movieListsContainer.appendChild(listElement);
    });
}

function deleteList(index) {
    movieLists.splice(index, 1);
    localStorage.setItem('movieLists', JSON.stringify(movieLists));
    displayMovieLists();
}

function displayMovies(movies) {
    const movieListsContainer = document.getElementById('movie-lists');
    movieListsContainer.innerHTML = '';
    if (movies.length === 0) {
        movieListsContainer.innerHTML = '<p class="text-center">No movies found</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'col-md-3';
        movieCard.innerHTML = `
            <div class="card movie-card mb-4">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200'}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">${movie.Year}</p>
                    <button class="btn btn-primary btn-sm" onclick="addMovieToList('${movie.imdbID}', '${movie.Title}', '${movie.Poster}', '${movie.Year}')">Add to List</button>
                </div>
            </div>
        `;
        movieListsContainer.appendChild(movieCard);
    });
}


async function fetchMovies(query) {
    const apiKey = 'ca9009b9'; // Replace with your OMDb API key
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`);
    const data = await response.json();
    console.log('Fetched movies:', data); // Debug output
    if (data.Response === "True") {
        return data.Search || [];
    } else {
        return [];
    }
}

function addMovieToList(id, title, poster, year) {
    const movie = {
        id,
        title,
        image: poster !== 'N/A' ? poster : 'https://via.placeholder.com/200',
        description: year
    };

    let listName = prompt("Enter the list name to add this movie to:");
    if (!listName) return;

    let list = movieLists.find(l => l.name === listName);
    if (!list) {
        list = {
            name: listName,
            movies: []
        };
        movieLists.push(list);
    }

    list.movies.push(movie);
    localStorage.setItem('movieLists', JSON.stringify(movieLists));
    displayMovieLists();
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const movies = await fetchMovies(query);
            displayMovies(movies);
        }
    });

    displayMovieLists();
});
