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

const methodOptions = document.querySelectorAll(".method-option");
const methodOutput = document.querySelector(".method-output");

methodOptions.forEach((option) => {
  option.addEventListener("click", () => {
    methodOptions.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    option.classList.add("active");
    option.setAttribute("aria-selected", "true");
    methodOutput.querySelector("span").textContent = option.dataset.signal;
    methodOutput.querySelector("h3").textContent = option.dataset.label;
    methodOutput.querySelector("p").textContent = option.dataset.output;
  });
});

const ledgerFilters = document.querySelectorAll(".ledger-filter");
const ledgerRows = document.querySelectorAll(".ledger-row");

ledgerFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    ledgerFilters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    ledgerRows.forEach((row) => {
      row.classList.toggle("hidden", filter.dataset.filter !== "all" && row.dataset.type !== filter.dataset.filter);
    });
  });
});

const thesisTabs = document.querySelectorAll(".thesis-tab");
const founderQuote = document.querySelector(".founder-quote");
const thesisCopy = document.querySelector(".thesis-copy");

thesisTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    thesisTabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    founderQuote.textContent = tab.dataset.title;
    thesisCopy.textContent = tab.dataset.copy;
  });
});

const configPaths = {
  venture: { title: "Venture Architecture", copy: "Turn the concept into a coherent product, business, and technical system.", meta: "STRATEGY / SYSTEM DESIGN / ROADMAP", subject: "Venture Architecture", color: "#ff4d00" },
  engineering: { title: "AI Systems Engineering", copy: "Build agents, automation engines, graph intelligence, and durable AI workflows.", meta: "ARCHITECTURE / PROTOTYPE / BUILD", subject: "AI Systems Engineering", color: "#4ee8ff" },
  launch: { title: "Launch Execution", copy: "Move from powerful system to market-ready product with clarity, identity, and force.", meta: "PRODUCT / IDENTITY / LAUNCH", subject: "Launch Execution", color: "#56d69b" }
};
const configChoices = document.querySelectorAll(".config-choice");
const configResult = document.querySelector(".config-result");

configChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    configChoices.forEach((item) => item.classList.remove("active"));
    choice.classList.add("active");
    const path = configPaths[choice.dataset.path];
    configResult.style.setProperty("--config-color", path.color);
    configResult.querySelector("h3").textContent = path.title;
    configResult.querySelector("p").textContent = path.copy;
    configResult.querySelector("small").textContent = path.meta;
    configResult.querySelector("a").href = `mailto:contact@architechforge.com?subject=${encodeURIComponent(path.subject)}`;
  });
});
