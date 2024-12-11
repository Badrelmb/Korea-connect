import supabase from "./supabaseClient.js";

// Define translations for English and Korean
const translations = {
  en: {
    "Create Your Event": "Create Your Event",
    "Event Title": "Event Title",
    "Hobby Category": "Hobby Category",
    "Event Location": "Event Location",
    "Max Participants": "Max Participants",
    "Event Description": "Event Description",
    "Create Event": "Create Event",
    "스포츠": "Sports",
    "음악": "Music",
    "미술": "Art",
    "요리": "Cooking",
    "여행": "Travel",
    "언어 교환": "Language Exchange",
  },
  kr: {
    "Create Your Event": "이벤트 만들기",
    "Event Title": "이벤트 제목",
    "Hobby Category": "취미 카테고리",
    "Event Location": "이벤트 위치",
    "Max Participants": "최대 참여 인원",
    "Event Description": "이벤트 설명",
    "Create Event": "이벤트 만들기",
    "스포츠": "스포츠",
    "음악": "음악",
    "미술": "미술",
    "요리": "요리",
    "여행": "여행",
    "언어 교환": "언어 교환",
  },
};


// Set default language (English)
let currentLanguage = "en";

// Function to toggle between languages
function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "kr" : "en"; // Switch language

  // Update text on page
  document.querySelectorAll("[data-text]").forEach((element) => {
    const key = element.getAttribute("data-text");
    if (translations[currentLanguage][key]) {
      element.innerText = translations[currentLanguage][key];
    }
  });

  // Change language toggle button text
  const toggleButton = document.getElementById("language-toggle");
  toggleButton.innerText =
    currentLanguage === "en" ? "EN | KR" : "KR | EN";
}

// Add event listener to language toggle button
document
  .getElementById("language-toggle")
  .addEventListener("click", toggleLanguage);

// Event creation logic
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (!form) {
    console.error("Event creation form not found!");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const title = formData.get("title");
    const eventPhoto = formData.get("eventPhoto"); // File input
    const category = formData.get("category");
    const eventDate = formData.get("eventDate");
    const eventTime = formData.get("eventTime");
    const location = formData.get("location");
    const participantsLimit = parseInt(formData.get("participants_limit"), 10);
    const description = formData.get("description");

    try {
      // Upload the event photo to Supabase storage
      const photoFileName = `${Date.now()}-${eventPhoto.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("image-upload") // Replace with your bucket name
        .upload(`events/${photoFileName}`, eventPhoto);

      if (uploadError) {
        console.error("Error uploading event photo:", uploadError.message);
        alert("Failed to upload event photo. Please try again.");
        return;
      }

      // Get the public URL for the uploaded photo
      const { data: publicUrlData } = supabase.storage
        .from("image-upload")
        .getPublicUrl(`events/${photoFileName}`);
      const eventPhotoUrl = publicUrlData.publicUrl;

      // Insert the event into the database
      const { error: insertError } = await supabase.from("events").insert({
        title,
        event_photo: eventPhotoUrl,
        category,
        event_date: eventDate,
        event_time: eventTime,
        location,
        participants_limit: participantsLimit,
        description,
      });

      if (insertError) {
        console.error("Error creating event:", insertError.message);
        alert("Failed to create the event. Please try again.");
        return;
      }

      alert("Event created successfully!");
      window.location.href = "my_event.html"; // Redirect to the events page
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });
});
