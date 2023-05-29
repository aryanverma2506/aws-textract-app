import { createContext } from "react";
import {
  CanvasReducerActionPayloadTypes,
  DrawingObject,
  canvasActions,
} from "../../hooks/useCanvas-hook";

export interface CanvasContextType {
  readonly canvas: HTMLCanvasElement | null;
  readonly drawingArray: DrawingObject[];
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly useTool: "PEN" | "ERASER";
  readonly penSize: number;
  readonly penColor: string;
  readonly eraserSize: number;
  readonly canvasBgColor: string;
  readonly canvasActions: typeof canvasActions;
  initializeCanvas: (payload: {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  }) => void;
  refreshCanvas: (withImage?: boolean) => void;
  canvasStateHandler: (action: {
    type: canvasActions;
    payloadKey?: keyof CanvasReducerActionPayloadTypes;
    value?: string | number | {};
    doRedraw?: boolean;
  }) => void;
  canvasStorageHandler: (actionType: "SAVE" | "LOAD" | "CLEAR") => void;
  downloadCanvasHandler: () => void;
  loadImage: (file: File) => void;
  canvasMouseDrawingHandler: ({
    type,
    event,
  }: {
    type: "START" | "CONTINUE" | "STOP";
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>;
  }) => void;
  canvasTouchDrawingHandler: ({
    type,
    event,
  }: {
    type: "START" | "CONTINUE" | "STOP";
    event: React.TouchEvent<HTMLCanvasElement>;
  }) => void;
  isCanvasEmpty: () => boolean;
}

export const CanvasContext = createContext<CanvasContextType>({
  canvas: null,
  drawingArray: [],
  canvasWidth: 0,
  canvasHeight: 0,
  useTool: "PEN",
  penSize: 0,
  penColor: "",
  eraserSize: 0,
  canvasBgColor: "",
  canvasActions: canvasActions, // Object.entries(canvasActions).reduce((acc, [key, value]) => {
  //   acc[value as canvasActions] = key;
  //   return acc;
  // }, {} as { [key: number | string]: string } & typeof canvasActions),
  initializeCanvas: (payload: {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  }) => {},
  refreshCanvas: (withImage = false) => {},
  canvasStateHandler: (action: {
    type: canvasActions;
    payloadKey?: keyof CanvasReducerActionPayloadTypes;
    value?: string | number | {};
    doRedraw?: boolean;
  }) => {},
  canvasStorageHandler: (actionType: "SAVE" | "LOAD" | "CLEAR") => {},
  downloadCanvasHandler: () => {},
  loadImage: (file: File) => {},
  canvasMouseDrawingHandler: ({
    type,
    event,
  }: {
    type: "START" | "CONTINUE" | "STOP";
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>;
  }) => {},
  canvasTouchDrawingHandler: ({
    type,
    event,
  }: {
    type: "START" | "CONTINUE" | "STOP";
    event: React.TouchEvent<HTMLCanvasElement>;
  }) => {},
  isCanvasEmpty: () => true || false,
});
