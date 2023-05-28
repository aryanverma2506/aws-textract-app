import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "../Backdrop/Backdrop";
import Button from "../Button/Button";

interface ModalOverlayProps extends React.PropsWithChildren {
  header: string;
  footer: React.ReactNode;
  onCancel: () => void;
  style?: Object;
  className?: string;
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
  onSubmit?: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = (props) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
        <Button className="btn" onClick={props.onCancel}>
          <i
            className="glyphicon glyphicon-remove"
            style={{ color: "white" }}
          ></i>
        </Button>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(
    content,
    document.getElementById("modal") as HTMLDivElement
  );
};

interface ModalProps extends ModalOverlayProps {
  show: boolean;
}

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames={{
          enter: "modal-enter",
          enterActive: "modal-enter-active",
          exit: "modal-exit",
          exitActive: "modal-exit-active",
        }}
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
