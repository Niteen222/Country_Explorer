const apiUrl = 'https://restcountries.com/v3.1/all';
let countries = [];
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
    document.getElementById('search').addEventListener('input', handleSearch);
    renderFavorites();
});

async function fetchCountries() {
    try {
        const response = await fetch(apiUrl);
        countries = await response.json();
        renderCountries(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function renderCountries(countries) {
    const countriesContainer = document.getElementById('countries');
    countriesContainer.innerHTML = '';
    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
            <h3>${country.name.common}</h3>
            <button onclick="toggleFavorite('${country.name.common}')">
                ${favorites.includes(country.name.common) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        `;
        countriesContainer.appendChild(card);
    });
}

function handleSearch() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(query)
    );
    renderCountries(filteredCountries);
    renderSuggestions(filteredCountries);
}

function renderSuggestions(countries) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    countries.slice(0, 5).forEach(country => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion-item');
        suggestion.textContent = country.name.common;
        suggestion.onclick = () => {
            document.getElementById('search').value = country.name.common;
            renderCountries([country]);
            suggestionsContainer.innerHTML = '';
        };
        suggestionsContainer.appendChild(suggestion);
    });
}

function toggleFavorite(countryName) {
    const index = favorites.indexOf(countryName);
    if (index === -1 && favorites.length < 5) {
        favorites.push(countryName);
    } else if (index !== -1) {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderCountries(countries);
    renderFavorites();
}

function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    favorites.forEach(favorite => {
        const item = document.createElement('li');
        item.textContent = favorite;
        favoritesList.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const suggestionsBox = document.getElementById("suggestions");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();

        if (query.length > 0) {
            showSuggestions(query);
        } else {
            suggestionsBox.innerHTML = "";
            suggestionsBox.style.display = "none";
        }
    });

    function showSuggestions(query) {
        suggestionsBox.style.display = "block";
        suggestionsBox.innerHTML = `
            <div class="suggestion-item">${query}</div>
        `;

        document.querySelectorAll(".suggestion-item").forEach(item => {
            item.addEventListener("click", () => {
                searchInput.value = item.textContent;
                suggestionsBox.style.display = "none";
            });
        });
    }
});


function renderCountries(countries) {
    const countriesContainer = document.getElementById('countries');
    countriesContainer.innerHTML = '';
    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
            <h3>${country.name.common}</h3>
            <div class="button-group">
                <button class="add" onclick="toggleFavorite('${country.name.common}')">
                    ${favorites.includes(country.name.common) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.common)}" target="_blank" class="learn-more">
                    Read More
                </a>
            </div>
        `;
        countriesContainer.appendChild(card);
    });
}



