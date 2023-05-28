import React, { useContext, useEffect, useRef } from "react";

import {
  CanvasContext,
  CanvasContextType,
} from "../../context/Canvas/CanvasContext";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { useTool, initializeCanvas, canvasDrawingHandler } =
    useContext<CanvasContextType>(CanvasContext);

  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas({
        canvas: canvasRef.current,
        ctx: canvasRef.current.getContext("2d", { willReadFrequently: true })!,
      });
    }
  }, [initializeCanvas]);

  return (
    <canvas
      className={`canvas ${useTool.toLowerCase()}`}
      ref={canvasRef}
      onMouseDown={(e) => canvasDrawingHandler({ type: "START", event: e })}
      onMouseMove={(e) => canvasDrawingHandler({ type: "CONTINUE", event: e })}
      onMouseUp={(e) => canvasDrawingHandler({ type: "STOP", event: e })}
      onMouseLeave={(e) => canvasDrawingHandler({ type: "STOP", event: e })}
      onMouseOver={(e) => canvasDrawingHandler({ type: "START", event: e })}
    ></canvas>
  );
};

export default Canvas;
