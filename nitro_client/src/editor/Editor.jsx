import React, { useEffect, useState, useContext } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { FileTabContext } from "../context/FileTabContent";
import ToolBar from "../component/toolbar/ToolBar";
import ListDist from "../component/listdir/ListDist";
import NirtroTerminal from "../component/terminal/NirtroTerminal";
import FileIcon from "/file/file.png";
import { ExtensionIcon } from "../component/ExtensionIcon";
import { ToolBarContext } from "../context/ToolbarContext";
import { ModeContext } from "../context/ModeContext";
import "./Editor.css";
import Animator from "../animator/Animator";

export default function EditorLayout() {
  const {
    fileopen,
    setFileOpen,
    cursorPos,
    indentInfo,
    workingpath,
    setWorkingpath,
  } = useContext(FileTabContext);
  const { projectopen, setProjectopen, terminaltoggle, setTerminalToggle } =
    useContext(ToolBarContext);
  const [folderName, setFolderName] = useState("");
  const [listdir, setListDir] = useState([]);
  const { Mode, setMode } = useContext(ModeContext);
  // ---------- KEYBOARD SHORTCUTS ----------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC → switch to Normal mode
      if (e.key === "Escape") {
        e.preventDefault();
        setMode("normal");
        console.log("Switched to Normal mode ⬅️");
        return;
      }

      // --- Shortcuts only in Normal mode ---
      if (Mode === "normal") {
        // Press "i" → back to Insert mode
        if (e.key.toLowerCase() === "i") {
          e.preventDefault();
          setMode("insert");
          console.log("Switched to Insert mode ✍️");
        }

        // Press "n" → make new folder
        if (e.key.toLowerCase() === "n") {
          e.preventDefault();
          console.log("📂 Vim-style: create folder");
          makeFolder();
        }

        // Press "f" → make new file
        if (e.key.toLowerCase() === "f") {
          e.preventDefault();
          console.log("📄 Vim-style: create file");
          makeFile();
        }

        // Press "d" → delete (just an example, you can adapt)
        if (e.key.toLowerCase() === "t") {
          e.preventDefault();
          setTerminalToggle(!terminaltoggle);
          // You might call deletefileandfolder with selected item
        }
        if (e.key.toLowerCase() === "b") {
          e.preventDefault();
          setProjectopen(!projectopen);
          // You might call deletefileandfolder with selected item
        }

        // Press ":" → open command mode (like :wq)
        if (e.key === ":") {
          e.preventDefault();
          console.log("⚡ Enter command-line mode");
          // You can open a small input at bottom for :w, :q, etc.
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [Mode]);
  console.log(fileopen);

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
    if (!newFoldername) return;

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
    if (!newfilename) return;

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
      .catch((err) => console.log("data not delete ", err));
  };

  return (
    <div className="editor-container">
      <PanelGroup direction="horizontal">
        {/* Left Sidebar */}
        <Panel
          defaultSize={20}
          minSize={15}
          className={projectopen ? "panel sidebar" : "hide"}
        >
          <div className="exfiletool">
            <p>Nitro - Editor </p>

            <input
              type="text"
              onChange={(e) => OpenPath(e.target.value)}
              id="pathopen"
              placeholder="Enter folder path"
            />

            <div className="listdirac">
              <ListDist
                listdir={listdir}
                openFile={openFile}
                deletefileandfolder={deletefileandfolder}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="resize-handle vertical" />

        {/* Middle Panel with nested vertical split */}
        <Panel defaultSize={90}>
          <PanelGroup direction="vertical">
            {/* Editor Area */}
            <Panel defaultSize={60} minSize={40} className="panel editor">
              <Outlet />
            </Panel>

            <PanelResizeHandle className="resize-handle horizontal" />

            {/* Bottom Terminal */}
            <Panel
              defaultSize={25}
              minSize={15}
              className={terminaltoggle ? "hide" : "panel terminal"}
            >
              <NirtroTerminal
                fetchDirectory={fetchDirectory}
                currentPath={folderName}
              />
            </Panel>

            {/* Fixed Bottom Panel (no resize) */}
            <div className="pannelbotton">
              <div className="pn1">
                <p>
                  <span className="ln">ln</span>{" "}
                  <span className="ln">{cursorPos.line}</span>{" "}
                  <span className="col">Col</span>{" "}
                  <span className="col">{cursorPos.col}</span>
                </p>

                <p className="inspace">
                  {indentInfo.insertSpaces ? "Spaces" : "Tab"}:{" "}
                  {indentInfo.tabSize}
                </p>
                 {fileopen?.extension && (
                <p className="usefilelang">
                  {fileopen.extension.replace(".", "").toUpperCase()}
                </p>
              )}
              </div>
             
              <Animator/>
              <div className="modetype">
                <p>
                  <span
                    className={
                      Mode === "normal"
                        ? "modetypecolor"
                        : "modetypecolorinsert"
                    }
                  >
                    {Mode}
                  </span>{" "}
                  mode{" "}
                </p>
              </div>
            </div>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="resize-handle vertical" />
        {/* <Panel defaultSize={60} minSize={20} className="panel editor">
          {fileopen?.extension === ".html" ? (
            <iframe
              src={`http://127.0.0.1:5000/preview?path=${encodeURIComponent(
                fileopen.path
              )}`}
              style={{ width: "100%", height: "100%", border: "0" }}
              title="HTML Preview"
            />
          ) : (
            <p style={{ padding: "10px" }}>
              No preview available for {fileopen?.extension}
            </p>
          )}
        </Panel> */}

        <ToolBar />
      </PanelGroup>
      
    </div>
  );
}
