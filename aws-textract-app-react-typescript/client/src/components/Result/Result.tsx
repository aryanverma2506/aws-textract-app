import React from "react";

import Input from "../Input/Input";
import Button from "../Button/Button";

interface ResultProps extends React.PropsWithChildren {
  result: string;
  clearResult: Function;
}

const Result: React.FC<ResultProps> = (props) => {
  return (
    <div className="output">
      <h4>Result</h4>
      <Input
        id="result"
        type="text"
        value={props.result}
        disabled
        className="form-control"
      />
      <Button
        id="clear-result"
        type="button"
        className="btn btn-warning"
        onClick={() => props.clearResult("")}
      >
        Clear Result
      </Button>
    </div>
  );
};

export default Result;
