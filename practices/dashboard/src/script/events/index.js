import { generateUsersTable } from '../templates/renderListUsers';
import { getUserFromLocalStorage } from '../mocks/listUsers';
import { generateModalUser } from '../templates/generateModalUser';
import { validateUserForm } from '../validate/index';
import { showFormErrors } from '../templates/showFormErrors';
import {
  isStringMatched,
  debounce,
  handlePhoneNumberInput,
} from '../utils/index';
import {
  formattedDate,
  startLoadingSpinner,
  delayActions,
  DISPLAY_CLASS,
  PROFILE_USER,
} from '../constants/index';
import {
  searchInput,
  searchButton,
  listUsers,
  deleteModal,
  confirmDeleteButton,
  cancelDeleteButton,
  closeDeleteModalButton,
  btnAddUser,
  modalElement,
} from '../dom/index';

const { FIRST_NAME, LAST_NAME, EMAIL, PHONE, ROLE_TYPE } = PROFILE_USER;

export const eventLoader = () => {
  /**
   * Handle the feature for search users
   * Handle the search when users the search button is pressed
   */
  searchButton.addEventListener('click', () => {
    performSearchWithSpinner();
  });

  // Handle searches as the user types and presses Enter with debounce
  const debouncedSearch = debounce('performSearch', 300); // Debounce timeout is 300 ms

  searchInput.addEventListener('input', () => {
    debouncedSearch();
  });

  const performSearchWithSpinner = () => {
    // Show the loading spinner when performing the search
    startLoadingSpinner();

    // Perform the search
    performSearch();
  };

  const performSearch = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Search in the list users
    const searchResults = getUserFromLocalStorage.filter((user) => {
      const { lastName, firstName, email, phone } = user;
      const nameMatch = isStringMatched(`${firstName} ${lastName}`, searchTerm);
      const emailMatch = isStringMatched(email, searchTerm);
      const phoneMatch = isStringMatched(phone, searchTerm);
      return nameMatch || emailMatch || phoneMatch;
    });

    // // Use the delayActions function to perform actions after the delay
    delayActions(() => {
      generateUsersTable(searchResults);
    });
  };

  // Handle searches as the user types and presses Enter
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      // Perform a search immediately when the user presses Enter
      performSearchWithSpinner();
    }
  });

  /**
   * Handle the Delete User event
   */
  let userDelete;

  listUsers.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.btn-delete');
    const userId = parseInt(deleteButton.getAttribute('data-id'));

    // Get user information to delete
    userDelete = getUserFromLocalStorage.find((user) => user.id === userId);

    // Display modal
    showDeleteModal();
  });

  // Handle the event when the user clicks "Yes"
  confirmDeleteButton.addEventListener('click', () => {
    // Close the modal
    hideDeleteModal();

    // Show the loading spinner when the user confirms the deletion
    startLoadingSpinner();

    // // Use the delayActions function to perform actions after the delay
    delayActions(() => {
      const userIndex = getUserFromLocalStorage.findIndex(
        (user) => user.id === userDelete.id,
      );

      if (userIndex !== -1) {
        getUserFromLocalStorage.splice(userIndex, 1);
        localStorage.setItem(
          'listUsers',
          JSON.stringify(getUserFromLocalStorage),
        );
        generateUsersTable(getUserFromLocalStorage);
      }
    });
  });

  // Handle the event when the user presses "No" or closes the modal
  cancelDeleteButton.addEventListener('click', () => {
    // Close the modal
    hideDeleteModal();
  });

  // Handle the event when the user presses the "Close" button
  closeDeleteModalButton.addEventListener('click', () => {
    // Close the modal
    hideDeleteModal();
  });

  // Use the click event to catch when the user clicks on the gray background around the modal
  window.addEventListener('click', (event) => {
    if (event.target === deleteModal) {
      hideDeleteModal();
    }

    if (event.target === modalElement) {
      modalElement.style.display = DISPLAY_CLASS.HIDDEN;
    }
  });

  // Modal Delete
  const showDeleteModal = () => {
    deleteModal.style.display = DISPLAY_CLASS.FLEX;
  };

  const hideDeleteModal = () => {
    deleteModal.style.display = DISPLAY_CLASS.HIDDEN;
  };

  /**
   * Handle add new users for list users
   * Click button add user show modal add user
   */
  btnAddUser.addEventListener('click', () => {
    const modalElement = document.getElementById('modal');
    modalElement.style.display = DISPLAY_CLASS.FLEX;
    modalElement.innerHTML = generateModalUser();

    const addUserSubmitButton = document.getElementById('add-user-submit');
    const formUsers = document.getElementById('user-form');
    const addUserCancelButton = document.getElementById('add-user-cancel');
    const btnCloseModal = document.getElementById('close-modal-user');
    const firstNameInput = formUsers.querySelector(FIRST_NAME);
    const lastNameInput = formUsers.querySelector(LAST_NAME);
    const emailInput = formUsers.querySelector(EMAIL);
    const phoneInput = formUsers.querySelector(PHONE);
    const roleInput = formUsers.querySelector(ROLE_TYPE);

    // Handle the event of not being able to enter text into the phone number input
    phoneInput.addEventListener('input', handlePhoneNumberInput);

    addUserCancelButton.addEventListener('click', () => {
      modalElement.style.display = DISPLAY_CLASS.HIDDEN;
    });

    addUserSubmitButton.addEventListener('click', () => {
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const role = roleInput.options[roleInput.selectedIndex].value;

      const errors = validateUserForm({
        firstName,
        lastName,
        email,
        phone,
        role,
      });

      if (Object.entries(errors).length > 0) {
        showFormErrors(errors);
      } else {
        // Show loading spinner
        startLoadingSpinner();

        const userLength = getUserFromLocalStorage.length;

        // Calculate the new user ID based on the last user's ID
        const currentUserId =
          userLength > 0 ? getUserFromLocalStorage[userLength - 1].id + 1 : 1;

        const newUser = {
          id: currentUserId,
          firstName,
          lastName,
          email,
          phone,
          role,
          roleId: role.includes('Admin') ? 'admin' : 'employee',
          date: formattedDate,
        };

        // Add user to list users
        getUserFromLocalStorage.push(newUser);

        // Update user list in Local Storage
        localStorage.setItem(
          'listUsers',
          JSON.stringify(getUserFromLocalStorage),
        );

        // Close modal
        modalElement.style.display = DISPLAY_CLASS.HIDDEN;

        // // Use the delayActions function to perform actions after the delay
        delayActions(() => {
          generateUsersTable(getUserFromLocalStorage);
        });
      }
    });

    // Handle Button Close Modal User
    btnCloseModal.addEventListener('click', () => {
      modalElement.style.display = DISPLAY_CLASS.HIDDEN;
    });
  });

  /**
   * Handle the feature for edit user
   * Click button add user show modal edit user
   */
  listUsers.addEventListener('click', (event) => {
    const editButton = event.target.closest('.btn-edit');

    if (editButton) {
      // Get user ID from data-id attribute
      const userId = parseInt(editButton.getAttribute('data-id'));

      // Get the user to edit from Local Storage by user ID
      const editedUser = getUserFromLocalStorage.find(
        (user) => user.id === userId,
      );

      if (editedUser) {
        // Show the edit user modal with the user's data
        const modalElement = document.getElementById('modal');

        // Pass 'Edit User' as the title
        modalElement.innerHTML = generateModalUser(editedUser, 'Edit User');

        // Set the data-user-id attribute to store the user ID
        modalElement.setAttribute('data-user-id', userId);
        modalElement.style.display = DISPLAY_CLASS.FLEX;

        const editUserSubmitButton = document.getElementById('add-user-submit');
        const editUserCancelButton = document.getElementById('add-user-cancel');
        const formUsers = document.getElementById('user-form');
        const btnCloseModal = document.getElementById('close-modal-user');

        // Once you have the phone number field (editedPhone), assign a value and handle the "input" for it
        const editedPhoneInput = formUsers.querySelector(PHONE);

        // Assign the phone number value to the phone number field
        editedPhoneInput.value = editedUser.phone;

        // Handle the event of not being able to enter text into the phone number input
        editedPhoneInput.addEventListener('input', handlePhoneNumberInput);

        // Handles button cancel edit user
        editUserCancelButton.addEventListener('click', () => {
          modalElement.style.display = DISPLAY_CLASS.HIDDEN;
        });

        // Handles button submit edit user
        editUserSubmitButton.addEventListener('click', () => {
          const editedFirstName = formUsers
            .querySelector(FIRST_NAME)
            .value.trim();
          const editedLastName = formUsers
            .querySelector(LAST_NAME)
            .value.trim();
          const editedEmail = formUsers.querySelector(EMAIL).value.trim();
          const editedPhone = formUsers.querySelector(PHONE).value.trim();
          const editedRole = formUsers.querySelector(ROLE_TYPE).value;

          const errors = validateUserForm({
            firstName: editedFirstName,
            lastName: editedLastName,
            email: editedEmail,
            phone: editedPhone,
            role: editedRole,
          });

          if (Object.entries(errors).length > 0) {
            showFormErrors(errors);
          } else {
            // Show loading spinner
            startLoadingSpinner();

            editedUser.firstName = editedFirstName;
            editedUser.lastName = editedLastName;
            editedUser.email = editedEmail;
            editedUser.phone = editedPhone;
            editedUser.role = editedRole;
            editedUser.roleId = editedRole.includes('Admin')
              ? 'admin'
              : 'employee';

            const updatedUsers = getUserFromLocalStorage.map((user) => {
              if (user.id === editedUser.id) {
                return editedUser;
              }

              return user;
            });

            localStorage.setItem('listUsers', JSON.stringify(updatedUsers));
            modalElement.style.display = DISPLAY_CLASS.HIDDEN;

            // Use the delayActions function to perform actions after the delay
            delayActions(() => {
              generateUsersTable(updatedUsers);
            }, 300);
          }
        });

        // Handle Button Close Modal User
        btnCloseModal.addEventListener('click', () => {
          modalElement.style.display = DISPLAY_CLASS.HIDDEN;
        });
      }
    }
  });
};