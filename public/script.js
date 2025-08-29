const API_BASE_URL = 'http://localhost:3000';

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.text(); // Get the response text
        
        if (response.ok) {
            showMessage('User registered successfully!', 'success');
            // Clear the form
            document.getElementById('registerForm').reset();
            // Reload the users list
            loadUsers();
        } else {
            showMessage('Error: ' + data, 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
});

// Function to load and display users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = ''; // Clear previous list
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>No users found.</p>';
            return;
        }
        
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <strong>ID:</strong> ${user.id} 
                | <strong>Username:</strong> ${user.username}
                | <strong>Email:</strong> ${user.email}
            `;
            usersList.appendChild(userElement);
        });
    } catch (error) {
        showMessage('Error loading users: ' + error.message, 'error');
    }
}

// Function to show messages
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

// Load users when page loads
document.addEventListener('DOMContentLoaded', loadUsers);