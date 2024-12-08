// session.js

// Function to fetch the current logged-in user's data
async function getSessionUser() {
  try {
    console.log("Attempting to fetch user data...");
    const response = await fetch("https://korea-connect.onrender.com/user", {
      method: "GET",
      credentials: "include", // Ensures cookies are sent
    });

    console.log("Fetch response:", response); // Log the full response

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Return null if the session does not exist
  }
}

// Export the function so it can be imported elsewhere
export { getSessionUser };
