const apiUrl = 'https://restcountries.com/v3.1/all';
let countries = [];
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
    document.getElementById('search').addEventListener('input', handleSearch);
    document.getElementById('region-filter').addEventListener('change', applyFilters);
    document.getElementById('language-filter').addEventListener('change', applyFilters);
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

function handleSearch() {
    applyFilters();
}

function applyFilters() {
    const query = document.getElementById('search').value.toLowerCase();
    const selectedRegion = document.getElementById('region-filter').value;
    const selectedLanguage = document.getElementById('language-filter').value;

    const filteredCountries = countries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(query);
        const matchesRegion = selectedRegion ? country.region === selectedRegion : true;
        const matchesLanguage = selectedLanguage
            ? country.languages && Object.values(country.languages).includes(selectedLanguage)
            : true;

        return matchesSearch && matchesRegion && matchesLanguage;
    });

    renderCountries(filteredCountries);
    renderSuggestions(filteredCountries);
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
            <div class="button-group">
                <button class="add" onclick="toggleFavorite('${country.name.common}')">
                    ${favorites.includes(country.name.common) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}
                </button>
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.common)}" target="_blank" class="learn-more">
                    Show More
                </a>
            </div>
        `;
        countriesContainer.appendChild(card);
    });
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
        item.innerHTML = `
            ${favorite}
            <button onclick="toggleFavorite('${favorite}')" class="remove-favorite"><i class="fa-solid fa-xmark"></i></button>
        `;
        favoritesList.appendChild(item);
    });
}





