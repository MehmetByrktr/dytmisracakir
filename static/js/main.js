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

// Theme removed: site now uses a single light artichoke palette.
html.setAttribute("data-theme", "light");
localStorage.setItem("theme", "light");

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
const deleteForms = document.querySelectorAll("form.inline-delete-form");
deleteForms.forEach(form => {
  form.addEventListener("submit", function (e) {
    const trigger = form.querySelector("[data-confirm-delete]");
    const message = trigger?.dataset.confirmDelete || "Bu işlemi yapmak istediğine emin misin?";
    if (!confirm(message)) {
      e.preventDefault();
    }
  });
});

const legacyDeleteLinks = document.querySelectorAll("a[data-confirm-delete]");
legacyDeleteLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    const message = link.dataset.confirmDelete || "Bu işlemi yapmak istediğine emin misin?";
    if (!confirm(message)) {
      e.preventDefault();
    }
  });
});

// EDITORIAL THEME - SCROLL REVEAL
const revealItems = document.querySelectorAll(".reveal-up, .glass-card, .p-card, .post-card, .blog-card, .quick-action-card");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
}

// EDITORIAL THEME - Hero image parallax removed for cleaner proportions

// RIGHT RAIL - BACK TO TOP
const scrollTopButton = document.getElementById("scrollTopButton");
if (scrollTopButton) {
  const updateScrollTopVisibility = () => {
    scrollTopButton.classList.toggle("is-visible", window.scrollY > 420);
  };

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateScrollTopVisibility();
  window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
}
