import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Explore from "./component/Explore";
import File from "./component/File";
import { FileTabContextProvider } from "./context/FileTabContent";
function App() {
  return (
    <>
      <FileTabContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Explore />}>
              <Route index element={<File />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FileTabContextProvider>
    </>
  );
}

export default App;
