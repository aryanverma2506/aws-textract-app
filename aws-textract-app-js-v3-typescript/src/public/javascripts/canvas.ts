// SETTING ALL VARIABLES
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const canvasUpdate = <HTMLInputElement>document.getElementById("canvas-update");
const colorPicker = <HTMLInputElement>document.getElementById("color-picker");
const bgColorPicker = <HTMLInputElement>(
  document.getElementById("bg-color-picker")
);
const controlPencilSize = <HTMLInputElement>(
  document.getElementById("control-pencil-size")
);
const controlEraserSize = <HTMLInputElement>(
  document.getElementById("control-eraser-size")
);
const pencilSize = <HTMLLabelElement>document.getElementById("pencil-size");
const eraserSize = <HTMLLabelElement>document.getElementById("eraser-size");
const downloadCanvas = <HTMLButtonElement>(
  document.getElementById("download-canvas")
);
const pencil = <HTMLButtonElement>document.getElementById("pencil");
const eraser = <HTMLButtonElement>document.getElementById("eraser");
const clearCanvas = <HTMLButtonElement>document.getElementById("clear-canvas");
const saveCanvas = <HTMLButtonElement>document.getElementById("save-canvas");
const loadCanvas = <HTMLButtonElement>document.getElementById("load-canvas");
const clearCanvasCache = <HTMLButtonElement>(
  document.getElementById("clear-canvas-cache")
);
const filePicker = <HTMLInputElement>document.getElementById("file-picker");
const filePickerBtn = <HTMLButtonElement>(
  document.getElementById("file-picker-btn")
);
const result = <HTMLInputElement>document.getElementById("result");
const clearResult = <HTMLButtonElement>document.getElementById("clear-result");
const canvasForm = <HTMLFormElement>document.getElementById("canvas-form");
const canvasCtx = canvas.getContext("2d", { willReadFrequently: true })!;
let isDrawing = false;
let drawingArray: {
  x: number;
  y: number;
  size: number;
  color: string;
  stroke: boolean;
}[] = [];
let useTool: "PENCIL" | "ERASER" = "PENCIL";
let currentSize = +controlPencilSize.value;
let currentColor = colorPicker.value;
let currentBg = bgColorPicker.value;
pencilSize.innerHTML = controlPencilSize.value;
eraserSize.innerHTML = controlEraserSize.value;

// CREATE CANVAS
function createCanvas() {
  canvas.width = +(<HTMLInputElement>document.getElementById("sizeX")).value;
  canvas.height = +(<HTMLInputElement>document.getElementById("sizeY")).value;
  canvas.style.border = "1px solid";
  canvasCtx.lineCap = "round";
  canvasCtx.fillStyle = currentBg;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

// REDRAW
function redraw() {
  for (let i = 1; i < drawingArray.length; i++) {
    const line = drawingArray[i];
    const prevLine = drawingArray[i - 1];

    canvasCtx.beginPath();
    canvasCtx.moveTo(prevLine.x, prevLine.y);
    canvasCtx.lineWidth = line.size;
    canvasCtx.lineCap = "round";
    canvasCtx.strokeStyle = line.color;
    canvasCtx.lineTo(line.x, line.y);
    if (line.stroke) {
      canvasCtx.stroke();
    }
  }
}

// CALCULATE CANVAS RELATIVE MOUSE POSITION
function canvasMousePos<T extends MouseEvent>(event: T) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = +canvas.width / +rect.width;
  const scaleY = +canvas.height / +rect.height;
  const offsetX = +event.clientX - +rect.left;
  const offsetY = +event.clientY - +rect.top;
  return { x: offsetX * scaleX, y: offsetY * scaleY };
}

// STORE DRAWING DATA
function storeDrawing(
  x: number,
  y: number,
  size: number,
  color: string,
  stroke: boolean
) {
  drawingArray.push({ x, y, size, color, stroke });
}

// START DRAWING
function startDrawing(event: MouseEvent) {
  if (event.buttons === 1) {
    isDrawing = true;
  }
  if (isDrawing) {
    const currentPosition = canvasMousePos<MouseEvent>(event);
    canvasCtx.beginPath();
    canvasCtx.moveTo(currentPosition.x, currentPosition.y);
    canvasCtx.lineWidth = currentSize;
    canvasCtx.lineCap = "round";
    canvasCtx.strokeStyle = useTool === "ERASER" ? currentBg : currentColor;
    canvasCtx.lineTo(currentPosition.x, currentPosition.y);
    canvasCtx.stroke();
    storeDrawing(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      useTool === "ERASER" ? currentBg : currentColor,
      false
    );
  }
}

// CONTINUE DRAWING
function continueDrawing(event: MouseEvent) {
  if (isDrawing) {
    const currentPosition = canvasMousePos<MouseEvent>(event);
    canvasCtx.lineTo(currentPosition.x, currentPosition.y);
    canvasCtx.stroke();
    storeDrawing(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      useTool === "ERASER" ? currentBg : currentColor,
      true
    );
  }
}

// STOP DRAWING
function stopDrawing() {
  isDrawing = false;
}

// UPDATE CANVAS
function updateCanvasHandler() {
  createCanvas();
  if (drawingArray.length > 0) {
    redraw();
  }
}

// UPDATE PENCIL COLOR
function currentColorHandler() {
  currentColor = colorPicker.value;
}

// UPDATE CANVAS BACKGROUND COLOR
function bgColorHandler() {
  currentBg = bgColorPicker.value;
  canvasCtx.fillStyle = currentBg;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  if (drawingArray.length > 0) {
    redraw();
  }
}

// PENCIL SIZE
function pencilSizeControlHandler() {
  if (canvas.className.includes("pencil")) {
    currentSize = +controlPencilSize.value;
  }
  pencilSize.innerHTML = controlPencilSize.value;
}

// ERASER SIZE
function eraserSizeControlHandler() {
  if (canvas.className.includes("eraser")) {
    currentSize = +controlEraserSize.value;
  }
  eraserSize.innerHTML = controlEraserSize.value;
}

// DOWNLOAD CANVAS IMAGE
function downloadCanvasHandler() {
  const saveImage = document.createElement("a");
  saveImage.href = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  saveImage.download = "canvas.png";
  saveImage.click();
}

// USE PENCIL
function usePencil() {
  canvas.className = "canvas pencil";
  currentSize = +controlPencilSize.value;
  useTool = "PENCIL";
}

// USE ERASER
function useEraser() {
  canvas.className = "canvas eraser";
  currentSize = +controlEraserSize.value;
  useTool = "ERASER";
}

// CLEAR CANVAS
function clearCanvasHandler() {
  createCanvas();
  drawingArray = [];
}

// SAVE CANVAS IN LOCAL STORAGE
function canvasSaveHandler() {
  localStorage.setItem("saved-canvas", JSON.stringify(drawingArray));
  console.log("Canvas Saved!");
}

// LOAD CANVAS FROM LOCAL STORAGE
function canvasLoadHandler() {
  if (localStorage.getItem("saved-canvas")) {
    drawingArray = JSON.parse(localStorage.getItem("saved-canvas")!);
    redraw();
    console.log("Canvas loaded.");
  } else {
    console.log("No canvas in memory!");
  }
}

// CLEAR CACHE FROM LOCAL STORAGE
function clearCacheHandler() {
  localStorage.removeItem("saved-canvas");
  console.log("Cache cleared!");
}

// FILE PICKER HANDLER
function filePickerHandler(event: Event) {
  const file = (<HTMLInputElement>event.target)?.files?.[0];
  filePickerBtn.innerHTML = file?.name || "Choose an image";

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      createCanvas();
      canvasCtx.drawImage(img, 0, 0);
    };
    e.target?.result && (img.src = e.target?.result.toString());
  };
  filePicker.value = "";
  file && reader.readAsDataURL(file);
}

// CHECK WHETHER CANVAS IS EMPTY OR NOT
function isCanvasEmpty() {
  const pixelData = canvasCtx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;
  const currentBgColor = currentBg.replace("#", "");
  const currentBgRed = parseInt(currentBgColor.substring(0, 2), 16);
  const currentBgGreen = parseInt(currentBgColor.substring(2, 4), 16);
  const currentBgBlue = parseInt(currentBgColor.substring(4, 6), 16);

  for (let i = 0; i < pixelData.length; i += 4) {
    const red = pixelData[i];
    const green = pixelData[i + 1];
    const blue = pixelData[i + 2];
    const alpha = pixelData[i + 3];

    if (
      alpha > 0 &&
      (red !== currentBgRed ||
        green !== currentBgGreen ||
        blue !== currentBgBlue)
    ) {
      return false;
    }
  }

  return true;
}

// CANVAS SUBMIT HANDLER
function canvasFormSubmitHandler(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData();
  canvas.toBlob((blob) => {
    if (blob && !isCanvasEmpty()) {
      formData.append("canvasImage", blob, "canvas.png");
      fetch("http://localhost:5000/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((responseData) => {
          result.value = responseData.data;
          createCanvas();
          drawingArray = [];
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("Canvas is empty!");
    }
  });
}

// INITIALIZE CANVAS
createCanvas();

// DRAWING EVENT HANDLERS
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", continueDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("mouseover", startDrawing);

// BUTTON EVENT HANDLERS
canvasUpdate.addEventListener("click", updateCanvasHandler);
colorPicker.addEventListener("input", currentColorHandler);
bgColorPicker.addEventListener("input", bgColorHandler);
controlPencilSize.addEventListener("input", pencilSizeControlHandler);
controlEraserSize.addEventListener("input", eraserSizeControlHandler);
downloadCanvas.addEventListener("click", downloadCanvasHandler);
pencil.addEventListener("click", usePencil);
eraser.addEventListener("click", useEraser);
clearCanvas.addEventListener("click", clearCanvasHandler);
saveCanvas.addEventListener("click", canvasSaveHandler);
loadCanvas.addEventListener("click", canvasLoadHandler);
clearCanvasCache.addEventListener("click", clearCacheHandler);
filePicker.addEventListener("change", filePickerHandler);
filePickerBtn.addEventListener("click", () => filePicker.click());
clearResult.addEventListener("click", () => (result.value = ""));
canvasForm.addEventListener("submit", canvasFormSubmitHandler);
