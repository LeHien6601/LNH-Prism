const PRESS_KEYS = new Set(["Enter", " "]);

for (const button of document.querySelectorAll("[data-button-preview='normal']")) {
  const image = button.querySelector("img");
  if (!image) continue;

  const normalSource = image.src;
  const showPressed = () => {
    image.src = normalSource.replace("/normal/", "/pressed/");
    button.classList.add("is-preview-pressed");
  };
  const showNormal = () => {
    image.src = normalSource;
    button.classList.remove("is-preview-pressed");
  };

  button.addEventListener("pointerdown", showPressed);
  button.addEventListener("pointerup", showNormal);
  button.addEventListener("pointercancel", showNormal);
  button.addEventListener("pointerleave", showNormal);
  button.addEventListener("keydown", (event) => { if (PRESS_KEYS.has(event.key)) showPressed(); });
  button.addEventListener("keyup", (event) => { if (PRESS_KEYS.has(event.key)) showNormal(); });
  button.addEventListener("blur", showNormal);
}
