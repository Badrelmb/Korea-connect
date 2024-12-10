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

  // Call the next function to load the user's profile
  displayUserProfile(user);
});

// Function to display user profile photo
async function displayUserProfile(user) {
  // Get profile photo from user metadata
  const photoPath = user.user_metadata?.profile_photo;

  // Get the profile photo element in the DOM
  const profilePhotoImg = document.getElementById("profile-photo-img");

  if (photoPath) {
    // Display the user's profile photo
    profilePhotoImg.src = `https://YOUR_SUPABASE_STORAGE_URL/${photoPath}`;
  } else {
    // Display the default profile photo
    profilePhotoImg.src = "default-photo.png";
  }
}

// Handle logout functionality
document.addEventListener("DOMContentLoaded", function () {
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
});

// Handle profile photo upload
document.addEventListener("DOMContentLoaded", function () {
  const profilePhotoInput = document.getElementById("profile-photo-input");
  const profilePhotoImg = document.getElementById("profile-photo-img");

  profilePhotoInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Upload photo to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(`profile-${Date.now()}-${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError.message);
      alert("Failed to upload photo. Please try again.");
      return;
    }

    // Update user's metadata with the photo path
    const photoPath = uploadData.path;
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { profile_photo: photoPath },
    });

    if (metadataError) {
      console.error("Error updating metadata:", metadataError.message);
      alert("Failed to save photo. Please try again.");
      return;
    }

    // Display the uploaded photo
    profilePhotoImg.src = `https://YOUR_SUPABASE_STORAGE_URL/${photoPath}`;
    alert("Profile photo updated successfully!");
  });
});
