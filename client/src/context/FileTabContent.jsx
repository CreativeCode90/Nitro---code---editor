import { useContext , createContext, useState } from "react";

export const FileTabContext = createContext();

export const FileTabContextProvider = (props)=>{
    const [fileopen , setFileOpen] = useState([]);
    const [fileData , setFileData] = useState('');
    return(
        <FileTabContext.Provider value={{fileopen , setFileOpen , fileData , setFileData}} >
            {props.children}
        </FileTabContext.Provider>
    )
}