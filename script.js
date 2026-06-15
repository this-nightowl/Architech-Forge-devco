const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 35}ms`;
  revealObserver.observe(element);
});

const proofReadout = document.querySelector(".proof-readout strong");
const mobileProofReadout = document.querySelector(".mobile-proof-readout strong");
const graphNodes = document.querySelectorAll(".graph-node");

graphNodes.forEach((node) => {
  node.addEventListener("click", () => {
    graphNodes.forEach((item) => item.classList.remove("active"));
    node.classList.add("active");
    if (proofReadout) proofReadout.textContent = node.dataset.proof;
    if (mobileProofReadout) mobileProofReadout.textContent = node.dataset.proof;
  });
});

const mobileLinks = document.querySelectorAll(".mobile-command a");
const mobileProgress = document.querySelector(".mobile-progress i");
const trackedSections = ["top", "nsgx", "products", "proof", "engage"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const updateMobileContext = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  if (mobileProgress) mobileProgress.style.width = `${progress * 100}%`;

  const focusLine = window.innerHeight * 0.55;
  let activeSection = trackedSections[0]?.id;
  trackedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= focusLine) activeSection = section.id;
  });
  mobileLinks.forEach((link) => link.classList.toggle("active", link.dataset.section === activeSection));
};

window.addEventListener("scroll", updateMobileContext, { passive: true });
window.addEventListener("resize", updateMobileContext);
updateMobileContext();

if (window.matchMedia("(max-width: 560px)").matches) {
  document.querySelectorAll(".product-grid, .proof-grid").forEach((rail) => {
    const focusObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("in-focus", entry.isIntersecting));
    }, { root: rail, threshold: 0.72 });
    rail.querySelectorAll(".product-card, .proof-tile").forEach((card) => focusObserver.observe(card));
  });
}

const ventureTabs = document.querySelectorAll(".venture-tab");
const ventureDetail = document.querySelector(".venture-detail");

ventureTabs.forEach((tab) => {
  tab.style.setProperty("--active-color", tab.dataset.color);
  tab.addEventListener("click", () => {
    ventureTabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    if (!ventureDetail) return;
    ventureDetail.style.setProperty("--detail-color", tab.dataset.color);
    ventureDetail.querySelector(".detail-number").textContent = tab.dataset.number;
    ventureDetail.querySelector(".detail-status").textContent = tab.dataset.status;
    ventureDetail.querySelector(".detail-category").textContent = tab.dataset.category;
    ventureDetail.querySelector(".detail-name").textContent = tab.dataset.name;
    ventureDetail.querySelector(".detail-summary").textContent = tab.dataset.summary;
    const link = ventureDetail.querySelector(".detail-link");
    link.href = tab.dataset.url;
    link.querySelector("span").textContent = tab.dataset.domain;
  });
});
