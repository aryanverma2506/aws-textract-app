import React, { useContext, useEffect, useRef } from "react";

import {
  CanvasContext,
  CanvasContextType,
} from "../../context/Canvas/CanvasContext";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    useTool,
    initializeCanvas,
    canvasMouseDrawingHandler,
    canvasTouchDrawingHandler,
  } = useContext<CanvasContextType>(CanvasContext);

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
      onMouseDown={(e) =>
        canvasMouseDrawingHandler({ type: "START", event: e })
      }
      onMouseMove={(e) =>
        canvasMouseDrawingHandler({ type: "CONTINUE", event: e })
      }
      onMouseUp={(e) => canvasMouseDrawingHandler({ type: "STOP", event: e })}
      onMouseLeave={(e) =>
        canvasMouseDrawingHandler({ type: "STOP", event: e })
      }
      onMouseOver={(e) =>
        canvasMouseDrawingHandler({ type: "START", event: e })
      }
      onTouchStart={(e) =>
        canvasTouchDrawingHandler({ type: "START", event: e })
      }
      onTouchMove={(e) =>
        canvasTouchDrawingHandler({ type: "CONTINUE", event: e })
      }
      onTouchEnd={(e) => canvasTouchDrawingHandler({ type: "STOP", event: e })}
    ></canvas>
  );
};

export default Canvas;
