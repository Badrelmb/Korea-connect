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
  console.log("Fetched events:", events);
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
console.log("Fetched events:", events);

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
  const eventsSection = document.getElementById("events-list");
  eventsSection.innerHTML = ""; // Clear existing events

  events.forEach((event) => {
    const eventCard = `
      <div class="card mb-4" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text event-details">
            <span><strong>${new Date(event.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
            <span><strong>Location:</strong> ${event.location}</span>
            <span><strong>Category:</strong> ${event.category}</span>
          </p>
          <p class="card-description">${event.description}</p>
          <a href="event_view.html?id=${event.id}" class="btn btn-primary">신청가능</a>
        </div>
      </div>
    `;
    console.log("Rendering card:", eventCard); // Log each card
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
