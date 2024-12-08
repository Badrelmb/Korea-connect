// session.js

// Function to fetch the current logged-in user's data
async function getSessionUser() {
  try {
    const response = await fetch("https://korea-connect.onrender.com/user", {
      method: "GET",
      credentials: true , // Ensures cookies are sent
    });
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
