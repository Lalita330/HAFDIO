(() => {
  "use strict";

  const config = window.HAFDIO_CONFIG || {};
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`;

  const formatCOP = (value) => `$${Math.round(value).toLocaleString("es-CO")}`;

  class QuantityPriceSelector extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready === "true") return;

      const unitPrice = Number(this.getAttribute("unit-price"));
      const parsedMin = Number.parseInt(this.getAttribute("min-qty") || "1", 10);
      const minQty = Number.isFinite(parsedMin) ? Math.max(1, parsedMin) : 1;
      const label = this.getAttribute("label") || "servicio";

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) return;

      this.dataset.ready = "true";
      this.innerHTML = `
        <div class="quantity-price-top">
          <span class="quantity-unit">${formatCOP(unitPrice)} c/u</span>
          <div class="quantity-stepper" role="group" aria-label="Cantidad de ${label}">
            <button class="quantity-button quantity-minus" type="button" aria-label="Restar una unidad de ${label}">−</button>
            <input class="quantity-input" type="number" inputmode="numeric" min="${minQty}" step="1" value="${minQty}" aria-label="Cantidad de ${label}">
            <button class="quantity-button quantity-plus" type="button" aria-label="Agregar una unidad de ${label}">+</button>
          </div>
        </div>
        ${minQty > 1 ? `<span class="quantity-minimum">Mínimo ${minQty}</span>` : ""}
        <strong class="quantity-total" aria-live="polite"></strong>
      `;

      const input = this.querySelector(".quantity-input");
      const minusButton = this.querySelector(".quantity-minus");
      const plusButton = this.querySelector(".quantity-plus");
      const totalElement = this.querySelector(".quantity-total");

      const updateTotal = (requestedQty) => {
        const quantity = Math.max(minQty, Number.parseInt(requestedQty, 10) || minQty);
        const total = unitPrice * quantity;

        input.value = String(quantity);
        minusButton.disabled = quantity <= minQty;
        totalElement.textContent = `Total: ${formatCOP(total)}`;
      };

      minusButton.addEventListener("click", () => updateTotal(Number(input.value) - 1));
      plusButton.addEventListener("click", () => updateTotal(Number(input.value) + 1));
      input.addEventListener("input", () => {
        if (input.value !== "") updateTotal(input.value);
      });
      input.addEventListener("change", () => updateTotal(input.value));
      updateTotal(minQty);
    }
  }

  if (!customElements.get("quantity-price-selector")) {
    customElements.define("quantity-price-selector", QuantityPriceSelector);
  }

  document.querySelectorAll(".pricing-catalog .price-item").forEach((priceItem) => {
    if (priceItem.querySelector("quantity-price-selector")) return;

    const fixedPrice = priceItem.querySelector(":scope > .price-tag:not(.price-quote)");
    const serviceName = priceItem.querySelector(":scope > div > strong")?.textContent?.trim();
    const numericPrice = fixedPrice?.textContent?.match(/\$\s*([\d.]+)/)?.[1];
    const unitPrice = numericPrice ? Number(numericPrice.replaceAll(".", "")) : 0;

    if (!fixedPrice || !serviceName || !Number.isFinite(unitPrice) || unitPrice <= 0) return;

    const selector = document.createElement("quantity-price-selector");
    selector.setAttribute("unit-price", String(unitPrice));
    selector.setAttribute("label", serviceName);
    priceItem.classList.add("price-item-selector");
    fixedPrice.replaceWith(selector);
  });

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
  const gmailComposeUrl = new URL("https://mail.google.com/mail/");
  gmailComposeUrl.searchParams.set("view", "cm");
  gmailComposeUrl.searchParams.set("fs", "1");
  gmailComposeUrl.searchParams.set("to", config.email);
  gmailComposeUrl.searchParams.set("su", config.emailSubject);
  gmailComposeUrl.searchParams.set("body", config.emailBody);

  document.querySelectorAll("[data-email]").forEach((element) => {
    if (element.hasAttribute("data-email-address")) element.textContent = config.email;
    element.href = gmailComposeUrl.toString();
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    element.setAttribute("aria-label", "Abrir Gmail para escribir a " + config.email);
  });
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const scrollProgress = document.querySelector(".scroll-progress");
  let progressFramePending = false;

  const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress?.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, progress))));
    progressFramePending = false;
  };

  window.addEventListener("scroll", () => {
    if (!progressFramePending) {
      progressFramePending = true;
      window.requestAnimationFrame(updateScrollProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();
  const revealGroups = document.querySelectorAll(
    ".hero-grid, .category-grid, .development-pricing, .process-grid, .footer-inner"
  );

  revealGroups.forEach((group) => {
    const directRevealChildren = Array.from(group.children).filter((element) =>
      element.classList.contains("reveal")
    );

    directRevealChildren.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${(index % 3) * 120}ms`);
      element.style.setProperty("--reveal-x", `${index % 2 === 0 ? -24 : 24}px`);
    });
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
    }, { threshold: 0.04, rootMargin: "0px 0px -64px" });

    revealElements.forEach((element) => observer.observe(element));
  }
})();
