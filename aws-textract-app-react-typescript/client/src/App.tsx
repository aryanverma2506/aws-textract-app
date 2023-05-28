import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Canvas from "./components/Canvas/Canvas";
import Result from "./components/Result/Result";

const App: React.FC = () => {
  const [result, setResult] = useState<string>("");
  return (
    <>
      <h1>AWS TEXTRACT REACT APP</h1>
      <p>Welcome to AWS TEXTRACT REACT APP</p>
      <div className="playground">
        <Sidebar callback={setResult} />
        <Canvas />
      </div>
      <Result result={result} clearResult={setResult} />
    </>
  );
};

export default App;
