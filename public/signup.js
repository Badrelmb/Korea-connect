import supabase from "./supabaseClient.js";

const form = document.querySelector("form");
if (!form) {
  console.error("Form not found. Check your HTML structure.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  // Validate password and confirm password
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Step 1: Sign up the user with Supabase Auth
    const { data: user, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Error signing up user:", authError.message);
      alert(authError.message);
      return;
    }

    console.log("User signed up:", user);

    // Step 2: Redirect or show success message
    alert("Signup successful! You can now log in.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
});
