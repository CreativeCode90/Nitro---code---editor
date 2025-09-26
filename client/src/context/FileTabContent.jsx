import { useContext, createContext, useState } from "react";

export const FileTabContext = createContext();

export const FileTabContextProvider = (props) => {
  const [fileopen, setFileOpen] = useState([]);
  const [workingpath, setWorkingpath] = useState("");
  const [fileData, setFileData] = useState("");
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [indentInfo, setIndentInfo] = useState({
    tabSize: 4,
    insertSpaces: true,
  });
  return (
    <FileTabContext.Provider
      value={{
        fileopen,
        setFileOpen,
        fileData,
        setFileData,
        cursorPos,
        setCursorPos,
        indentInfo,
        setIndentInfo,
        workingpath,
        setWorkingpath,
      }}
    >
      {props.children}
    </FileTabContext.Provider>
  );
};
