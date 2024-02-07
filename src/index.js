import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const selectors = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

selectors.select.addEventListener('change', event => {
  const selectedBreedId = event.target.value;
  if (selectedBreedId) {
    selectors.loader.style.display = 'block';
    selectors.catInfo.innerHTML = '';

    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        displayCatInfo(catData);
        selectors.loader.style.display = 'none';
      })
      .catch(error => {
        selectors.error.style.display = 'block';
        selectors.loader.style.display = 'none';
        updateBreedDescription('Error fetching cat data. Please try again.');
        console.error('Error fetching cat data:', error);
      });
  }
});

function updateBreedDescription(description) {
  const descriptionElement = document.querySelector('.breed-description');
  if (descriptionElement) {
    descriptionElement.textContent = description || 'No description available';
  }
}

function displayCatInfo(catData) {
  if (catData && catData.breeds && catData.breeds.length > 0) {
    const breed = catData.breeds[0];
    selectors.catInfo.innerHTML = `
      <img src="${catData.url}" alt="Cat Image" width=500>
      <h2>${breed.name}</h2>
      <p>${breed.description}</p>
      <p><strong>Temperament:</strong> ${breed.temperament}</p>
    `;
  } else {
    selectors.catInfo.innerHTML =
      '<p>No breed information available for this cat.</p>';
  }
}

window.addEventListener('load', () => {
  selectors.loader.style.display = 'block';
  selectors.catInfo.innerHTML = '';

  fetchBreeds()
    .then(breeds => {
      populateBreedsSelect(breeds);
      selectors.loader.style.display = 'none';
      selectors.error.style.display = 'none';
    })
    .catch(error => {
      selectors.error.style.display = 'block';
      selectors.loader.style.display = 'none';
      console.error('Error fetching breeds:', error);
    });
});

function populateBreedsSelect(breeds) {
  const options = breeds.map(
    breed => `<option value="${breed.id}">${breed.name}</option>`
  );
  selectors.select.innerHTML = options.join('');
}
