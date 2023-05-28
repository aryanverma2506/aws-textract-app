import React from "react";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";

interface ErrorModalProps extends React.PropsWithChildren {
  onClear: () => void;
  error: string | null;
}

function ErrorModal(props: ErrorModalProps): React.ReactElement {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={
        <Button className="btn btn-danger" onClick={props.onClear}>
          Okay
        </Button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
}

export default ErrorModal;
