// Sticky header functionality
window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header?.classList.add('sticky');  // Add 'sticky' class after scrolling
  } else {
    header?.classList.remove('sticky');  // Remove 'sticky' class if back at the top
  }
});

// Handle KakaoTalk login
const kakaoLoginButton = document.getElementById('kakaoLogin');
if (kakaoLoginButton) {
  kakaoLoginButton.addEventListener('click', function() {
    alert('KakaoTalk login feature to be implemented!');
  });
}