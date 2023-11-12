import {
  generateModalAds,
  toggleDropdown,
  formatLimitedPhoneNumberInput,
  StrimmingString,
  validateAdsForm,
  showFormErrors,
} from '../utils/index';
import { DISPLAY_CLASS, TITLE_MODAL, MESSAGE, PROFILE_ADS, ELEMENT_ID } from '../constants/index';
import { generateListAds } from '../templates/generateAdsList';
import { adsSearchElement } from '../dom/index';

export class AdsView {
  constructor() {
    this.initElementsAds();
    this.initEventListenersAds();
    this.initializeSearchInput();
    this.deleteHandler = null; // Track the delete handler
    this.addAdsHandler = null;
  }

  /**
   * Initializes the DOM elements used by AdsView.
   */
  initElementsAds() {
    this.modalAds = document.getElementById('modal');
    this.btnAdd = document.getElementById('btn-add');
    this.btnLogout = document.querySelector('.btn-logout');
    this.tableElement = document.getElementById('list-ads');
    this.searchButton = adsSearchElement.querySelector('#search-button');
    this.searchInput = adsSearchElement.querySelector('#search-input');
    this.btnClearSearch = adsSearchElement.querySelector('#btn-clear-search');
    this.deleteModal = document.getElementById('delete-modal');
    this.confirmDeleteButton = this.deleteModal.querySelector('#confirm-delete');
    this.cancelDeleteButton = this.deleteModal.querySelector('#cancel-delete');
    this.closeDeleteModalButton = this.deleteModal.querySelector('#close-modal');
  }

  /**
   * Initializes event listeners for AdsView.
   */
  initEventListenersAds() {
    this.btnAdd.addEventListener('click', this.showAdsModal.bind(this));
    this.modalAds.addEventListener('click', (event) => {
      if (event.target === this.modalAds) {
        this.closeModalHandler();
      }
    });

    // Clear search button click
    this.btnClearSearch.addEventListener('click', this.clearSearchHandler.bind(this));

    // Add click event to handle delete button clicks
    this.tableElement.addEventListener('click', (event) => {
      const deleteButton = event.target.closest('.dropdown-content button:last-child');

      if (deleteButton) {
        // data-id button "Delete"
        const adsId = parseInt(deleteButton.getAttribute('data-id'));

        // Show modal or perform other actions based on adsId
        this.showDeleteModal(adsId);
        this.bindDeleteAdsHandler(adsId);
      }
    });

    // Add event for confirm delete button
    this.confirmDeleteButton.addEventListener('click', () => {
      const adsId = parseInt(this.confirmDeleteButton.getAttribute('data-id'));
      this.hideDeleteModal();
      this.deleteHandler(adsId);
    });

    // Add event for cancel delete
    this.cancelDeleteButton.addEventListener('click', () => {
      this.hideDeleteModal();
    });

    // Add event for button close modal confirm
    this.closeDeleteModalButton.addEventListener('click', () => {
      this.hideDeleteModal();
    });

    this.deleteModal.addEventListener('click', (event) => {
      if (event.target === this.deleteModal) {
        this.hideDeleteModal();
      }
    });

    // Add event button add
    this.btnAdd.addEventListener('click', () => {
      this.showAdsModal(null);
    });
  }

  /**
   * Initializes the search input and handles its events.
   */
  initializeSearchInput() {
    this.searchInput.addEventListener('input', () => {
      const inputValue = this.searchInput.value.trim();
      this.btnClearSearch.style.display = inputValue ? DISPLAY_CLASS.FLEX : DISPLAY_CLASS.HIDDEN;
    });
  }

  /**
   * Displays the Ads modal with the provided adsData.
   * If adsData is provided, it sets the modal title to 'Edit', otherwise 'Add'.
   * Sets up event listeners for the modal buttons and form inputs.
   * @param {Object} adsData - The data of the ad to be displayed in the modal.
   */
  showAdsModal(adsData) {
    // Determine the title based on the presence of adsData
    const title = adsData ? TITLE_MODAL.EDIT : TITLE_MODAL.ADD;

    // Generate the modal content using adsData and the determined title
    const modalContent = generateModalAds(adsData, title);

    // Set the modal's HTML content and display it
    this.modalAds.innerHTML = modalContent;
    this.modalAds.style.display = DISPLAY_CLASS.FLEX;

    // Get references to the close button, cancel button, submit button, and the ads form
    const closeBtn = this.modalAds.querySelector(ELEMENT_ID.CLOSE_MODAL_ADS);
    const cancelBtn = this.modalAds.querySelector(ELEMENT_ID.BTN_CANCEL);
    const submitBtn = this.modalAds.querySelector(ELEMENT_ID.BTN_SUBMIT);
    const formAds = this.modalAds.querySelector(ELEMENT_ID.FORM_ADS);

    // Add event listeners for close button and cancel button clicks
    closeBtn.addEventListener('click', this.closeModalHandler.bind(this));
    cancelBtn.addEventListener('click', this.closeModalHandler.bind(this));

    // Handle the event of formatting phone number input
    const phoneInput = formAds.querySelector(PROFILE_ADS.PHONE);
    phoneInput.addEventListener('input', formatLimitedPhoneNumberInput);

    // Handle the event of submitting the form
    submitBtn.addEventListener('click', async () => {
      // Extract values from the form inputs
      const network = StrimmingString(formAds.querySelector(PROFILE_ADS.NETWORK).value);
      const link = StrimmingString(formAds.querySelector(PROFILE_ADS.LINK).value);
      const email = StrimmingString(formAds.querySelector(PROFILE_ADS.EMAIL).value);
      const phone = StrimmingString(phoneInput.value);
      const status = formAds.querySelector(PROFILE_ADS.STATUS_TYPE).value;

      // Create an adsItem object with the extracted values
      const adsItem = {
        network,
        link,
        email,
        phone,
        status,
      };

      // Clear previous errors
      this.clearErrorMessageForm();

      // Validate the adsItem and show errors if any
      const errors = validateAdsForm(adsItem);
      if (Object.entries(errors).length > 0) {
        showFormErrors(errors);
      } else {
        // If no errors, invoke the addAdsHandler and close the modal
        await this.addAdsHandler(adsItem);

        this.closeModalHandler();
      }
    });
  }

  /**
   * Binds the handler for adding new ads.
   * @param {Function} handler - The handler function for adding ads.
   */
  bindAddAds(handler) {
    this.addAdsHandler = handler;
  }

  /**
   * Closes the modal.
   */
  closeModalHandler() {
    this.modalAds.style.display = DISPLAY_CLASS.HIDDEN;
  }

  /**
   * Sets a handler for the logout button.
   * @param {Function} handler - The handler function for the logout button.
   */
  setLogoutHandler(handler) {
    this.btnLogout.addEventListener('click', handler);
  }

  /**
   * Handles the case when no search results are found.
   */
  handleSearchNoResult() {
    this.tableElement.innerHTML = `<p class="search-result-message">${MESSAGE.NO_RESULT}</p>`;
  }

  /**
   * Clears the search input.
   */
  clearSearchHandler() {
    this.searchInput.value = '';
    this.btnClearSearch.style.display = DISPLAY_CLASS.HIDDEN;
    this.displayAdsList(this.adsData);
  }

  /**
   * Displays the list of ads in the table.
   * @param {Array} adsData - The list of ads to be displayed.
   */
  displayAdsList(adsData) {
    const adsListHTML = generateListAds(adsData);
    this.tableElement.innerHTML = adsListHTML;

    // Dropdown buttons
    const dropdownButtons = this.tableElement.querySelectorAll('.btn-dropdown');
    const dropdownContents = this.tableElement.querySelectorAll('.dropdown-content');

    const closeDropdowns = (event) => {
      const isInsideDropdown = Array.from(dropdownContents).some(content => content.contains(event.target));

      if (!isInsideDropdown) {
        dropdownContents.forEach((content) => {
          content.style.display = DISPLAY_CLASS.HIDDEN;
        });
      }
    };

    dropdownButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = event.target.getAttribute('data-id');

        // Find the corresponding dropdown content
        const dropdownContent = this.tableElement.querySelector(`.dropdown-content[data-id="${id}`);

        // Hide other dropdown contents
        closeDropdowns(event);

        // Toggle the selected dropdown content
        toggleDropdown(dropdownContent);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', closeDropdowns);
  }

  /**
   * Binds the delete user handler to the confirmation modal buttons.
   * @param {number} adsId - The ID of the ad to be deleted.
   */
  bindDeleteAdsHandler(adsId) {
    this.confirmDeleteButton.setAttribute('data-id', adsId);
    this.showDeleteModal();
  }

  /**
   * Binds the delete user handler to the table element.
   * @param {Function} handler - The handler function for deleting an ad.
   */
  bindDeleteAds(handler) {
    this.deleteHandler = handler;
  }

  /**
   * Displays the delete modal.
   */
  showDeleteModal() {
    this.deleteModal.style.display = DISPLAY_CLASS.FLEX;
  }

  /**
   * Hides the delete modal.
   */
  hideDeleteModal() {
    this.deleteModal.style.display = DISPLAY_CLASS.HIDDEN;
  }

  /**
   * Clear Error Message for Form
   */
  clearErrorMessageForm() {
    const errorFields = ['network', 'link', 'email', 'phone', 'status'];

    errorFields.forEach(field => {
      const errorElement = this.modalAds.querySelector(`#${field}-error`);
      errorElement.textContent = '';
    });
  }
};
