document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  const userIdField = document.getElementById('userId');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageDiv = document.getElementById('message');
  const usersTableBody = document.getElementById('usersTableBody');

  const apiUrl = 'http://localhost:3000/users';

  userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userId = userIdField.value;
      const name = nameField.value;
      const email = emailField.value;

      if (userId) {
          // Update user
          await fetch(`${apiUrl}/${userId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email })
          });
          messageDiv.textContent = 'User updated successfully';
      } else {
          // Create user
          await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email })
          });
          messageDiv.textContent = 'User created successfully';
      }

      userForm.reset();
      userIdField.value = '';
      loadUsers();
  });

  async function loadUsers() {
      const response = await fetch(apiUrl);
      const users = await response.json();
      usersTableBody.innerHTML = '';
      users.forEach(user => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td class="actions">
                  <button class="edit" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}">Edit</button>
                  <button class="delete" data-id="${user.id}">Delete</button>
              </td>
          `;
          usersTableBody.appendChild(tr);
      });

      document.querySelectorAll('.edit').forEach(button => {
          button.addEventListener('click', (e) => {
              const { id, name, email } = e.target.dataset;
              userIdField.value = id;
              nameField.value = name;
              emailField.value = email;
          });
      });

      document.querySelectorAll('.delete').forEach(button => {
          button.addEventListener('click', async (e) => {
              const { id } = e.target.dataset;
              await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
              messageDiv.textContent = 'User deleted successfully';
              loadUsers();
          });
      });
  }

  loadUsers();
});
