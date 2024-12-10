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

async function displayUserProfile(user) {
  const bucketUrl = "https://djwbuyirbqrduukiprqg.supabase.co/storage/v1/object/public/image-upload/";
  
  // Get profile photo from user metadata
  const photoPath = user.user_metadata?.profile_photo;

  // Get the profile photo element in the DOM
  const profilePhotoImg = document.getElementById("profile-photo-img");

  if (photoPath) {
    // Display the user's profile photo
    profilePhotoImg.src = `${bucketUrl}${photoPath}`;
  } else {
    // Display the default profile photo
    profilePhotoImg.src = "./KOREA-CONNECT IMG/default-photo.jpg";
  }
}

// Handle photo upload
document.getElementById("profile-photo-upload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const user = supabase.auth.user();
  if (!user) {
    alert("You must be logged in to upload a photo.");
    return;
  }

  // Create a unique file path for the user's photo
  const filePath = `profile_photos/${user.id}/${file.name}`;

  try {
    // Upload the photo to the bucket
    const { error: uploadError } = await supabase.storage
      .from("image-upload")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading photo:", uploadError.message);
      alert("Failed to upload photo. Please try again.");
      return;
    }

    // Update user's metadata with the photo path
    const { error: updateError } = await supabase.auth.updateUser({
      data: { profile_photo: filePath },
    });

    if (updateError) {
      console.error("Error updating user metadata:", updateError.message);
      alert("Failed to save photo. Please try again.");
      return;
    }

    // Display the uploaded photo
    const profilePhotoImg = document.getElementById("profile-photo-img");
    profilePhotoImg.src = `${bucketUrl}${filePath}`;
    alert("Photo uploaded successfully!");
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
});

// Handle logout
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
