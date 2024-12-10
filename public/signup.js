
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

    // Step 2: Store additional user information in the 'users' table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert({
        username: formData.get("username"),
        email: email,
        phone: formData.get("phone"),
        country_code: formData.get("country-code"),
        nationality: formData.get("nationality"),
      });

    if (profileError) {
      console.error("Error saving user profile:", profileError.message);
      alert("Signup failed while saving user profile.");
      return;
    }

    console.log("User profile saved:", profile);

    // Step 3: Redirect or show success message
    alert("Signup successful! You can now log in.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
});
