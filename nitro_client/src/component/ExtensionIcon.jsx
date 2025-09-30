import FileIcon from "/file/file.png";
import FolderIcon from "../../public/file/open-folder.png";

export const ExtensionIcon = {
  ".html": "/file/html-5.png",
  ".css": "/file/css-3.png",
  ".js": "/file/js.png",
  ".py": "/file/python.png",
  ".txt": "/file/txt.png",
  ".jsx": "/file/physics.png",
  ".json": "/file/json.png",
  ".java": "/file/java.png",
  ".cpp": "/file/c-.png",
  ".c#": "/file/c-sharp.png",
  '.c': "/file/letter-c.png",
  '.md': "/file/substance.png",
  ".pdf" : '/file/pdf.png',
  ".xls":'/file/xls.png',
  ".xlsx":'/file/xls.png',
  '.doc':'/file/word.png',
  '.word':'/file/word.png',
  '.ppt':'/file/ppt.png',
  '.zip':'/file/zip.png',
  '.blend':"/file/blender.png",
  '.blend1':"/file/blender.png",
  '.jpg':'/file/jpg.png',
  '.jpeg':'/file/jpg.png',
  '.png':'/file/png.png',
  '.mp3':'/file/mp3.png',
  '.mp4':'/file/mp4-file.png',
  ".svg":'/file/svg.png',
};


export default function ExtensionIconImg({ type, extension, name }) {
  if (type === "directory") {
    if (name === "public") {
      return (
        <img src="/file/greenfolder.png" alt="folder" />
      );
    } else if (name === "src") {
      return (
         <img src="/file/redfolder.png" alt="folder" />
      );
    } else if (name === "component") {
      return (
       <img src="/file/bluefolder.png" alt="folder" />
      );
    } else if (name === "pages" || name === "page") {
      return (
       <img src="/file/orangefolder.png" alt="folder" />
      );
    }
    return (
      <img src={FolderIcon} alt="folder" />
     
    );
  }

  if (extension && ExtensionIcon[extension]) {
    if (name === "package.json") {
      return <img src="/file/node-js.png" alt="file" className="fileiconclass" />;
    }
    return <img src={ExtensionIcon[extension]} className="fileiconclass" alt={extension} />;
  }

  return <img src={FileIcon} alt="file" className="fileiconclass" />;
}
