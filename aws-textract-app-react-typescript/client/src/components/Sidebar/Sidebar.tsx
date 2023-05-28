import React, { useContext } from "react";

import {
  CanvasContext,
  CanvasContextType,
} from "../../context/Canvas/CanvasContext";
import Input from "../Input/Input";
import Button from "../Button/Button";
import ErrorModal from "../ErrorModal/ErrorModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../hooks/useHttpClient-hook";

interface SidebarProps extends React.PropsWithChildren {
  callback?: Function;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const canvasCtx = useContext<CanvasContextType>(CanvasContext);
  const { isLoading, error, sendRequest, setError, clearError } =
    useHttpClient();
  const {
    canvas,
    canvasWidth,
    canvasHeight,
    penSize,
    penColor,
    eraserSize,
    canvasBgColor,
    canvasActions,
    refreshCanvas,
    canvasStateHandler,
    canvasStorageHandler,
    downloadCanvasHandler,
    loadImage,
    isCanvasEmpty,
  } = canvasCtx;

  function pickImageHandler(file: File) {
    loadImage(file);
  }

  function canvasSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    canvas?.toBlob(async (blob) => {
      if (blob && !isCanvasEmpty()) {
        formData.append("canvasImage", blob, "canvas.png");
        try {
          const responseData = await sendRequest({
            url: `${process.env.REACT_APP_SERVER_URL}/api`,
            method: "POST",
            body: formData,
          });
          props.callback && props.callback(responseData.data);
          refreshCanvas();
          canvasStateHandler({
            type: canvasActions.loadCanvas,
            payloadKey: "drawing",
            value: [],
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setError(
          () => "Canvas submission failed! Make sure canvas is not empty"
        );
      }
    });
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && <LoadingSpinner asOverlay />}
      <form id="canvas-form" className="sidebar" onSubmit={canvasSubmitHandler}>
        <div className="option-section">
          <h4>Tools</h4>
          <Button
            id="pencil"
            type="button"
            label="Pen"
            className="btn btn-default"
            onClick={() =>
              canvasStateHandler({
                type: canvasActions.usePen,
              })
            }
          >
            <i className="glyphicon glyphicon-pencil" aria-hidden="true"></i>
          </Button>
          <Button
            id="eraser"
            type="button"
            label="Eraser"
            className="btn btn-default"
            onClick={() =>
              canvasStateHandler({
                type: canvasActions.useEraser,
              })
            }
          >
            <i className="glyphicon glyphicon-erase" aria-hidden="true"></i>
          </Button>
          <Button
            id="clear-canvas"
            type="button"
            label="Reset"
            className="btn btn-danger"
            onClick={() => {
              refreshCanvas();
              canvasStateHandler({
                type: canvasActions.loadCanvas,
                payloadKey: "drawing",
                value: [],
                doRedraw: true,
              });
            }}
          >
            <i className="glyphicon glyphicon-repeat" aria-hidden="true"></i>
          </Button>
        </div>

        <div className="option-section">
          <h4>Colors & Size</h4>
          <Input
            id="color-picker"
            type="color"
            label="Pen Color"
            className="form-control color-picker"
            value={penColor}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              canvasStateHandler({
                type: canvasActions.changePenColor,
                payloadKey: "penColor",
                value: e.target.value,
              })
            }
          />
          <Input
            id="bg-color-picker"
            type="color"
            label="BG Color"
            className="form-control color-picker"
            value={canvasBgColor}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              canvasStateHandler({
                type: canvasActions.changeCanvasBgColor,
                payloadKey: "canvasBgColor",
                value: e.target.value,
                doRedraw: true,
              })
            }
          />
          <Input
            id="control-pencil-size"
            min={1}
            max={50}
            step={1}
            type="range"
            label={`Pen Size (${penSize})`}
            value={penSize}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              canvasStateHandler({
                type: canvasActions.changePenSize,
                payloadKey: "penSize",
                value: e.target.value,
              })
            }
          />
          <Input
            id="control-eraser-size"
            min={1}
            max={50}
            step={1}
            label={`Eraser Size (${eraserSize})`}
            type="range"
            value={eraserSize}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              canvasStateHandler({
                type: canvasActions.changeEraserSize,
                payloadKey: "eraserSize",
                value: e.target.value,
              })
            }
          />
        </div>

        <div className="option-section">
          <h4>Canvas</h4>
          <Input
            id="width"
            type="number"
            label="Width"
            placeholder="Canvas Width"
            className="form-control size"
            value={canvasWidth}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              canvasStateHandler({
                type: canvasActions.changeCanvasWidth,
                payloadKey: "canvasWidth",
                value: e.target.value,
              })
            }
          />
          <Input
            id="height"
            type="number"
            label="Height"
            placeholder="Canvas Height"
            className="form-control size"
            value={canvasHeight}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              canvasStateHandler({
                type: canvasActions.changeCanvasHeight,
                payloadKey: "canvasHeight",
                value: e.target.value,
              })
            }
          />
          <Button
            id="canvas-update"
            type="button"
            label="Update"
            className="btn btn-success"
            onClick={() => {
              refreshCanvas();
            }}
          >
            <i className="glyphicon glyphicon-refresh" aria-hidden="true"></i>
          </Button>
        </div>

        <div className="option-section">
          <h4>Storage</h4>
          <Button
            id="save-canvas"
            type="button"
            label="Save"
            className="btn btn-success"
            onClick={() => canvasStorageHandler("SAVE")}
          >
            <i
              className="glyphicon glyphicon-floppy-disk"
              aria-hidden="true"
            ></i>
          </Button>
          <Button
            id="load-canvas"
            type="button"
            label="Load"
            className="btn btn-success"
            onClick={() => canvasStorageHandler("LOAD")}
          >
            <i className="glyphicon glyphicon-open-file" aria-hidden="true"></i>
          </Button>
          <Button
            id="clear-canvas-cache"
            type="button"
            label="Clear Cache"
            className="btn btn-danger"
            onClick={() => canvasStorageHandler("CLEAR")}
          >
            <i className="glyphicon glyphicon-trash" aria-hidden="true"></i>
          </Button>
        </div>

        <div className="option-section">
          <h4>Extra</h4>
          <Button
            id="download-canvas"
            type="button"
            label="Download"
            className="btn btn-warning"
            onClick={downloadCanvasHandler}
          >
            <i
              className="glyphicon glyphicon-download-alt"
              aria-hidden="true"
            ></i>
          </Button>
          <Input
            id="upload-canvas"
            type="file"
            style={{
              maxWidth: 0,
              maxHeight: 0,
              opacity: 0,
              position: "absolute",
            }}
            className="btn btn-danger"
            accept=".png, .jpg, .jpeg"
            callback={pickImageHandler}
          >
            <i className="glyphicon glyphicon-open" aria-hidden="true"></i>
          </Input>
          <Button
            id="submit-canvas"
            type="submit"
            label="Submit and Extract"
            className="btn btn-success"
          >
            <i className="glyphicon glyphicon-send" aria-hidden="true"></i>
          </Button>
        </div>
      </form>
    </>
  );
};

export default Sidebar;
