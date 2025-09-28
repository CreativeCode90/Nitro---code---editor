import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Explore from "./component/Explore";
import File from "./component/File";
import { FileTabContextProvider } from "./context/FileTabContent";
import { ToolBarContextPoovider } from "./context/ToolbarContext";
function App() {
  return (
    <>
      <FileTabContextProvider>
        <ToolBarContextPoovider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Explore />}>
              <Route index element={<File />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ToolBarContextPoovider>
      </FileTabContextProvider>
    </>
  );
}

export default App;
