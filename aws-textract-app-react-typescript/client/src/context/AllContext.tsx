import React from "react";

import CanvasProvider from "./Canvas/CanvasProvider";

const AllContext: React.FC<React.PropsWithChildren> = (props) => {
  return <CanvasProvider children={props.children} />;
};

export default AllContext;
