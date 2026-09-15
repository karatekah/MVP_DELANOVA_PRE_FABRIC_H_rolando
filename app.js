"use strict";

// Número del asesor en formato internacional, sin +, espacios ni guiones.
// Ejemplo Perú: "51987654321". Vacío permite compartir el mensaje sin destinatario fijo.
const ADVISOR_WHATSAPP = "";
const OFFER_DURATION_MS = 10 * 60 * 60 * 1000;
const OFFER_STORAGE_KEY = "delanova_prefab_offer_deadline_v1";
const VISITOR_STORAGE_KEY = "delanova_prefab_visitor_v1";

const products = {
  esencial: {
    name: "Casa Esencial 36",
    tag: "La opción más práctica",
    summary: "Una vivienda compacta y funcional para comenzar rápido con lo necesario.",
    salePrice: 24900,
    regularPrice: 27900,
    rentPrice: 1190,
    discount: 11,
    specs: ["36 m²", "2", "1"],
    specLabels: ["Área", "Dormitorios", "Baño"],
    images: [
      { src: "assets/images/esencial-exterior.jpg", alt: "Exterior referencial de la casa Esencial" },
      { src: "assets/images/esencial-interior.jpg", alt: "Interior referencial de la casa Esencial" },
    ],
    details: [
      "Estructura modular de configuración básica.",
      "Revestimiento exterior en panel de fibrocemento referencial.",
      "Cubierta metálica y acceso frontal protegido.",
      "Sala-comedor con kitchenette compacta.",
      "Dos dormitorios y un baño en distribución referencial.",
      "Instalaciones eléctricas y sanitarias sujetas a alcance final.",
    ],
  },
  confort: {
    name: "Casa Confort 54",
    tag: "La favorita para familias",
    summary: "Más amplitud, aislamiento y acabados cálidos para una vida familiar cómoda.",
    salePrice: 34900,
    regularPrice: 39900,
    rentPrice: 1690,
    discount: 13,
    specs: ["54 m²", "2", "1"],
    specLabels: ["Área", "Dormitorios", "Baño"],
    images: [
      { src: "assets/images/confort-exterior.jpg", alt: "Exterior referencial de la casa Confort" },
      { src: "assets/images/confort-interior.jpg", alt: "Interior referencial de la casa Confort" },
    ],
    details: [
      "Estructura modular con mejor aislamiento térmico y acústico.",
      "Fachada con paneles claros y acentos tipo madera.",
      "Ventanas de mayor formato y terraza cubierta.",
      "Cocina integrada con mobiliario base referencial.",
      "Dos dormitorios, un baño y zona social ampliada.",
      "Acabados y equipamiento sujetos a la ficha comercial definitiva.",
    ],
  },
  premium: {
    name: "Casa Premium 72",
    tag: "Más espacio y mejor acabado",
    summary: "Dos niveles, ambientes amplios y una presencia contemporánea para crecer en grande.",
    salePrice: 44900,
    regularPrice: 51900,
    rentPrice: 2290,
    discount: 13,
    specs: ["72 m²", "3", "2"],
    specLabels: ["Área", "Dormitorios", "Baños"],
    images: [
      { src: "assets/images/premium-exterior.jpg", alt: "Exterior referencial de la casa Premium" },
      { src: "assets/images/premium-interior.jpg", alt: "Interior referencial de la casa Premium" },
    ],
    details: [
      "Configuración modular contemporánea de dos niveles.",
      "Fachada con paneles premium, acentos tipo madera y detalles metálicos.",
      "Ventanas amplias, terraza y balcón cubierto referenciales.",
      "Cocina integrada y zona social de mayor formato.",
      "Tres dormitorios y dos baños en distribución referencial.",
      "Personalizaciones, cimentación y equipamiento se cotizan por separado.",
    ],
  },
};

const state = { model: "esencial", mode: "compra", imageIndex: 0, offerExpired: false };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(value);

function ensureVisitor() {
  let visitor = localStorage.getItem(VISITOR_STORAGE_KEY);
  if (!visitor) {
    visitor = window.crypto?.randomUUID?.() || `visitante-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(VISITOR_STORAGE_KEY, visitor);
  }
  return visitor;
}

function getOfferDeadline() {
  const stored = Number(localStorage.getItem(OFFER_STORAGE_KEY));
  if (Number.isFinite(stored) && stored > 0) return stored;
  const deadline = Date.now() + OFFER_DURATION_MS;
  localStorage.setItem(OFFER_STORAGE_KEY, String(deadline));
  return deadline;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function updateTimer(deadline) {
  const remaining = deadline - Date.now();
  const label = formatDuration(remaining);
  $$(".timer").forEach((node) => { node.textContent = label; });
  if (remaining <= 0 && !state.offerExpired) {
    state.offerExpired = true;
    $("#offerClock").classList.add("is-expired");
    $("#offerClock span").textContent = "La oferta de este visitante finalizó";
    renderProduct();
  }
}

function selectedProduct() { return products[state.model]; }

function selectedPrice() {
  const product = selectedProduct();
  if (state.mode === "alquiler") return product.rentPrice;
  return state.offerExpired ? product.regularPrice : product.salePrice;
}

function renderGallery() {
  const product = selectedProduct();
  const image = product.images[state.imageIndex];
  $("#productImage").src = image.src;
  $("#productImage").alt = image.alt;
  $("#galleryCounter").textContent = `${state.imageIndex + 1} / ${product.images.length}`;
  $("#galleryDots").innerHTML = product.images.map((_, index) => (
    `<button class="${index === state.imageIndex ? "is-active" : ""}" data-image-index="${index}" aria-label="Ver foto ${index + 1}"></button>`
  )).join("");
}

function renderProduct() {
  const product = selectedProduct();
  $("#productTag").textContent = product.tag;
  $("#productName").textContent = product.name;
  $("#productSummary").textContent = product.summary;
  $("#discountBadge").textContent = state.offerExpired ? "Oferta finalizada" : `-${product.discount}%`;
  $("#inlineDiscount").textContent = state.offerExpired
    ? "Precio regular vigente"
    : `Ahorras ${money(product.regularPrice - product.salePrice)}`;

  const isRent = state.mode === "alquiler";
  $("#priceLabel").textContent = isRent ? "Alquiler mensual referencial" : state.offerExpired ? "Precio regular referencial" : "Precio web referencial";
  $("#currentPrice").textContent = `${money(selectedPrice())}${isRent ? "/mes" : ""}`;
  $("#regularPrice").hidden = isRent || state.offerExpired;
  $("#regularPrice").textContent = money(product.regularPrice);
  $("#inlineDiscount").hidden = isRent;
  $("#priceNote").textContent = isRent
    ? "Mensualidad sujeta a plazo, garantía, ubicación, disponibilidad y evaluación comercial."
    : "Incluye estructura base; traslado e instalación se cotizan según ubicación.";
  $("#mainCta").textContent = isRent ? "Consultar alquiler por WhatsApp" : "Cotizar esta casa por WhatsApp";

  $("#quickSpecs").innerHTML = product.specs.map((spec, index) => (
    `<span><strong>${spec}</strong>${product.specLabels[index]}</span>`
  )).join("");
  $("#detailList").innerHTML = product.details.map((detail) => `<li>${detail}</li>`).join("");

  $("#mobilePriceLabel").textContent = isRent ? "Alquiler mensual" : state.offerExpired ? "Precio regular" : "Precio web";
  $("#mobilePrice").textContent = `${money(selectedPrice())}${isRent ? "/mes" : ""}`;
  $(".mobile-buybar a").textContent = isRent ? "Consultar" : "Comprar";
  renderGallery();
}

function setModel(model) {
  if (!products[model]) return;
  state.model = model;
  state.imageIndex = 0;
  $$(".model-tab").forEach((button) => {
    const active = button.dataset.model === model;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  renderProduct();
}

function setMode(mode) {
  state.mode = mode === "alquiler" ? "alquiler" : "compra";
  $$(".mode-button").forEach((button) => button.classList.toggle("is-active", button.dataset.mode === state.mode));
  renderProduct();
}

function shiftImage(step) {
  const length = selectedProduct().images.length;
  state.imageIndex = (state.imageIndex + step + length) % length;
  renderGallery();
}

function buildMessage(intent) {
  const product = selectedProduct();
  const modeLabel = state.mode === "alquiler" ? "alquiler" : "compra";
  const priceLabel = `${money(selectedPrice())}${state.mode === "alquiler" ? " al mes" : ""}`;
  const offerStatus = state.offerExpired ? "La oferta del contador ya finalizó." : "Mi contador promocional sigue activo.";
  const intro = intent === "promocion"
    ? "Hola, vi la promoción web de casas prefabricadas y quiero recibir el precio especial."
    : intent === "asesoria"
      ? "Hola, quiero asesoría para elegir una casa prefabricada."
      : `Hola, quiero cotizar la ${product.name}.`;
  return [
    intro,
    "",
    `Modelo seleccionado: ${product.name}`,
    `Modalidad: ${modeLabel}`,
    `Precio mostrado: ${priceLabel} (referencial)`,
    `Área referencial: ${product.specs[0]}`,
    offerStatus,
    "",
    "Por favor, deseo confirmar acabados, transporte, instalación, condiciones y precio final.",
  ].join("\n");
}

function openWhatsApp(intent) {
  const message = encodeURIComponent(buildMessage(intent));
  const base = ADVISOR_WHATSAPP ? `https://wa.me/${ADVISOR_WHATSAPP}` : "https://wa.me/";
  if (!ADVISOR_WHATSAPP) showToast("Falta configurar el número del asesor. Se abrirá WhatsApp para compartir el mensaje.");
  window.open(`${base}?text=${message}`, "_blank", "noopener,noreferrer");
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4200);
}

function setModal(open) {
  $("#welcomeModal").hidden = !open;
  document.body.classList.toggle("modal-open", open);
}

function init() {
  ensureVisitor();
  const deadline = getOfferDeadline();
  updateTimer(deadline);
  window.setInterval(() => updateTimer(deadline), 1000);
  renderProduct();

  $$(".model-tab").forEach((button) => button.addEventListener("click", () => setModel(button.dataset.model)));
  $$(".mode-button").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  $("#galleryPrev").addEventListener("click", () => shiftImage(-1));
  $("#galleryNext").addEventListener("click", () => shiftImage(1));
  $("#galleryDots").addEventListener("click", (event) => {
    const button = event.target.closest("[data-image-index]");
    if (!button) return;
    state.imageIndex = Number(button.dataset.imageIndex);
    renderGallery();
  });

  let touchStartX = null;
  $("#galleryStage").addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  $("#galleryStage").addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) shiftImage(distance > 0 ? -1 : 1);
    touchStartX = null;
  }, { passive: true });

  $("#detailsToggle").addEventListener("click", () => {
    const details = $("#technicalDetails");
    const expanded = $("#detailsToggle").getAttribute("aria-expanded") === "true";
    $("#detailsToggle").setAttribute("aria-expanded", String(!expanded));
    details.hidden = expanded;
  });

  $$(".js-whatsapp").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    openWhatsApp(link.dataset.intent || "asesoria");
  }));
  $$('[data-close-modal]').forEach((button) => button.addEventListener("click", () => setModal(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setModal(false); });

  // Se muestra en cada nueva carga, pero puede cerrarse sin bloquear el catálogo.
  window.setTimeout(() => setModal(true), 650);
}

document.addEventListener("DOMContentLoaded", init);
