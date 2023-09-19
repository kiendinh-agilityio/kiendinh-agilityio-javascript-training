const LIST_USERS = [
  {
    id: 1,
    firstName: 'David',
    lastName: 'Wagner',
    role: 'Super Admin',
    email: 'david_wagner@example.com',
    date: '24 Otc, 2015',
    phone: '2052055555',
    roleId: 'admin'
  },
  {
    id: 2,
    firstName: 'Ina',
    lastName: 'Hogan',
    role: 'Admin',
    email: 'windler.warren@runte.net',
    date: '24 Otc, 2015',
    phone: '2052055555',
    roleId: 'admin'
  },
  {
    id: 3,
    firstName: 'Devin',
    lastName: 'Harmon',
    role: 'HR Admin',
    email: 'wintheiser_enos@yahoo.com',
    date: '18 Dec, 2015',
    phone: '2052055555',
    roleId: 'admin'
  },
  {
    id: 4,
    firstName: 'Lena',
    lastName: 'Page',
    role: 'Employee',
    email: 'camila_ledner@gmail.com',
    date: '8 Otc, 2016',
    phone: '2052055555',
    roleId: 'employee'
  },
  {
    id: 5,
    firstName: 'Eula',
    lastName: 'Horton',
    role: 'Super Admin',
    email: 'edula_dorton1221@gmail.com',
    date: '15 Jun, 2017',
    phone: '2052055555',
    roleId: 'admin'
  },
  {
    id: 6,
    firstName: 'Victoria',
    lastName: 'Perez',
    role: 'HR Admin',
    email: 'terrill.wiza@hotmail.com',
    date: '12 Jan, 2019',
    phone: '2052055555',
    roleId: 'admin'
  },
  {
    id: 7,
    firstName: 'Cora',
    lastName: 'Medina',
    role: 'Employee',
    email: 'hagenes.isai@hotmail.com',
    date: '21 July, 2020',
    phone: '2052055555',
    roleId: 'employee'
  }
]

/*
 * Save list users to local storage
*/
localStorage.setItem('listUsers', JSON.stringify(LIST_USERS))

/**
 * Get user from local storage
 */
const getUserFromLocalStorage = JSON.parse(localStorage.getItem('listUsers')) || []

export { getUserFromLocalStorage }
