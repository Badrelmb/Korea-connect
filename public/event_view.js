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
      alert("Please log in to access this page.");
      window.location.href = "login.html";
      return;
    }

    const user = session.user;
    console.log("Logged-in user:", user);

    // Extract the event ID from the URL query string
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    if (!eventId) {
      console.error("No event ID found in the URL.");
      return;
    }

    // Fetch the event details from the database
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (fetchError || !event) {
      console.error(
        "Error fetching event details:",
        fetchError || "Event not found"
      );
      return;
    }

    // Generate HTML content for the event
    const eventHTML = `
      <img
        src="${event.event_photo || "default-placeholder-image.png"}"
        alt="Event Photo"
        style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;"
      />
      <h1>${event.title}</h1>
      <p class="event-details">Date: ${new Date(
        event.event_date
      ).toLocaleDateString()}</p>
      <p class="event-details">Time: ${event.event_time.slice(0, 5)}</p>
      <p class="event-details">${event.description}</p>
      <p class="event-details">Location: ${event.location}</p>
      <button
          class="btn btn-primary"
          onclick="joinEvent(${event.id})"
        >
          Join
        </button>
    `;

    // Inject the HTML content into the event-container div
    const eventContainer = document.querySelector(".event-container");
    eventContainer.innerHTML = eventHTML;
  } catch (err) {
    console.error("Unexpected error during page load:", err);
  }
});

async function joinEvent(eventId) {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      alert("Please log in to join the event.");
      window.location.href = "login.html";
      return;
    }

    const userId = session.auth.user.id;

    // Insert the event-user relationship into the eventsJoined table
    const { data, error: insertError } = await supabase
      .from("eventsJoined")
      .insert([{ event_id: eventId, user_id: userId }]);

    if (insertError) {
      console.error("Error joining event:", insertError);
      alert("An error occurred while joining the event.");
      return;
    }

    // Display alert and redirect to my_event.html
    alert("Event joined successfully!");
    window.location.href = "my_event.html";
  } catch (error) {
    console.error("Unexpected error while joining the event:", error);
    alert("An unexpected error occurred. Please try again.");
  }
}

// Expose joinEvent to the window object for the button's onclick
window.joinEvent = joinEvent;
