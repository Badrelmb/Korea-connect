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

  const user = session.user;
  console.log("Logged-in user:", user);

  displayUserProfile(user);

  // Fetch and display events initially
  const events = await fetchEvents();
  displayEvents(events);

  // Listen for filter changes from the dropdown script
  document.addEventListener("filtersChanged", (e) => {
    const { selectedCity, selectedCategory, selectedDate } = e.detail;
    const filteredEvents = filterEvents(events, selectedCity, selectedCategory, selectedDate);
    displayEvents(filteredEvents);
  });
});

// Fetch events from the database
async function fetchEvents() {
  try {
    const { data: events, error } = await supabase.from("events").select("*");

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
  eventsSection.innerHTML = ""; // Clear existing events

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
}

// Filter events based on criteria
function filterEvents(events, selectedCity, selectedCategory, selectedDate) {
  return events.filter((event) => {
    const matchesCity = selectedCity === "모든" || event.location === selectedCity;
    const matchesCategory = selectedCategory === "모든" || event.category === selectedCategory;
    const matchesDate =
      !selectedDate || new Date(event.event_date).toDateString() === new Date(selectedDate).toDateString();

    return matchesCity && matchesCategory && matchesDate;
  });
}
