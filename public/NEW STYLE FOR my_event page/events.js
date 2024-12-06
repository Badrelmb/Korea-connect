document.addEventListener("DOMContentLoaded", () => {
 const events = [
    // Events for 2024-12-06
    { date: "2024-12-06", time: "12:30", location: "잠실고교풋살스타디움 3구장", city: "서울", category: "스포츠", info: "Beginner-level soccer match. Equipment provided.", status: "open" },
    { date: "2024-12-06", time: "14:00", location: "홍대 카페 '아트 스페이스'", city: "서울", category: "미술", info: "Painting workshop with a professional instructor. All materials included.", status: "open" },
    { date: "2024-12-06", time: "18:00", location: "강남 요가 센터", city: "서울", category: "요가", info: "Evening yoga session for stress relief. Bring your own mat.", status: "open" },
    { date: "2024-12-06", time: "20:00", location: "신촌 보드게임 카페", city: "서울", category: "게임", info: "Board game night. Snacks and drinks included.", status: "open" },
    { date: "2024-12-06", time: "21:00", location: "이태원 재즈 바", city: "서울", category: "음악", info: "Jazz night at a cozy bar. Live music performance.", status: "open" },

    // Events for 2024-12-07
    { date: "2024-12-07", time: "10:00", location: "이태원 쿠킹 스튜디오", city: "서울", category: "요리", info: "Korean cooking class. Learn to make kimchi and bibimbap.", status: "open" },
    { date: "2024-12-07", time: "15:00", location: "서울숲", city: "서울", category: "사진", info: "Photography meetup. Explore the park and capture stunning shots.", status: "open" },
    { date: "2024-12-07", time: "17:00", location: "압구정 카페", city: "서울", category: "음료", info: "Coffee brewing workshop. Learn the art of making pour-over coffee.", status: "open" },
    { date: "2024-12-07", time: "19:00", location: "홍대 라이브 클럽", city: "서울", category: "음악", info: "Live music night featuring indie bands. Tickets included.", status: "open" },
    { date: "2024-12-07", time: "21:00", location: "강동구 스포츠 센터", city: "서울", category: "스포츠", info: "Badminton doubles game. Equipment provided.", status: "open" },

    // Events for 2024-12-08
    { date: "2024-12-08", time: "09:00", location: "북한산 등산 코스", city: "서울", category: "등산", info: "Beginner-friendly hiking trip. Guide and snacks provided.", status: "open" },
    { date: "2024-12-08", time: "11:00", location: "광화문 역사 박물관", city: "서울", category: "역사", info: "Historical tour of the museum with an expert guide.", status: "open" },
    { date: "2024-12-08", time: "15:00", location: "성수동 공방", city: "서울", category: "미술", info: "Pottery-making class. Take home your handmade creation.", status: "open" },
    { date: "2024-12-08", time: "17:00", location: "코엑스 스타필드 도서관", city: "서울", category: "책", info: "Book discussion: 'Pachinko' by Min Jin Lee. Free participation.", status: "open" },
    { date: "2024-12-08", time: "19:30", location: "동대문 디자인 플라자", city: "서울", category: "패션", info: "Fashion show featuring local designers. Free entry.", status: "open" },

    // Events for 2024-12-09
    { date: "2024-12-09", time: "13:00", location: "신촌 댄스 스튜디오", city: "서울", category: "댄스", info: "K-pop dance class for beginners. Comfortable clothes required.", status: "open" },
    { date: "2024-12-09", time: "14:30", location: "마포구 클라이밍 센터", city: "서울", category: "스포츠", info: "Indoor rock climbing session for beginners. Safety gear provided.", status: "open" },
    { date: "2024-12-09", time: "16:00", location: "강동구 농구장", city: "서울", category: "스포츠", info: "Casual basketball game. Open to all skill levels.", status: "open" },
    { date: "2024-12-09", time: "18:00", location: "잠실 한강공원", city: "서울", category: "달리기", info: "Running club meetup. Free T-shirt for first-timers.", status: "open" },
    { date: "2024-12-09", time: "19:00", location: "압구정 영화관", city: "서울", category: "영화", info: "Movie screening: 'Decision to Leave' by Park Chan-wook. Free snacks.", status: "open" },

    // Events for 2024-12-10
    { date: "2024-12-10", time: "10:00", location: "잠실 롯데월드", city: "서울", category: "놀이공원", info: "Group outing to Lotte World amusement park. Discounted tickets provided.", status: "open" },
    { date: "2024-12-10", time: "11:00", location: "성수동 크로키 클래스", city: "서울", category: "미술", info: "Sketching class for beginners. Materials included.", status: "open" },
    { date: "2024-12-10", time: "14:00", location: "이태원 영어 카페", city: "서울", category: "언어 교환", info: "English conversation meetup. Drinks not included.", status: "open" },
    { date: "2024-12-10", time: "15:00", location: "강남 요가 스튜디오", city: "서울", category: "요가", info: "Power yoga class for strength and flexibility. Bring your mat.", status: "open" },
    { date: "2024-12-10", time: "18:00", location: "송파구 공원", city: "서울", category: "명상", info: "Outdoor meditation session. Dress warmly.", status: "open" },
  ];


  const scheduleContainer = document.querySelector(".schedule");
  let selectedCity = "모든"; // Default to "모든"
  let selectedCategory = "모든"; // Default to "모든"

  function renderEvents(selectedDate) {
    scheduleContainer.innerHTML = ""; // Clear existing events

    const filteredEvents = events.filter(event => {
      return (
        (selectedDate ? event.date === selectedDate : true) &&
        (selectedCity === "모든" || event.city === selectedCity) &&
        (selectedCategory === "모든" || event.category === selectedCategory)
      );
    });

    if (filteredEvents.length === 0) {
      scheduleContainer.innerHTML = "<p>No events available for the selected filters.</p>";
    } else {
      filteredEvents.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = "event";
        eventElement.innerHTML = `
          <div class="time">${event.time}</div>
          <div class="details">
            <p>${event.location}</p>
            <p class="info">${event.info}</p>
          </div>
          <button class="status ${event.status}">신청가능</button>
        `;
        scheduleContainer.appendChild(eventElement);
      });
    }
  }

  // Listen for changes to date
  document.addEventListener("dateChanged", (e) => {
    renderEvents(e.detail.selectedDate);
  });

  // Listen for changes to city and category
  document.addEventListener("filtersChanged", (e) => {
    selectedCity = e.detail.selectedCity;
    selectedCategory = e.detail.selectedCategory;
    renderEvents(e.detail.selectedDate);
  });
});
