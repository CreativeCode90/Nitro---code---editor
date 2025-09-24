import FileIcon from "../../public/file.png";
import FolderIcon from "../../public/folder.png";

export const ExtensionIcon = {
  ".html": "/html-5.png",
  ".css": "/css-3.png",
  ".js": "/public/js.png",
  ".py": "/public/python.png",
  ".txt": "/public/file.png",
  ".jsx": "/public/physics.png",
  ".json": "/json.png",
  ".java": "/java.png",
  ".cpp": "/c-.png",
  ".c#": "/c-sharp.png",
  '.c': "../../public/letter-c.png",
  '.md': "/substance.png",
};

export default function ExtensionIconImg({ type, extension, name }) {
  if (type === "directory") {
    if (name === "public") {
      return (
        <img src="../../public/greenfolder.png" alt="folder" />
      );
    } else if (name === "src") {
      return (
         <img src="../../public/redfolder.png" alt="folder" />
      );
    } else if (name === "component") {
      return (
       <img src="../../public/bluefolder.png" alt="folder" />
      );
    } else if (name === "pages" || name === "page") {
      return (
       <img src="../../public/orangefolder.png" alt="folder" />
      );
    }
    return (
      <img src={FolderIcon} alt="folder" />
     
    );
  }

  if (extension && ExtensionIcon[extension]) {
    if (name === "package.json") {
      return <img src="../../public/node-js.png" alt="file" className="fileiconclass" />;
    }
    return <img src={ExtensionIcon[extension]} className="fileiconclass" alt={extension} />;
  }

  return <img src={FileIcon} alt="file" className="fileiconclass" />;
}
