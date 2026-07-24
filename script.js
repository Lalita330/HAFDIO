(() => {
  "use strict";

  const config = window.NOCTHRYN_CONFIG || {};
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl;
    link.setAttribute("aria-label", "Escríbeme por WhatsApp; abre una conversación nueva");
  });

  document.querySelectorAll("[data-business-name]").forEach((element) => {
    element.textContent = config.businessName;
  });
  document.querySelectorAll("[data-city]").forEach((element) => {
    element.textContent = config.city;
  });
  document.querySelectorAll("[data-availability]").forEach((element) => {
    element.textContent = config.availability;
  });
  document.querySelectorAll("[data-email]").forEach((element) => {
    element.textContent = config.email;
    element.href = `mailto:${config.email}`;
  });
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const revealElements = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px" });

    revealElements.forEach((element) => observer.observe(element));
  }
})();
