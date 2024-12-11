import supabase from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Extract the event ID from the URL query string
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    console.error("No event ID found in the URL.");
    return;
  }

  try {
    // Fetch the event details from the database
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error || !event) {
      console.error("Error fetching event details:", error || "Event not found");
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
      <p class="event-details">Date: ${new Date(event.event_date).toLocaleDateString()}</p>
      <p class="event-details">Time: ${event.event_time.slice(0, 5)} </p>
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
    console.error("Unexpected error fetching event details:", err);
  }
});

async function joinEvent(eventId) {
  const { user } = await supabase.auth.getSession();

  if (!user) {
    alert("Please log in to join the event.");
    window.location.href = "login.html";
    return;
  }

  const userId = user.id;

  const { data, error } = await supabase
    .from("eventsJoined")
    .insert([{ event_id: eventId, user_id: userId }]);

  if (error) {
    console.error("Error joining event:", error);
    alert("An error occurred while joining the event.");
    return;
  }

  alert("Successfully joined the event!");
}
