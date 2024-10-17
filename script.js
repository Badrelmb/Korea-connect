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
