import "./App.css";
import EditorLayout from "./editor/Editor";
import { FileTabContextProvider } from "./context/FileTabContent";
import { ToolBarContextPoovider } from "./context/ToolbarContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModeCOntextProvider } from "./context/ModeContext";
import File from "./component/File";
function App() {
  return (
    <>
      <FileTabContextProvider>
        <ToolBarContextPoovider>
          <ModeCOntextProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<EditorLayout />}>
                  <Route index element={<File />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ModeCOntextProvider>
        </ToolBarContextPoovider>
      </FileTabContextProvider>
    </>
  );
}

export default App;
