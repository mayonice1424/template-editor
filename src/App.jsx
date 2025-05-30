import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { ModalProvider } from "./components/modal/modalContext";
import {
  LoadingProvider,
  useLoading,
} from "./components/loading/loadingContext";
import Lottie from "react-lottie";
import loadingAnimation from "./assets/loading.json";
import CodeEditor from "./page/editorComponentAll";
import CodeEditorEditorJS from "./page/editorComponentMarkDown";
import CodeEditorMarkDown from "./page/editorComponentMarkDown";

function App() {
  return (
    <LoadingProvider>
      <AppRoutes />
    </LoadingProvider>
  );
}

function AppRoutes() {
  const { isLoading } = useLoading();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000055] bg-opacity-20 z-50 flex justify-center items-center">
          <Lottie options={defaultOptions} height={100} width={100} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<CodeEditor />} />
        <Route path="/editorjs" element={<CodeEditorEditorJS />} />
        <Route path="/markdown" element={<CodeEditorMarkDown />} />
      </Routes>
    </>
  );
}

export default App;
