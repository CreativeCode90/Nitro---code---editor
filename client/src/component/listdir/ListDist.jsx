import ExtensionIconImg from "../ExtensionIcon";
import axios from "axios";
import { useContext, useState } from "react";
import { FileTabContext } from "../../context/FileTabContent";

export default function ListDist({ listdir, openFile, deletefileandfolder }) {
  const [expandedFolders, setExpandedFolders] = useState({}); // store opened folder contents
  const { fileData, setFileData } = useContext(FileTabContext);

  // fetch children of folder
  const selectFolder = async (folder) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/selectFolder", folder);
      const subItems = res.data.data || [];
      setExpandedFolders((prev) => ({
        ...prev,
        [folder.path]: subItems,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // create new file inside a folder
  const makeFile = async (folder) => {
    const newfilename = prompt("Enter file name:");
    if (!newfilename) return;
    try {
      await axios.post("http://127.0.0.1:5000/makefile", {
        filename: newfilename,
        rootdir: folder.path,
      });
      await selectFolder(folder); // refresh folder contents
    } catch (err) {
      console.error("Failed to make file:", err);
    }
  };

  // create new folder inside a folder
  const makeFolder = async (folder) => {
    const newfoldername = prompt("Enter folder name:");
    if (!newfoldername) return;
    try {
      await axios.post("http://127.0.0.1:5000/makefolder", {
        foldername: newfoldername,
        rootdir: folder.path,
      });
      await selectFolder(folder); // refresh folder contents
    } catch (err) {
      console.error("Failed to make folder:", err);
    }
  };

  // read file
  const readFile = async (file) => {
    await axios
      .post("http://127.0.0.1:5000/ReadFile", {
        path: file.path, // must be inside an object
      })
      .then((res) => setFileData(res.data.content))
      .catch((err) => console.log(err));
  };

  return (
    <div className="simplefileshowig">
      {listdir && listdir.length > 0 ? (
        listdir.map((e, index) => (
          <div key={index} className="listdir">
            {/* main folder/file row */}
            <div
              className="fac"
              onClick={() => {
                if (e.type === "directory") {
                  if (expandedFolders[e.path]) {
                    // collapse if already open
                    setExpandedFolders((prev) => {
                      const copy = { ...prev };
                      delete copy[e.path];
                      return copy;
                    });
                  } else {
                    // expand and load
                    selectFolder(e);
                  }
                } else {
                  openFile(e);
                }
              }}
              title={e.name}
            >
              {e.type === "directory" && (
                <img
                  src={
                    expandedFolders[e.path]
                      ? "../../public/down-arrow.png" // ▼ if open
                      : "../../public/next.png" // ▶ if closed
                  }
                  alt="arrow"
                />
              )}
              <ExtensionIconImg
                type={e.type}
                extension={e.extension}
                name={e.name}
              />
              <span className="exfile" id="filena" onClick={() => readFile(e)}>
                {e.name}
              </span>

              {/* actions */}
              <div className="fileaction">
                {e.type === "directory" ? (
                  <>
                    <img
                      src="../../public/add.png"
                      title="add file"
                      alt="fileadd"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        makeFile(e);
                      }}
                    />
                    <img
                      src="../../public/folderadd.png"
                      alt="folderadd"
                      title="add folder"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        makeFolder(e);
                      }}
                    />
                    <img src="../../public/edit.png" title="rename" alt="rename" />
                    <img
                      src="../../public/delete.png"
                      title="delete"
                      alt="delete"
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        deletefileandfolder(e);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <img src="../../public/edit.png" title="rename" alt="rename" />
                    <img
                      src="../../public/delete.png"
                      title="delete"
                      alt="delete"
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        deletefileandfolder(e);
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* nested children */}
            {expandedFolders[e.path] && (
              <div className="nested-folder" style={{ marginLeft: "20px" }}>
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
    </div>
  );
}
