import ExtensionIconImg from "../ExtensionIcon";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { FileTabContext } from "../../context/FileTabContent";

export default function ListDist({ listdir, openFile, deletefileandfolder }) {
  const [expandedFolders, setExpandedFolders] = useState({});
  const { fileData, setFileData } = useContext(FileTabContext);

  // ---------- Context Menu State ----------
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  // Close context menu on click anywhere
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible)
        setContextMenu({ ...contextMenu, visible: false });
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  // ---------- Folder/File Handlers ----------
  const selectFolder = async (folder) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/selectFolder",
        folder
      );
      const subItems = res.data.data || [];
      setExpandedFolders((prev) => ({ ...prev, [folder.path]: subItems }));
    } catch (err) {
      console.error(err);
    }
  };

  const makeFile = async (folder) => {
    const newfilename = prompt("Enter file name:");
    if (!newfilename) return;
    try {
      await axios.post("http://127.0.0.1:5000/makefile", {
        filename: newfilename,
        rootdir: folder.path,
      });
      await selectFolder(folder);
    } catch (err) {
      console.error("Failed to make file:", err);
    }
  };

  const makeFolder = async (folder) => {
    const newfoldername = prompt("Enter folder name:");
    if (!newfoldername) return;
    try {
      await axios.post("http://127.0.0.1:5000/makefolder", {
        foldername: newfoldername,
        rootdir: folder.path,
      });
      await selectFolder(folder);
    } catch (err) {
      console.error("Failed to make folder:", err);
    }
  };

  const readFile = async (file) => {
    await axios
      .post("http://127.0.0.1:5000/ReadFile", { path: file.path })
      .then((res) => setFileData(res.data.content))
      .catch((err) => console.log(err));
  };

  // ---------- Render ----------
  return (
    <div className="simplefileshowig">
      {listdir && listdir.length > 0 ? (
        listdir.map((e, index) => (
          <div key={index} className="listdir">
            <div
              className="fac"
              onClick={() => {
                if (e.type === "directory") {
                  if (expandedFolders[e.path]) {
                    setExpandedFolders((prev) => {
                      const copy = { ...prev };
                      delete copy[e.path];
                      return copy;
                    });
                  } else {
                    selectFolder(e);
                  }
                } else {
                  openFile(e);
                }
              }}
              onContextMenu={(ev) => {
                ev.preventDefault(); // disable browser right-click
                setContextMenu({
                  visible: true,
                  x: ev.clientX,
                  y: ev.clientY,
                  item: e,
                });
              }}
              title={e.name}
            >
              <ExtensionIconImg
                type={e.type}
                extension={e.extension}
                name={e.name}
              />
              <span className="exfile" onClick={() => readFile(e)}>
                {e.name}
              </span>
              {e.type === "directory" && (
               <div className="aicon">
                 <img
                  src={
                    expandedFolders[e.path]
                      ? "/down-arrow.png"
                      : "/left-chevron.png"
                  }
                  alt="arrow"
                />
               </div>
              )}
            </div>

            {/* Nested children */}
            {expandedFolders[e.path] && (
              <div className="nested-folder" style={{ marginLeft: "5px" }}>
                <ListDist
                  listdir={expandedFolders[e.path]}
                  openFile={openFile}
                  deletefileandfolder={deletefileandfolder}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No files</p>
      )}

      {/* Custom context menu */}
      {contextMenu.visible && (
        <div
          className="custom-context-menu"
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <p
            onClick={() => {
              makeFile(contextMenu.item);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            New File
          </p>
          <p
            onClick={() => {
              makeFolder(contextMenu.item);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            New Folder
          </p>
          <p
            onClick={() => {
              deletefileandfolder(contextMenu.item);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
}
