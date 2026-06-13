const html = document.documentElement;

const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const themeToggle = document.getElementById("themeToggle");

function openSidebar() {
  sidebar.classList.add("show");
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function closeSidebar() {
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

openBtn?.addEventListener("click", openSidebar);
closeBtn?.addEventListener("click", closeSidebar);
overlay?.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

// Theme: localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) html.setAttribute("data-theme", savedTheme);

function updateThemeButton() {
  const t = html.getAttribute("data-theme") || "light";
  themeToggle.textContent = (t === "dark") ? "☀️ Mod" : "🌙 Mod";
}
updateThemeButton();

themeToggle?.addEventListener("click", () => {
  const current = html.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeButton();
});

// DOĞRU BİLİNEN YANLIŞLAR - CANLI ARAMA
const mythSearch = document.getElementById("mythSearch");
const mythGrid = document.getElementById("mythGrid");
const noResult = document.getElementById("noResult");

if (mythSearch && mythGrid) {
  const cards = mythGrid.querySelectorAll(".faq");

  mythSearch.addEventListener("input", () => {
    const query = mythSearch.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const text = card.dataset.text.toLowerCase();
      const visible = text.includes(query);
      card.style.display = visible ? "block" : "none";
      if (visible) visibleCount++;
    });

    if (noResult) {
      noResult.style.display = visibleCount === 0 ? "block" : "none";
    }
  });
}

// ADMIN RANDEVU ARAMA + DURUM FİLTRESİ
const appointmentSearch = document.getElementById("appointmentSearch");
const appointmentStatusFilter = document.getElementById("appointmentStatusFilter");
const appointmentCards = document.querySelectorAll(".appointment-card");
const appointmentNoResult = document.getElementById("appointmentNoResult");

function filterAppointments() {
  if (!appointmentCards.length) return;

  const searchValue = appointmentSearch ? appointmentSearch.value.toLowerCase().trim() : "";
  const statusValue = appointmentStatusFilter ? appointmentStatusFilter.value : "";

  let visibleCount = 0;

  appointmentCards.forEach(card => {
    const text = (card.dataset.search || "").toLowerCase();
    const status = card.dataset.status || "";

    const matchesSearch = text.includes(searchValue);
    const matchesStatus = statusValue === "" || status === statusValue;

    const visible = matchesSearch && matchesStatus;

    card.style.display = visible ? "block" : "none";

    if (visible) visibleCount++;
  });

  if (appointmentNoResult) {
    appointmentNoResult.style.display = visibleCount === 0 ? "block" : "none";
  }
}

appointmentSearch?.addEventListener("input", filterAppointments);
appointmentStatusFilter?.addEventListener("change", filterAppointments);

// BLOG DETAY - LINK KOPYALAMA
const copyBlogLink = document.getElementById("copyBlogLink");

if (copyBlogLink) {
  copyBlogLink.addEventListener("click", async () => {
    const link = copyBlogLink.dataset.link;

    try {
      await navigator.clipboard.writeText(link);
      copyBlogLink.textContent = "Kopyalandı ✓";

      setTimeout(() => {
        copyBlogLink.textContent = "Linki Kopyala";
      }, 1600);
    } catch (err) {
      alert("Link kopyalanamadı.");
    }
  });
}

// FLASH MESSAGE CLOSE
const flashCloseButtons = document.querySelectorAll(".flash-close");

flashCloseButtons.forEach(button => {
  button.addEventListener("click", () => {
    const flash = button.closest(".flash-message");
    if (flash) {
      flash.remove();
    }
  });
});

setTimeout(() => {
  document.querySelectorAll(".flash-message").forEach(flash => {
    flash.remove();
  });
}, 3500);

// ADMIN DELETE CONFIRM
const deleteButtons = document.querySelectorAll("[data-confirm-delete]");

deleteButtons.forEach(button => {
  button.addEventListener("click", function (e) {
    const message = button.dataset.confirmDelete || "Bu işlemi yapmak istediğine emin misin?";

    const confirmed = confirm(message);

    if (!confirmed) {
      e.preventDefault();
    }
  });
});