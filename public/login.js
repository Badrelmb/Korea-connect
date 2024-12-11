import supabase from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (!loginForm) {
    console.error("Login form not found. Check your HTML structure.");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Collect user input
    const email = document.getElementById("email").value; // Using email as username
    const password = document.getElementById("password").value;

    try {
      // Step 1: Attempt login using email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login failed:", error.message);
        alert("Login failed. Please check your credentials and try again.");
        return;
      }

      console.log("Login successful:", data);

      // Step 2: Store the session token and redirect
      alert(`Welcome back, ${email}!`);
      localStorage.setItem("supabase_token", data.session.access_token); // Save token for session persistence
      window.location.href = "my_event.html"; // Redirect to the events page
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  });
});
