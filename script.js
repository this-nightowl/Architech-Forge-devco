const bootSequence = document.querySelector(".boot-sequence");
const bootSkip = document.querySelector(".boot-skip");

const finishBoot = () => {
  bootSequence?.classList.add("done");
  document.body.classList.remove("booting");
  sessionStorage.setItem("af-boot-seen", "true");
};

if (bootSequence) {
  if (sessionStorage.getItem("af-boot-seen") === "true" || window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 560px)").matches) {
    finishBoot();
  } else {
    document.body.classList.add("booting");
    window.setTimeout(finishBoot, 2100);
  }
  bootSkip?.addEventListener("click", finishBoot);
}

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

const heroVisual = document.querySelector(".hero-visual");

if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    heroVisual.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

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
