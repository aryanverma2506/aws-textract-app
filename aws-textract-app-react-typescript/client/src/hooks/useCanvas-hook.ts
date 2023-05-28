import { useCallback, useReducer } from "react";

let isDrawing: boolean;
let useTool: "PEN" | "ERASER" = "PEN";

export enum canvasActions {
  createCanvas,
  usePen,
  useEraser,
  changePenColor,
  changeCanvasBgColor,
  changePenSize,
  changeEraserSize,
  changeCanvasWidth,
  changeCanvasHeight,
  loadCanvas,
  drawOnCanvas,
}

// const actionTypes: { [key: string | number]: string } & typeof CanvasActions =
// Object.entries(CanvasActions).reduce((acc, [key, value]) => {
//   acc[value as CanvasActions] = key;
//   return acc;
// }, {} as { [key: string | number]: string } & typeof CanvasActions);

export interface DrawingObject {
  x: number;
  y: number;
  size: number;
  color: string;
  canMove: boolean;
}

export interface CanvasReducerStateTypes {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  canvasWidth: number;
  canvasHeight: number;
  drawingArray: DrawingObject[];
  penSize: number;
  penColor: string;
  eraserSize: number;
  canvasBgColor: string;
}

export interface CanvasReducerActionPayloadTypes {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  canvasWidth?: number;
  canvasHeight?: number;
  drawing?: DrawingObject | DrawingObject[];
  penSize?: number;
  penColor?: string;
  eraserSize?: number;
  canvasBgColor?: string;
}

export interface CanvasReducerActionTypes {
  type: canvasActions;
  payload?: CanvasReducerActionPayloadTypes;
  callback?: Function;
}

export function isDrawingObject(object: unknown): object is DrawingObject {
  return (
    object instanceof Object &&
    "x" in object &&
    "y" in object &&
    "size" in object &&
    "color" in object &&
    "canMove" in object
  );
}

function canvasReducer(
  state: CanvasReducerStateTypes,
  { type, payload, callback }: CanvasReducerActionTypes
): CanvasReducerStateTypes {
  switch (type) {
    case canvasActions.createCanvas:
      if (payload?.canvas && payload?.ctx) {
        payload.canvas.width = state.canvasWidth;
        payload.canvas.height = state.canvasHeight;
        payload.canvas.style.border = "1px solid";
        payload.ctx.lineCap = "round";
        payload.ctx.fillStyle = state.canvasBgColor;
        payload.ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
      }
      return {
        ...state,
        canvas: payload?.canvas || state.canvas,
        ctx: payload?.ctx || state.ctx,
        drawingArray: [],
      };
    case canvasActions.usePen:
      useTool = "PEN";
      return { ...state };
    case canvasActions.useEraser:
      useTool = "ERASER";
      return { ...state };
    case canvasActions.changePenColor:
      return {
        ...state,
        penColor: payload?.penColor || state.penColor,
      };
    case canvasActions.changeCanvasBgColor:
      if (state.canvas && state.ctx) {
        state.ctx.fillStyle = payload?.canvasBgColor || state.canvasBgColor;
        state.ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
      }
      callback && callback(state.drawingArray);
      return {
        ...state,
        canvasBgColor: payload?.canvasBgColor || state.canvasBgColor,
      };
    case canvasActions.changePenSize:
      return {
        ...state,
        penSize: payload?.penSize || state.penSize,
      };
    case canvasActions.changeEraserSize:
      return {
        ...state,
        eraserSize: payload?.eraserSize || state.eraserSize,
      };
    case canvasActions.changeCanvasWidth:
      return {
        ...state,
        canvasWidth: payload?.canvasWidth || state.canvasWidth,
      };
    case canvasActions.changeCanvasHeight:
      return {
        ...state,
        canvasHeight: payload?.canvasHeight || state.canvasHeight,
      };
    case canvasActions.loadCanvas:
      if (state.canvas && state.ctx) {
        state.ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
      }
      callback &&
        callback(
          (payload &&
            Array.isArray(payload.drawing) && [
              ...payload.drawing,
              ...state.drawingArray,
            ]) ||
            state.drawingArray
        );
      return {
        ...state,
        drawingArray:
          (payload &&
            Array.isArray(payload.drawing) && [
              ...payload.drawing,
              ...state.drawingArray,
            ]) ||
          state.drawingArray,
      };
    case canvasActions.drawOnCanvas:
      return {
        ...state,
        drawingArray: [
          ...state.drawingArray,
          ...(payload && isDrawingObject(payload.drawing)
            ? [payload.drawing]
            : []),
        ],
      };
    default:
      return state;
  }
}

export function useCanvas() {
  const [canvasState, dispatchCanvasReducer] = useReducer(canvasReducer, {
    canvas: null,
    ctx: null,
    canvasWidth: 1100,
    canvasHeight: 1100,
    drawingArray: [],
    penSize: 5,
    penColor: "#c81464",
    eraserSize: 20,
    canvasBgColor: "#ffffff",
  });

  const {
    canvas,
    ctx,
    canvasWidth,
    canvasHeight,
    drawingArray,
    penSize,
    penColor,
    eraserSize,
    canvasBgColor,
  } = canvasState;

  const redraw = useCallback(
    (drawingArray: DrawingObject[]) => {
      if (drawingArray.length > 0 && ctx) {
        ctx.beginPath();
        ctx.lineWidth = drawingArray[0].size;
        ctx.lineCap = "round";
        ctx.strokeStyle = drawingArray[0].color;
        ctx.lineTo(drawingArray[0].x, drawingArray[0].y);
        ctx.stroke();
        for (let i = 1; i < drawingArray.length; i++) {
          const line = drawingArray[i];
          const prevLine = drawingArray[i - 1];

          ctx.beginPath();
          if (line.canMove) {
            ctx.moveTo(prevLine.x, prevLine.y);
          }
          ctx.lineWidth = line.size;
          ctx.lineCap = "round";
          ctx.strokeStyle = line.color;
          ctx.lineTo(line.x, line.y);
          ctx.stroke();
        }
      }
    },
    [ctx]
  );

  const canvasMousePos = useCallback(
    <T extends React.MouseEvent<HTMLCanvasElement, MouseEvent>>(event: T) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = +canvas.width / +rect.width;
        const scaleY = +canvas.height / +rect.height;
        const offsetX = +event.clientX - +rect.left;
        const offsetY = +event.clientY - +rect.top;
        return { x: offsetX * scaleX, y: offsetY * scaleY };
      }
    },
    [canvas]
  );

  const refreshCanvas = useCallback(() => {
    if (canvas && ctx) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.border = "1px solid";
      ctx.lineCap = "round";
      ctx.fillStyle = canvasBgColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      redraw(drawingArray);
    }
  }, [
    canvas,
    ctx,
    canvasWidth,
    canvasHeight,
    canvasBgColor,
    drawingArray,
    redraw,
  ]);

  const initializeCanvas = useCallback(
    ({
      canvas,
      ctx,
    }: {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
    }) => {
      dispatchCanvasReducer({
        type: canvasActions.createCanvas,
        payload: { canvas, ctx },
      });
    },
    []
  );

  const canvasStateHandler = useCallback(
    (action: {
      type: canvasActions;
      payloadKey?: keyof CanvasReducerActionPayloadTypes;
      value?: string | number | {} | [];
      doRedraw?: boolean;
    }) => {
      const { type, payloadKey, value, doRedraw } = action;
      dispatchCanvasReducer({
        type,
        payload: payloadKey ? { [payloadKey]: value } : undefined,
        callback: doRedraw ? redraw : undefined,
      });
    },
    [redraw]
  );

  const canvasStorageHandler = useCallback(
    (actionType: "SAVE" | "LOAD" | "CLEAR") => {
      switch (actionType) {
        case "SAVE":
          localStorage.setItem("saved-canvas", JSON.stringify(drawingArray));
          console.log("Canvas SAVED!");
          break;
        case "LOAD":
          if (localStorage.getItem("saved-canvas")) {
            const drawingArray = JSON.parse(
              localStorage.getItem("saved-canvas")!
            ) as [];
            canvasStateHandler({
              type: canvasActions.loadCanvas,
              payloadKey: "drawing",
              value: drawingArray,
              doRedraw: true,
            });
            console.log("Canvas LOADED!");
          } else {
            console.log("No canvas in memory!");
          }
          break;
        case "CLEAR":
          localStorage.removeItem("saved-canvas");
          console.log("Cache CLEARED!");
          break;
        default:
          return;
      }
    },
    [drawingArray, canvasStateHandler]
  );

  const downloadCanvasHandler = useCallback(() => {
    if (canvas && ctx) {
      const saveImage = document.createElement("a");

      saveImage.href = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      saveImage.download = "canvas.png";
      saveImage.click();
    }
  }, [canvas, ctx]);

  const loadImage = useCallback(
    (file: File) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const image = new Image();
        image.onload = () => {
          refreshCanvas();
          ctx?.drawImage(image, 0, 0);
        };
        e.target?.result && (image.src = e.target.result.toString());
      };
      file && fileReader.readAsDataURL(file);
    },
    [ctx, refreshCanvas]
  );

  const canvasDrawingHandler = useCallback(
    ({
      type,
      event,
    }: {
      type: "START" | "CONTINUE" | "STOP";
      event: React.MouseEvent<HTMLCanvasElement, MouseEvent>;
    }) => {
      let currentPosition;
      switch (type) {
        case "START":
          if (event.buttons === 1) {
            isDrawing = true;
            currentPosition =
              canvasMousePos<React.MouseEvent<HTMLCanvasElement, MouseEvent>>(
                event
              );
          }
          if (isDrawing && currentPosition && ctx) {
            ctx.beginPath();
            ctx.moveTo(currentPosition.x, currentPosition.y);
            ctx.lineWidth = useTool === "ERASER" ? eraserSize : penSize;
            ctx.lineCap = "round";
            ctx.strokeStyle = useTool === "ERASER" ? canvasBgColor : penColor;
            ctx.lineTo(currentPosition.x, currentPosition.y);
            ctx.stroke();
            canvasStateHandler({
              type: canvasActions.drawOnCanvas,
              payloadKey: "drawing",
              value: {
                x: currentPosition.x,
                y: currentPosition.y,
                size: useTool === "ERASER" ? eraserSize : penSize,
                color: useTool === "ERASER" ? canvasBgColor : penColor,
                canMove: false,
              },
            });
          }
          break;
        case "CONTINUE":
          currentPosition =
            canvasMousePos<React.MouseEvent<HTMLCanvasElement, MouseEvent>>(
              event
            );
          if (isDrawing && currentPosition && ctx) {
            ctx.lineTo(currentPosition.x, currentPosition.y);
            ctx.stroke();
            canvasStateHandler({
              type: canvasActions.drawOnCanvas,
              payloadKey: "drawing",
              value: {
                x: currentPosition.x,
                y: currentPosition.y,
                size: useTool === "ERASER" ? eraserSize : penSize,
                color: useTool === "ERASER" ? canvasBgColor : penColor,
                canMove: true,
              },
            });
          }
          break;
        case "STOP":
          isDrawing = false;
          break;
        default:
          break;
      }
    },
    [
      ctx,
      penSize,
      penColor,
      eraserSize,
      canvasBgColor,
      canvasMousePos,
      canvasStateHandler,
    ]
  );

  function isCanvasEmpty() {
    if (canvas && ctx) {
      const pixelData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      const currentBgColor = canvasState.canvasBgColor.replace("#", "");
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
    }

    return true;
  }

  return {
    canvas,
    ctx,
    canvasWidth,
    canvasHeight,
    drawingArray,
    useTool,
    penSize,
    penColor,
    eraserSize,
    canvasBgColor,
    canvasActions,
    redraw,
    initializeCanvas,
    refreshCanvas,
    canvasStateHandler,
    canvasStorageHandler,
    downloadCanvasHandler,
    loadImage,
    canvasDrawingHandler,
    isCanvasEmpty,
  };
}
