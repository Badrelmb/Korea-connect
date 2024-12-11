import supabase from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
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

    const user = session.user;
    console.log("Logged-in user:", user);

    // Commented out displayUserProfile for now
    // displayUserProfile(user);

    // Fetch and display events
    const events = await fetchEvents();
    console.log("Fetched events:", events); // Check fetched events
    displayEvents(events); // Temporarily render all events without filtering

    // Commenting out filtersChanged listener for debugging
    /*
    document.addEventListener("filtersChanged", (e) => {
      const { selectedCity, selectedCategory, selectedDate } = e.detail;
      console.log("Filters received in my_event.js:", {
        selectedCity,
        selectedCategory,
        selectedDate,
      });

      const filteredEvents = filterEvents(events, selectedCity, selectedCategory, selectedDate);
      displayEvents(filteredEvents);
    });
    */

    // Handle Logout Button
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

    // Handle Create Event Button
    const createEventButton = document.getElementById("create-event-btn");
    if (createEventButton) {
      createEventButton.addEventListener("click", () => {
        window.location.href = "event_create.html";
      });
    }
  } catch (err) {
    console.error("Error during page load:", err);
  }
});

// Fetch events from the database
async function fetchEvents() {
  try {
    const { data: events, error } = await supabase.from("events").select("*");
    console.log("Fetched events from DB:", events); // Log fetched events
    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }
    return events;
  } catch (error) {
    console.error("Unexpected error fetching events:", error);
    return [];
  }
}

// Display events
function displayEvents(events) {
  const eventsSection = document.querySelector(".events-section .row");
  console.log("Events section:", eventsSection); // Log DOM section
  eventsSection.innerHTML = ""; // Clear existing events

  if (!events || events.length === 0) {
    console.log("No events to display.");
    eventsSection.innerHTML = "<p>No events found.</p>";
    return;
  }

  events.forEach((event) => {
    console.log("Rendering event:", event); // Log each event
    const eventCard = `
      <div class="col-md-4">
        <div class="card mb-4" style="width: 100%">
          <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text event-details">
              <span><strong>${new Date(event.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
              <span><strong>Location:</strong> ${event.location}</span>
              <span><strong>Category:</strong> ${event.category}</span>
            </p>
            <p class="card-description">${event.description}</p>
            <a
              href="event_view.html?id=${event.id}"
              class="btn btn-primary"
            >
              Event available | 신청가능
            </a>
          </div>
        </div>
      </div>
    `;
    eventsSection.insertAdjacentHTML("beforeend", eventCard);
  });
}

// Filter events based on criteria
function filterEvents(events, selectedCity, selectedCategory, selectedDate) {
  const filteredEvents = events.filter((event) => {
    const matchesCity = selectedCity === "모든" || event.location === selectedCity;
    const matchesCategory = selectedCategory === "모든" || event.category === selectedCategory;
    const matchesDate =
      !selectedDate || new Date(event.event_date).toDateString() === new Date(selectedDate).toDateString();

    return matchesCity && matchesCategory && matchesDate;
  });

  console.log("Filtered events:", filteredEvents); // Log filtered events
  return filteredEvents;
}
