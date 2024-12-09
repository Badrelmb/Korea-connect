// Initialize Supabase client
const supabase = supabase.createClient(
  "https://djwbuyirbqrduukiprqg.supabase.co", // Replace with your Supabase Project URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqd2J1eWlyYnFyZHV1a2lwcnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3Nzc5NTgsImV4cCI6MjA0ODM1Mzk1OH0.KUPmEXfXNCoS2ZRNnuBrZ-Y1YCR5tX5rk5BgVTguhiE" // Replace with your Supabase Anon Key
);

const form = document.querySelector("form");
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
