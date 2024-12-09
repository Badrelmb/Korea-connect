// Initialize Supabase client
const supabase = supabase.createClient(
  "YOUR_SUPABASE_PROJECT_URL", // Replace with your Supabase Project URL
  "YOUR_SUPABASE_ANON_KEY" // Replace with your Supabase Anon Key
);

document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Collect user input
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // Step 1: Find the email for the given username
      const { data: user, error: findError } = await supabase
        .from("users")
        .select("email")
        .eq("username", username)
        .single(); // Fetch only one result

      if (findError) {
        alert(`Login failed: ${findError.message}`);
        return;
      }

      if (!user) {
        alert("No user found with that username.");
        return;
      }

      const email = user.email;

      // Step 2: Attempt login using the email and password
      const { user: loggedInUser, session, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

      if (loginError) {
        alert(`Login failed: ${loginError.message}`);
        return;
      }

      // Step 3: Store the session token and redirect
      alert(`Welcome, ${loggedInUser.email}!`);
      localStorage.setItem("supabase_token", session.access_token); // Save token for session persistence
      window.location.href = "my_event.html"; // Redirect to the events page
    } catch (err) {
      console.error("Error logging in:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  });
