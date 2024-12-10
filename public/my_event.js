import supabase from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Step 1: Check if the user is logged in
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return;
  }

  if (!session) {
    // No user session found, redirect to login
    window.location.href = "login.html";
    return;
  }

  // User is logged in, proceed with fetching and displaying user data
  const user = session.user;

  console.log("Logged-in user:", user);

  // Load the user's profile
  displayUserProfile(user);

  // Set up logout button functionality
  setupLogoutButton();
});

async function displayUserProfile(user) {
  // Get profile photo from user metadata
  const photoPath = user.user_metadata?.profile_photo;

  // Get the profile photo element in the DOM
  const profilePhotoImg = document.getElementById("profile-photo-img");

  if (photoPath) {
    // Display the user's profile photo
    profilePhotoImg.src = `https://your-supabase-bucket-url/${photoPath}`;
  } else {
    // Display the default profile photo
    profilePhotoImg.src = "default-photo.png";
  }
}

function setupLogoutButton() {
  const logoutButton = document.querySelector(".logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        window.location.href = "login.html";
      }
    });
  }
}
