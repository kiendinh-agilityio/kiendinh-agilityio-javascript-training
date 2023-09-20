export const generateModalUser = (user) => {
  const {
    id,
    firstName,
    lastName,
    email,
    phone,
    role
  } = user || {}
  return `
    <div class="modal-content">
      <div class="modal-header flex-row justify-between items-center">
        <h2 class="modal-heading">${!id ? 'Add User' : 'Edit User'}</h2>
      </div>
      <div class="flex-column form-modal">
        <div class="flex-column">
          <input
            id="first-name"
            class="form-input"
            type="text"
            placeholder="First Name *"
            value="${firstName || ''}"
          />
          <div id="add-user-error" class="error-message"></div>
        </div>
        <div class="flex-column">
          <input
            id="last-name"
            class="form-input"
            type="text"
            placeholder="Last Name *"
            value="${lastName || ''}"
          />
          <div id="add-user-error" class="error-message"></div>
        </div>
        <div class="flex-column">
          <input
            id="email"
            class="form-input"
            type="email"
            placeholder="Email ID *"
            value="${email || ''}"
          />
          <div id="add-user-error" class="error-message"></div>
        </div>
        <div class="d-flex justify-between form-group">
          <div class="phone-number-input flex-column">
            <input
              id="phone-number"
              class="form-input"
              placeholder="Mobile No"
              type="text"
              value="${phone || ''}"
            />
            <div id="add-user-error" class="error-message"></div>
          </div>
          <div class="form-select flex-column">
            <select id="role-type" name="role" class="form-input-select">
              <option value="0">Select Role Type</option>
              <option value="Super Admin" ${role === 'Admin' ? 'selected' : ''}>Super Admin</option>
              <option value="Admin" ${role === 'Admin' ? 'selected' : ''}>Admin</option>
              <option value="HR Admin" ${role === 'Admin' ? 'selected' : ''}>HR Admin</option>
              <option value="Employee" ${role === 'Employee' ? 'selected' : ''}>Employee</option>
            </select>
            <div id="add-user-error" class="error-message"></div>
          </div>
        </div>
        <div class="d-flex justify-end btn-group">
          <button class="btn btn-submit" id="add-user-submit">
            Add User
          </button>
          <button id="add-user-cancel" class="btn-close-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `
}
