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
    window.location.href = "login.html";
  }
});



const textArray = [
  "Join exciting events.",
  "Connect with locals and expats.",
  "Create lasting memories."
];
let typingSpeed = 100; // Speed of typing
let erasingSpeed = 50; // Speed of erasing
let delayBetweenTexts = 1000; // Delay before next text starts
let textIndex = 0;
let charIndex = 0;

const typingTextElement = document.querySelector(".typing-text");
const cursorElement = document.querySelector(".cursor");

function type() {
  if (charIndex < textArray[textIndex].length) {
    typingTextElement.textContent += textArray[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(erase, delayBetweenTexts);
  }
}

function erase() {
  if (charIndex > 0) {
    typingTextElement.textContent = textArray[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingSpeed);
  } else {
    textIndex++;
    if (textIndex >= textArray.length) textIndex = 0;
    setTimeout(type, typingSpeed);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(type, delayBetweenTexts);
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

