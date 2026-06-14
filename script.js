const bootSequence = document.querySelector(".boot-sequence");
const bootSkip = document.querySelector(".boot-skip");

const finishBoot = () => {
  bootSequence?.classList.add("done");
  document.body.classList.remove("booting");
  sessionStorage.setItem("af-boot-seen", "true");
};

if (bootSequence) {
  if (sessionStorage.getItem("af-boot-seen") === "true" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishBoot();
  } else {
    document.body.classList.add("booting");
    window.setTimeout(finishBoot, 3100);
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
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
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
const graphNodes = document.querySelectorAll(".graph-node");

graphNodes.forEach((node) => {
  node.addEventListener("click", () => {
    graphNodes.forEach((item) => item.classList.remove("active"));
    node.classList.add("active");
    if (proofReadout) proofReadout.textContent = node.dataset.proof;
  });
});
