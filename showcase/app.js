const PRESS_KEYS = new Set(["Enter", " "]);
const recipes = globalThis.LNHPrismRecipes;
const showcaseData = globalThis.LNHPrismShowcaseData;

function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function sourceSummary(componentId) {
  const manifest = showcaseData?.manifests.find(({ sources }) => sources.component.id === componentId);
  return {
    source: manifest ? `${manifest.sources.component.id}@${manifest.sources.component.version}` : "Unavailable",
    renderer: manifest?.renderer.version ?? "Unavailable"
  };
}

const traceComponent = document.querySelector("#trace-component");
const traceParameters = document.querySelector("#trace-parameters");
const traceSource = document.querySelector("#trace-source");
const traceRenderer = document.querySelector("#trace-renderer");

function updateTrace(componentId, parameters) {
  const summary = sourceSummary(componentId);
  traceComponent.textContent = componentId;
  traceParameters.textContent = parameters;
  traceSource.textContent = summary.source;
  traceRenderer.textContent = summary.renderer;
}

function setValidation(input, message, text) {
  const invalid = !input.validity.valid;
  input.setAttribute("aria-invalid", String(invalid));
  message.classList.toggle("is-error", invalid);
  message.textContent = invalid ? text : message.dataset.defaultMessage;
  return !invalid;
}

function initializeInteractiveLab() {
  if (!recipes || !showcaseData) {
    document.querySelector("#interactive-lab")?.setAttribute("data-runtime-error", "true");
    return;
  }

  const buttonWidth = document.querySelector("#lab-button-width");
  const buttonState = document.querySelector("#lab-button-state");
  const buttonMessage = document.querySelector("#lab-button-message");
  const buttonPreview = document.querySelector("#lab-button-preview");
  const buttonImage = document.querySelector("#lab-button-image");
  buttonMessage.dataset.defaultMessage = buttonMessage.textContent;

  const renderButton = () => {
    if (!setValidation(buttonWidth, buttonMessage, "Enter an integer from 160 to 240 logical pixels.")) return;
    const logicalWidth = Number(buttonWidth.value);
    const state = buttonState.value;
    buttonImage.src = svgDataUrl(recipes.renderPrimaryButtonSvg({ logicalWidth, state }));
    buttonPreview.style.width = `${logicalWidth}px`;
    buttonPreview.style.aspectRatio = `${logicalWidth} / ${recipes.BUTTON_HEIGHT_LOGICAL}`;
    buttonPreview.classList.toggle("is-pressed", state === "pressed");
    buttonPreview.disabled = state === "disabled";
    buttonPreview.dataset.renderWidth = String(logicalWidth);
    buttonPreview.dataset.renderState = state;
    updateTrace("primary-button", `width=${logicalWidth}, state=${state}`);
  };

  for (const control of [buttonWidth, buttonState]) {
    control.addEventListener("input", renderButton);
    control.addEventListener("focus", renderButton);
  }

  const progressWidth = document.querySelector("#lab-progress-width");
  const progressPercent = document.querySelector("#lab-progress-percent");
  const progressMessage = document.querySelector("#lab-progress-message");
  const progressPreview = document.querySelector("#lab-progress-preview");
  const progressFrame = document.querySelector("#lab-progress-frame");
  const progressFill = document.querySelector("#lab-progress-fill");
  progressMessage.dataset.defaultMessage = progressMessage.textContent;

  const renderProgress = () => {
    if (!setValidation(progressWidth, progressMessage, "Enter a width from 320 to 432 logical pixels.")) return;
    if (!setValidation(progressPercent, progressMessage, "Enter an integer value from 0 to 100 percent.")) return;
    progressMessage.textContent = progressMessage.dataset.defaultMessage;
    progressMessage.classList.remove("is-error");
    const logicalWidth = Number(progressWidth.value);
    const percent = Number(progressPercent.value);
    progressFrame.src = svgDataUrl(recipes.renderProgressFrameSvg(logicalWidth));
    progressFill.src = svgDataUrl(recipes.renderProgressFillSvg({ logicalWidth, percent }));
    progressPreview.style.width = `${logicalWidth}px`;
    progressPreview.style.aspectRatio = `${logicalWidth} / ${recipes.PROGRESS_HEIGHT_LOGICAL}`;
    progressPreview.setAttribute("aria-label", `Interactive Primary Progress Bar preview at ${percent} percent`);
    progressPreview.dataset.renderWidth = String(logicalWidth);
    progressPreview.dataset.renderPercent = String(percent);
    updateTrace("primary-progress-bar", `width=${logicalWidth}, value=${percent}%`);
  };

  for (const control of [progressWidth, progressPercent]) {
    control.addEventListener("input", renderProgress);
    control.addEventListener("focus", renderProgress);
  }

  renderButton();
  renderProgress();
  renderButton();
}

initializeInteractiveLab();

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
