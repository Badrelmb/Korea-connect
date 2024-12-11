import { getSessionUser } from './session.js';

document.addEventListener("DOMContentLoaded", async function () {
  const user = await getSessionUser(); // Fetch user data from the session
  console.log("Fetched user:", user);
  if (user) {
    // Update the user name in the header
    const profileNameElement = document.getElementById("user-name");
    profileNameElement.textContent = user.username; // Assuming "username" is the property

    // Optionally, update the profile initial (e.g., the first letter of the username)
    const profileInitElement = document.querySelector(".profile-init a");
    profileInitElement.textContent = user.username.charAt(0).toUpperCase();
  } else {
    // If no user is logged in, redirect to login page
     console.warn("No user data found. Redirecting to login page...");
    // window.location.href = "login.html";
  }
});



window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('sticky');  // Add 'sticky' class after scrolling
  } else {
    header.classList.remove('sticky');  // Remove 'sticky' class if back at the top
  }
});


window.onscroll = function() {
    var header = document.getElementById("header");
    if (window.pageYOffset > 0) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
};
document.getElementById('kakaoLogin').addEventListener('click', function() {
  // Implement KakaoTalk login logic here
  alert('KakaoTalk login feature to be implemented!');
});

// Handle profile form submission
document.getElementById('profile-form')?.addEventListener('submit', function(event) {
  event.preventDefault();
  // Save user profile logic here
  alert('Profile updated!');
});

// Handle event creation
document.getElementById('event-form')?.addEventListener('submit', function(event) {
  event.preventDefault();
  // Create event logic here
  alert('Event created!');
});

// Handle sending messages
document.getElementById('send-message')?.addEventListener('click', function() {
  const message = document.getElementById('message').value;
  if (message) {
      const chatWindow = document.getElementById('chat-window');
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      chatWindow.appendChild(messageElement);
      document.getElementById('message').value = '';
  }
});

