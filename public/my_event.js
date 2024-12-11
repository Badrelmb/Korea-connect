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

  // Initialize dropdown defaults and fetch events
  setDropdownDefaults();
  fetchAndDisplayEvents();
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

// Redirect to event creation page
document.getElementById("create-event-btn").addEventListener("click", function () {
  window.location.href = "event_create.html";
});

// Set default values for dropdowns
function setDropdownDefaults() {
  // Set default value for the location dropdown
  const regionButton = document.getElementById("region-btn");
  if (regionButton) {
    regionButton.innerHTML = `모든 <span class="dropdown-icon">▼</span>`;
  }

  // Set default value for the category dropdown
  const categoryButton = document.getElementById("category-btn");
  if (categoryButton) {
    categoryButton.innerHTML = `모든 <span class="dropdown-icon">▼</span>`;
  }
}

// Fetch and display events
async function fetchAndDisplayEvents() {
  try {
    const { data: events, error } = await supabase.from("events").select("*");

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    const eventsSection = document.querySelector(".events-section .row");
    eventsSection.innerHTML = ""; // Clear any existing events

    // Render events
    events.forEach((event) => {
      const eventCard = `
        <div class="col-md-4">
          <div class="card mb-4">
            <img src="${event.event_photo}" class="card-img-top" alt="Event Image" />
            <div class="card-body">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-text">${event.description}</p>
              <div class="event-details">
                <span><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</span>
                <span><strong>Location:</strong> ${event.location}</span>
              </div>
              <a href="event_view.html" class="btn btn-primary">Learn More</a>
            </div>
          </div>
        </div>
      `;
      eventsSection.insertAdjacentHTML("beforeend", eventCard);
    });

    // Attach filtering functionality
    attachFilters(events);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// Attach filtering functionality
function attachFilters(events) {
  const regionButton = document.getElementById("region-btn");
  const categoryButton = document.getElementById("category-btn");
  const regionMenuItems = document.querySelectorAll("#region-menu li");
  const categoryMenuItems = document.querySelectorAll("#category-menu li");

  regionMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      regionButton.innerHTML = `${item.textContent} <span class="dropdown-icon">▼</span>`;
      filterEvents(events);
    });
  });

  categoryMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      categoryButton.innerHTML = `${item.textContent} <span class="dropdown-icon">▼</span>`;
      filterEvents(events);
    });
  });
}

// Filter events based on dropdown selections
function filterEvents(events) {
  const selectedRegion = document.getElementById("region-btn").textContent.trim().replace("▼", "");
  const selectedCategory = document.getElementById("category-btn").textContent.trim().replace("▼", "");

  const filteredEvents = events.filter((event) => {
    const matchesRegion = selectedRegion === "모든" || event.location === selectedRegion;
    const matchesCategory = selectedCategory === "모든" || event.category === selectedCategory;

    return matchesRegion && matchesCategory;
  });

  // Render filtered events
  const eventsSection = document.querySelector(".events-section .row");
  eventsSection.innerHTML = ""; // Clear current events

  filteredEvents.forEach((event) => {
    const eventCard = `
      <div class="col-md-4">
        <div class="card mb-4">
          <img src="${event.event_photo}" class="card-img-top" alt="Event Image" />
          <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text">${event.description}</p>
            <div class="event-details">
              <span><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</span>
              <span><strong>Location:</strong> ${event.location}</span>
            </div>
            <a href="event_view.html" class="btn btn-primary">Learn More</a>
          </div>
        </div>
      </div>
    `;
    eventsSection.insertAdjacentHTML("beforeend", eventCard);
  });
}
