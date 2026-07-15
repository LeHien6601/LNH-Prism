for (const button of document.querySelectorAll("[data-button-preview]")) {
  if (button.disabled) continue;
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    if (!image || button.dataset.buttonPreview === "pressed") return;
    const normalSource = image.src;
    image.src = normalSource.replace("/normal/", "/pressed/");
    window.setTimeout(() => { image.src = normalSource; }, 180);
  });
}
