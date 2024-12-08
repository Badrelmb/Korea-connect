document.addEventListener("DOMContentLoaded", () => {
  const regionBtn = document.getElementById("region-btn");
  const regionMenu = document.getElementById("region-menu");
  const categoryBtn = document.getElementById("category-btn");
  const categoryMenu = document.getElementById("category-menu");

  let selectedCity = "모든";
  let selectedCategory = "모든";
  let selectedDate = null;

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
      document.dispatchEvent(new CustomEvent("filtersChanged", { detail: { selectedCity, selectedCategory, selectedDate } }));
    }
  });

  // Update selected category
  categoryMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      selectedCategory = e.target.textContent;
      categoryBtn.innerHTML = `${selectedCategory} <span class="dropdown-icon">▼</span>`;
      categoryMenu.style.display = "none";
      document.dispatchEvent(new CustomEvent("filtersChanged", { detail: { selectedCity, selectedCategory, selectedDate } }));
    }
  });

  // Listen for date changes to update `selectedDate`
  document.addEventListener("dateChanged", (e) => {
    selectedDate = e.detail.selectedDate;
    document.dispatchEvent(new CustomEvent("filtersChanged", { detail: { selectedCity, selectedCategory, selectedDate } }));
  });
});
