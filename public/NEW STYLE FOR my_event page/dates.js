document.addEventListener("DOMContentLoaded", () => {
  const dateContainer = document.querySelector(".dates");
  const prevButton = document.querySelector(".prev-date");
  const nextButton = document.querySelector(".next-date");

  const today = new Date(); // Today's date
  let currentDate = new Date(); // Start date for the current week
  const weekLength = 7; // Number of days in a week
  let selectedDate = today.toISOString().split("T")[0]; // Default to today's date

  function renderDates() {
    dateContainer.innerHTML = ""; // Clear existing dates

    const startDate = new Date(currentDate); // Start date for the week
    for (let i = 0; i < weekLength; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayName = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
      const dateText = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      const dateElement = document.createElement("div");
      dateElement.className = `date ${date.getDay() === 0 || date.getDay() === 6 ? "weekend" : "weekday"}`;
      dateElement.setAttribute("data-date", dateText);
      dateElement.innerHTML = `
        <span>${date.getDate()}</span>
        <span>${dayName}</span>
      `;

      // Automatically select today's date
      if (dateText === selectedDate) {
        dateElement.classList.add("selected");
      }

      // Add click event listener to each date
      dateElement.addEventListener("click", () => {
        selectedDate = dateText;

        // Remove 'selected' class from all dates
        document.querySelectorAll(".date").forEach(el => el.classList.remove("selected"));

        // Add 'selected' class to clicked date
        dateElement.classList.add("selected");

        // Trigger event rendering
        document.dispatchEvent(new CustomEvent("dateChanged", { detail: { selectedDate } }));
      });

      dateContainer.appendChild(dateElement);
    }

    // Trigger events for the selected date
    document.dispatchEvent(new CustomEvent("dateChanged", { detail: { selectedDate } }));
  }

  // Navigation buttons
  prevButton.addEventListener("click", () => {
    const nextWeekStart = new Date(currentDate);
    nextWeekStart.setDate(currentDate.getDate() - weekLength);

    // Only navigate if the next week does not start before today
    if (nextWeekStart >= today) {
      currentDate.setDate(currentDate.getDate() - weekLength);
      renderDates();
    }
  });

  nextButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + weekLength);
    renderDates();
  });

  // Initial render
  renderDates();
});
