import React from "react";
import ReactDOM from "react-dom";

interface BackdropProps extends React.PropsWithChildren {
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick} />,
    document.getElementById("backdrop") as HTMLElement
  );
};

export default Backdrop;
