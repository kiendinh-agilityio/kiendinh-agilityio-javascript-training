import { defaultFurniture } from './furniture-data.js';
import { createElement } from './template';
import {
  getFavoriteFurnitureFromLocalStorage,
  setFavoriteFurnitureToLocalStorage,
} from './helper.js';
import { handleAddEventListenerNavMenu } from './navbar.js';

const btnFavoriteList = document.querySelector('.btn-list-favorites');
const domFurniture = document.querySelector('.furniture-list');
const favoritesList = document.querySelector('.favorites-list');
const modalClose = document.querySelector('.btn-close-modal');
let favoriteItems = getFavoriteFurnitureFromLocalStorage();

const renderListFurnitures = (items) => {
  domFurniture.innerHTML = '';
  items.forEach((furniture) => {
    domFurniture.insertAdjacentHTML('beforeend', createElement(furniture));
  });
};

const loadData = () => {
  //format data local vs default
  const formatData = defaultFurniture.map(item => {
    const findFavorite = favoriteItems.indexOf(item.id);
    if (findFavorite >= 0) {
      return {
        ...item,
        isFavorite: true
      };
    };
    return {
      ...item
    };
  });
  renderListFurnitures(formatData);
};

const filterFavoriteItems = (favoriteItemsTemp) => {
  return defaultFurniture
    .reduce((favoriteValue, currentValue) => {
      const findFavorite = favoriteItemsTemp.indexOf(currentValue.id);
      if (findFavorite >= 0) favoriteValue.push(currentValue);
      return favoriteValue;
    }, [])
    .map(item => {
      return {
        ...item,
        isFavorite: true
      };
    });
};

// Favorites Modal
const handleShowFavoritesList = () => {
  btnFavoriteList.addEventListener('click', () => {
    const showModal = document.getElementById('Favorite-modal');
    showModal.classList.add('modal-open');
    const favoriteItemsTemp = getFavoriteFurnitureFromLocalStorage();
    renderListFavoriteFurniture(filterFavoriteItems(favoriteItemsTemp));
    removeFavorite(favoriteItems);
  });
};

const handleCloseFavoritesList = () => {
  modalClose.addEventListener('click', () => {
    const showModal = document.getElementById('Favorite-modal');
    showModal.classList.remove('modal-open');
  });
};

// list favorites
const renderListFavoriteFurniture = (filterFavoriteList) => {
  while (favoritesList.hasChildNodes()) {
    favoritesList.removeChild(favoritesList.firstChild);
  };
  const listFavorite = filterFavoriteList;
  listFavorite.forEach((furniture) => {
    favoritesList.insertAdjacentHTML('beforeend', createElement(furniture));
  });
};

// Add furniture item to list favorites
// User click button favorite
// Listen click favorite button event => addEventListener ('click')
const btnAddFavoriteFunc = (btn) => {
  if (btn.classList.contains('btn-add-favorite')) {
    changeIcon(btn);
    const favoriteId = btn.parentElement.parentElement.getAttribute('data-id');
    favoriteItems.push(favoriteId);
    setFavoriteFurnitureToLocalStorage(favoriteItems);
  } else {
    btnRemoveFunc(btn);
  };
};

const addFavorite = () => {
  const btnAddFavorite = document.querySelectorAll('.btn-favorite');
  btnAddFavorite.forEach(btn => {
    btn.onclick = function () {
      btnAddFavoriteFunc(btn);
    };
  });
};

// Change icon-favorite with icon-trash
const changeIcon = (node, type = 'add') => {
  let typeObj = {};
  if (type === 'add') {
    typeObj = {
      classNameIcon: '.icon-favorite',
      img: '<img class="icon-trash" src="https://i.imgur.com/m4xuLMv.png" alt="Trash">',
      addClassName: 'btn-remove-favorite',
      removeClassName: 'btn-add-favorite'
    };
  } else {
    typeObj = {
      classNameIcon: '.icon-trash',
      img: '<img class="icon-favorite" src="https://i.imgur.com/UnnmWMl.png" alt="Favorite">',
      addClassName: 'btn-add-favorite',
      removeClassName: 'btn-remove-favorite'
    };
  };
  node.removeChild(node.querySelector(typeObj.classNameIcon));
  node.insertAdjacentHTML('beforeend', typeObj.img);
  node.classList.add(typeObj.addClassName);
  node.classList.remove(typeObj.removeClassName);
};

// Remove furniture item from favorites list
const btnRemoveFunc = (btn) => {
  if (confirm("Are you sure you want to remove it from favorites list?")) {
    const parentElement = btn.parentElement.parentElement;
    const checkParentList = parentElement.parentElement;
    const favoriteId = parentElement.getAttribute('data-id');
    favoriteItems = favoriteItems.filter(item => item !== favoriteId);
    setFavoriteFurnitureToLocalStorage(favoriteItems);
    if (checkParentList.classList.contains('favorites-list')) {
      parentElement.remove();
      const selectedFurniture = document.querySelector(`[data-id='${favoriteId}'] button`);
      changeIcon(selectedFurniture, 'remove');
    } else {
      changeIcon(btn, 'remove');
    };
  };
};

const removeFavorite = (favoriteItems) => {
  const btnRemoveFavorite = document.querySelectorAll('.favorites-list .btn-remove-favorite');
  btnRemoveFavorite.forEach(btn => {
    btn.addEventListener('click', () => {
      btnRemoveFunc(btn, favoriteItems);
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  loadData();
  // Add favorite
  addFavorite();
  // Favorites modal
  handleShowFavoritesList();
  handleCloseFavoritesList();
  // Navigation bar
  handleAddEventListenerNavMenu();
});
