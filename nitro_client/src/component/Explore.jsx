import React, { useEffect, useState, useContext, useRef } from "react";

import { Outlet } from "react-router-dom";

import axios from "axios";

import { FileTabContext } from "../context/FileTabContent";

import ToolBar from "./toolbar/ToolBar";

import ListDist from "./listdir/ListDist";

import NirtroTerminal from "./terminal/NirtroTerminal";

import FileIcon from "/file/file.png";

import { ExtensionIcon } from "./ExtensionIcon";
import { ToolBarContext } from "../context/ToolbarContext";

export default function Explore() {
  const {
    fileopen,
    setFileOpen,
    cursorPos,
    indentInfo,
    workingpath,
    setWorkingpath,
  } = useContext(FileTabContext);
  const { projectopen, setProjectopen } = useContext(ToolBarContext);
  const [folderName, setFolderName] = useState("");

  const [listdir, setListDir] = useState([]);

  const sidebarRef = useRef(null);

  const isResizing = useRef(false);

  const startX = useRef(0);

  const startWidth = useRef(250); // initial width

  const [sidebarWidth, setSidebarWidth] = useState(250);
  console.log(fileopen);

  // ---------- Sidebar Resizer Handlers ----------

  const onMouseDown = (e) => {
    isResizing.current = true;

    startX.current = e.clientX;

    startWidth.current = sidebarWidth;

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isResizing.current) return;

    const dx = e.clientX - startX.current;

    // Limit between 150px (min) and 300px (max)

    setSidebarWidth(Math.min(400, Math.max(200, startWidth.current + dx)));
  };

  const onMouseUp = () => {
    isResizing.current = false;

    document.removeEventListener("mousemove", onMouseMove);

    document.removeEventListener("mouseup", onMouseUp);
  };

  // ---------- Your existing functions ----------

  const OpenPath = async (path) => {
    const choosepath = { path };

    await axios

      .post("http://127.0.0.1:5000/choose", choosepath)

      .then((res) => {
        setFolderName(path);

        fetchDirectory();
      })

      .catch((err) => console.log("Path not valid :", err));
  };

  const fetchDirectory = async () => {
    await axios

      .get("http://127.0.0.1:5000/cd")

      .then((res) => {
        if (res.data.msg === "Directory exists") {
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

      .then((res) => fetchDirectory())

      .catch((err) => console.log("folder not make ", err));
  };

  const makeFile = async () => {
    const newfilename = prompt("Enter File Name ");

    await axios

      .post("http://127.0.0.1:5000/makefile", {
        filename: newfilename,

        rootdir: folderName,
      })

      .then((res) => fetchDirectory())

      .catch((err) => console.log("file not make ", err));
  };

  const deletefileandfolder = async (e) => {
    await axios

      .post("http://127.0.0.1:5000/delete", e)

      .then((res) => fetchDirectory())

      .catch((err) => console.log("data not make ", err));
  };

  return (
    <div className="exporecoroot">
      <ToolBar />

      <div
        className={projectopen ? "exfile" : "exfilehide"}
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px`, minWidth: "150px" }}
      >
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

        {/* Resizer on the right edge */}

        <div className="sidebar-resizer" onMouseDown={onMouseDown}></div>
      </div>

      <div className="filesystem">
        <Outlet />

        <NirtroTerminal
          fetchDirectory={fetchDirectory}
          currentPath={folderName}
        />

        <div className="pannel">
         
          <div className="pn1">
            <p>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </p>

            <p>
              {indentInfo.insertSpaces ? "Spaces" : "Tab"}: {indentInfo.tabSize}
            </p>
          </div>
           {fileopen?.extension && (
            <p>{fileopen.extension.replace(".", "").toUpperCase()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
