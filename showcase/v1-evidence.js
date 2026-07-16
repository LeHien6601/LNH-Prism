for (const button of document.querySelectorAll("[data-review-scale]")) {
  button.addEventListener("click", () => {
    const scale = button.dataset.reviewScale;
    document.documentElement.style.setProperty("--review-scale", scale);
    for (const candidate of document.querySelectorAll("[data-review-scale]")) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }
  });
}
