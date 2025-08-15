// script.js
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     1. Navigation Tab Switch
  ========================== */
  const tabs = document.querySelectorAll(".nav-item");
  const contents = document.querySelectorAll(".content");

  window.switchTab = (tabId, el) => {
    contents.forEach(c => c.classList.add("hidden"));
    document.getElementById(tabId).classList.remove("hidden");

    tabs.forEach(t => t.classList.remove("active"));
    el.classList.add("active");
  };

  /* =========================
     2. Payment Modal Handling
  ========================== */
  const modal = document.getElementById("paymentModal");
  const packageNameInput = document.getElementById("packageName");
  const packagePriceInput = document.getElementById("packagePrice");
  const displayName = document.getElementById("displayPackageName");
  const displayPrice = document.getElementById("displayPackagePrice");

  window.openPaymentModal = (name, price) => {
    packageNameInput.value = name;
    packagePriceInput.value = price;
    displayName.value = name;
    displayPrice.value = price;
    modal.style.display = "flex";
  };

  window.closePaymentModal = () => {
    modal.style.display = "none";
  };

  /* Close modal if clicked outside */
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closePaymentModal();
    }
  });

  /* =========================
     3. Form Validation
  ========================== */
  const mpesaForm = document.getElementById("mpesaPaymentForm");
  if (mpesaForm) {
    mpesaForm.addEventListener("submit", (e) => {
      const phoneInput = document.getElementById("mpesaPhone");
      const phone = phoneInput.value.trim();
      const pattern = /^254[17]\d{8}$/;

      if (!pattern.test(phone)) {
        alert("Please enter a valid Kenyan phone number starting with 2547 or 2541.");
        e.preventDefault();
      }
    });
  }

  /* =========================
     4. Smooth Scroll to Top
  ========================== */
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.id = "scroll-top";
  scrollTopBtn.innerHTML = "↑";
  document.body.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });

  /* =========================
     5. Fade-in Animations
  ========================== */
  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  fadeElements.forEach(el => observer.observe(el));
});
