import React from "react";
import ReactDOM from "react-dom";

interface LoadingSpinnerProps extends React.PropsWithChildren {
  asOverlay?: boolean;
}

function LoadingSpinner(props: LoadingSpinnerProps): React.ReactPortal {
  return ReactDOM.createPortal(
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div className="lds-dual-ring"></div>
    </div>,
    document.getElementById("loading") as HTMLDivElement
  );
}

export default LoadingSpinner;
