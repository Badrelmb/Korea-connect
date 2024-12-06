// session.js

// Function to fetch the current logged-in user's data
async function getSessionUser() {
  try {
    const response = await fetch("https://korea-connect.onrender.com/user"); // Adjust this URL based on your backend
    if (response.status === 200) {
      return await response.json(); // Return the user object if logged in
    } else {
      console.warn("User not logged in");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
}

// Export the function so it can be imported elsewhere
export { getSessionUser };
