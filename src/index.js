import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast/dist/js/iziToast.min.js';

const selectors = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
};

function showLoader() {
  updateLoaderVisibility(true);
}

function hideLoader() {
  updateLoaderVisibility(false);
}

function showError(message) {
  iziToast.error({
    title: 'Error',
    message: message,
    position: 'topRight',
  });
}

function hideCatInfo() {
  selectors.catInfo.innerHTML = '';
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
    showError('No breed information available for this cat.');
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
