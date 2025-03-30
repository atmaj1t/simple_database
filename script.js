// Get DOM elements
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');
const passwordStrength = document.getElementById('password-strength');
const rememberMe = document.getElementById('remember-me');
const spinner = document.querySelector('.spinner');

// API URL - Update this with your deployed server URL
const API_URL = 'https://simpledatabasemongodb.netlify.app/api/auth';  // Updated with your Netlify URL

// Check for saved credentials
document.addEventListener('DOMContentLoaded', () => {
  const savedUsername = localStorage.getItem('username');
  const savedPassword = localStorage.getItem('password');
  const savedRememberMe = localStorage.getItem('rememberMe');

  if (savedRememberMe === 'true' && savedUsername && savedPassword) {
    document.getElementById('username').value = savedUsername;
    passwordInput.value = savedPassword;
    rememberMe.checked = true;
  }
});

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.classList.toggle('fa-eye');
  togglePassword.classList.toggle('fa-eye-slash');
});

// Password strength checker
passwordInput.addEventListener('input', () => {
  const password = passwordInput.value;
  const strength = checkPasswordStrength(password);
  
  passwordStrength.className = 'password-strength';
  if (password.length > 0) {
    passwordStrength.classList.add(strength);
  }
});

function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;

  if (strength <= 1) return 'weak';
  if (strength <= 2) return 'medium';
  return 'strong';
}

// Handle form submission
loginForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = passwordInput.value;

  // Show loading spinner
  spinner.style.display = 'block';
  document.querySelector('.btn-login span').style.opacity = '0';

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Handle remember me
    if (rememberMe.checked) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('rememberMe');
    }

    // Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Show success message
    errorMessage.style.visibility = 'visible';
    errorMessage.style.color = '#28a745';
    errorMessage.textContent = 'Login successful! Redirecting...';
    
    // Redirect after successful login
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } catch (error) {
    errorMessage.style.visibility = 'visible';
    errorMessage.style.color = '#dc3545';
    errorMessage.textContent = error.message;
  } finally {
    // Hide loading spinner
    spinner.style.display = 'none';
    document.querySelector('.btn-login span').style.opacity = '1';
  }
});

// Handle forgot password link
document.querySelector('.forgot-password').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Password recovery functionality would be implemented here');
});

// Handle sign up link
document.getElementById('signup-link').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'register.html';
});