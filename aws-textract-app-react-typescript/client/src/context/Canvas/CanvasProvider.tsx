import React from "react";

import { CanvasContext } from "./CanvasContext";
import { useCanvas } from "../../hooks/useCanvas-hook";

interface CanvasProviderProps extends React.PropsWithChildren {}

const CanvasProvider: React.FC<CanvasProviderProps> = (props) => {
  const {
    canvas,
    canvasWidth,
    canvasHeight,
    drawingArray,
    useTool,
    penSize,
    penColor,
    eraserSize,
    canvasBgColor,
    canvasActions,
    initializeCanvas,
    refreshCanvas,
    canvasStateHandler,
    canvasStorageHandler,
    downloadCanvasHandler,
    loadImage,
    canvasDrawingHandler,
    isCanvasEmpty,
  } = useCanvas();

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        canvasWidth,
        canvasHeight,
        drawingArray,
        useTool,
        penSize,
        penColor,
        eraserSize,
        canvasBgColor,
        canvasActions,
        initializeCanvas,
        refreshCanvas,
        canvasStateHandler,
        canvasStorageHandler,
        downloadCanvasHandler,
        loadImage,
        canvasDrawingHandler,
        isCanvasEmpty,
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
