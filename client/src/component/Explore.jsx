import React, { useEffect, useState, useContext } from "react";

import { Outlet } from "react-router-dom";

import axios from "axios";

import { FileTabContext } from "../context/FileTabContent";

import ToolBar from "./toolbar/ToolBar";

import ExtensionIconImg from "./ExtensionIcon";

import FileIcon from "../../public/file.png";

import { ExtensionIcon } from "./ExtensionIcon";

import ListDist from "./listdir/ListDist";
import NirtroTerminal from "./terminal/NirtroTerminal";

export default function Explore() {
  const {setFileOpen,cursorPos,indentInfo,workingpath,
        setWorkingpath,} = useContext(FileTabContext);

  const [folderName, setFolderName] = useState("");

  const [listdir, setListDir] = useState([]); // store API result

  // send chosen folder path to backend

  const OpenPath = async (path) => {
    const choosepath = { path: path };

    await axios

      .post("http://127.0.0.1:5000/choose", choosepath)

      .then((res) => {
        setFolderName(path);

        // after setting, reload contents

        fetchDirectory();
      })

      .catch((err) => console.log("Path not valid :", err));
  };

  // fetch directory contents

  const fetchDirectory = async () => {
    await axios

      .get("http://127.0.0.1:5000/cd")

      .then((res) => {
        console.log("Directory contents:", res.data);

        if (
          res.data.status === "success" ||
          res.data.msg === "Directory exists"
        ) {
          setListDir(res.data.data);
          setWorkingpath(res.data.dir);
        
          
        } else {
          setListDir([]);
        }
      })

      .catch((err) => console.log("Error fetching dir:", err));
  };


  useEffect(() => {
    fetchDirectory();
  }, []);

  const openFile = (fileObj) => {
    const fileopendata = {
      extension: fileObj.extension,
      name: fileObj.name,
      path: fileObj.path,
      type: fileObj.type,
      icon: ExtensionIcon[fileObj.extension] || FileIcon,
    };

    setFileOpen(fileopendata);
   
    
  };

  const makeFolder = async () => {
    const newFoldername = prompt("Enter Foldername");

    await axios

      .post("http://127.0.0.1:5000/makefolder", {
        foldername: newFoldername,

        rootdir: folderName,
      })

      .then((res) => {
        fetchDirectory();
      })

      .catch((err) => console.log("folder not make ", err));
  };

  const makeFile = async () => {
    const newfilename = prompt("Enter File Name ");

    await axios

      .post("http://127.0.0.1:5000/makefile", {
        filename: newfilename,

        rootdir: folderName,
      })

      .then((res) => {
        fetchDirectory();
      })

      .catch((err) => console.log("folder not make ", err));
  };

  const deletefileandfolder = async (e) => {
    await axios

      .post("http://127.0.0.1:5000/delete", e)

      .then((res) => {
        fetchDirectory();
      })

      .catch((err) => console.log("data not make ", err));
  };

  return (
    <div className="exporecoroot">
      <ToolBar />
      <div className="exfile">
        <p>Nitro - Editor </p>

        <input
          type="text"
          onChange={(e) => OpenPath(e.target.value)}
          id="pathopen"
          placeholder="Enter folder path"
        />

        <div className="action">
          <button id="file" onClick={makeFile}>
            file
          </button>

          <button id="folder" onClick={makeFolder}>
            folder
          </button>
        </div>

        <div className="listdirac">
          <ListDist
            listdir={listdir}
            openFile={openFile}
            deletefileandfolder={deletefileandfolder}
          />
        </div>
      </div>

      <div className="filesystem">
        <Outlet />
        <NirtroTerminal/>
        <div className="pannel">
          <div className="pn1">
            <p>
            Ln {cursorPos.line}, Col {cursorPos.col}  
          </p>
          <p>
            {indentInfo.insertSpaces ? "Spaces" : "Tab"}: {indentInfo.tabSize}
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
