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

    // Fetch and display events initially
    const events = await fetchEvents();
    console.log("Fetched events:", events);
    displayEvents(events);

    // Initialize dropdowns and handle filtering
    initializeDropdowns(events);

    // Initialize date navigation and date-based filtering
    initializeDateNavigation(events);

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
    console.log("Fetched events from DB:", events); // Check the fetched events
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
  console.log("Rendering events:", events); // Log events being rendered
  const eventsSection = document.querySelector(".events-section .row");
  eventsSection.innerHTML = ""; // Clear existing events

  events.forEach((event) => {
    const eventCard = `
  <div class="col-md-4">
    <div class="card mb-4" style="width: 100%">
      <div class="card-body">
        <h5 class="card-title">${event.title}</h5>
        <p class="event-details">Date: ${new Date(event.event_date).toLocaleDateString()}</p>
  <p class="event-details">Time: ${event.event_time.slice(0, 5)} (24-hour format)</p>
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

// Initialize dropdowns and handle filtering
function initializeDropdowns(events) {
  const regionBtn = document.getElementById("region-btn");
  const regionMenu = document.getElementById("region-menu");
  const categoryBtn = document.getElementById("category-btn");
  const categoryMenu = document.getElementById("category-menu");

  let selectedCity = "모든";
  let selectedCategory = "모든";

  // Toggle dropdown visibility
  regionBtn.addEventListener("click", () => {
    regionMenu.style.display = regionMenu.style.display === "block" ? "none" : "block";
  });

  categoryBtn.addEventListener("click", () => {
    categoryMenu.style.display = categoryMenu.style.display === "block" ? "none" : "block";
  });

  // Hide dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!regionBtn.contains(e.target) && !regionMenu.contains(e.target)) {
      regionMenu.style.display = "none";
    }
    if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
      categoryMenu.style.display = "none";
    }
  });

  // Update selected city
  regionMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      selectedCity = e.target.textContent;
      regionBtn.innerHTML = `${selectedCity} <span class="dropdown-icon">▼</span>`;
      regionMenu.style.display = "none";
      applyFilters(events, selectedCity, selectedCategory);
    }
  });

  // Update selected category
  categoryMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      selectedCategory = e.target.textContent;
      categoryBtn.innerHTML = `${selectedCategory} <span class="dropdown-icon">▼</span>`;
      categoryMenu.style.display = "none";
      applyFilters(events, selectedCity, selectedCategory);
    }
  });
}

// Initialize date navigation
function initializeDateNavigation(events) {
  const dateContainer = document.querySelector(".dates");
  const prevButton = document.querySelector(".prev-date");
  const nextButton = document.querySelector(".next-date");

  const today = new Date();
  let currentDate = new Date();
  const weekLength = 7;
  let selectedDate = today.toISOString().split("T")[0];

  function renderDates() {
    dateContainer.innerHTML = "";

    const startDate = new Date(currentDate);
    for (let i = 0; i < weekLength; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayName = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
      const dateText = date.toISOString().split("T")[0];

      const dateElement = document.createElement("div");
      dateElement.className = `date ${date.getDay() === 0 || date.getDay() === 6 ? "weekend" : "weekday"}`;
      dateElement.setAttribute("data-date", dateText);
      dateElement.innerHTML = `
        <span>${date.getDate()}</span>
        <span>${dayName}</span>
      `;

      if (dateText === selectedDate) {
        dateElement.classList.add("selected");
      }

      dateElement.addEventListener("click", () => {
        selectedDate = dateText;
        document.querySelectorAll(".date").forEach(el => el.classList.remove("selected"));
        dateElement.classList.add("selected");
        applyFilters(events, "모든", "모든", selectedDate);
      });

      dateContainer.appendChild(dateElement);
    }
  }

  prevButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - weekLength);
    renderDates();
  });

  nextButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + weekLength);
    renderDates();
  });

  renderDates();
}

// Apply filters and display filtered events
function applyFilters(events, selectedCity, selectedCategory, selectedDate = null) {
  const filteredEvents = events.filter((event) => {
    const matchesCity = selectedCity === "모든" || event.location === selectedCity;
    const matchesCategory = selectedCategory === "모든" || event.category === selectedCategory;
    const matchesDate =
      !selectedDate || new Date(event.event_date).toDateString() === new Date(selectedDate).toDateString();

    return matchesCity && matchesCategory && matchesDate;
  });

  console.log("Filtered events:", filteredEvents);
  displayEvents(filteredEvents);
}
