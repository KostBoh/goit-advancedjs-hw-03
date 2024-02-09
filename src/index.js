import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const selectors = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

function showLoader() {
  updateLoaderVisibility(true);
}

function hideLoader() {
  updateLoaderVisibility(false);
}

function showError(message) {
  selectors.error.textContent = message;
  selectors.error.classList.add('visible');
}

function hideError() {
  selectors.error.textContent = '';
  selectors.error.classList.remove('visible');
}

function hideCatInfo() {
  selectors.catInfo.innerHTML = '';
}

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

function updateLoaderVisibility(show) {
  if (show) {
    selectors.loader.classList.add('visible');
  } else {
    selectors.loader.classList.remove('visible');
  }
}

selectors.select.addEventListener('change', event => {
  const selectedBreedId = event.target.value;
  if (selectedBreedId) {
    hideCatInfo();
    showLoader();

    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        displayCatInfo(catData);
        hideLoader();
      })
      .catch(error => {
        showError('Error fetching cat data. Please try again.');
        hideLoader();
        console.error('Error fetching cat data:', error);
      });
  }
});

window.addEventListener('load', () => {
  hideCatInfo();
  hideError();
  showLoader();

  fetchBreeds()
    .then(breeds => {
      populateBreedsSelect(breeds);
      hideLoader();
    })
    .catch(error => {
      showError('Error fetching breeds. Please try again.');
      hideLoader();
      console.error('Error fetching breeds:', error);
    });
});

function populateBreedsSelect(breeds) {
  const options = breeds.map(
    breed => `<option value="${breed.id}">${breed.name}</option>`
  );
  selectors.select.innerHTML = options.join('');
}
