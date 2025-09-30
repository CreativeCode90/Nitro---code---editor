import { useState, useRef, useEffect, useContext } from "react";
import "./style.css";
import { FileTabContext } from "../../context/FileTabContent";
import { ToolBarContext } from "../../context/ToolbarContext";
export default function NitroTerminal({ fetchDirectory, currentPath }) {
  const { workingpath } = useContext(FileTabContext);
  const {terminaltoggle , setTerminalToggle} = useContext(ToolBarContext);
  const [lines, setLines] = useState([
    {
      path: workingpath,
      command: "ls",
      output: "",
    },
  ]);
   useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // 1️⃣ Update lines when workingpath changes
  useEffect(() => {
    setLines((prev) => {
      // Update the first line's path if it's empty or different
      if (prev.length > 0) {
        const firstLine = prev[0];
        if (!firstLine.path || firstLine.path !== workingpath) {
          return [{ ...firstLine, path: workingpath }, ...prev.slice(1)];
        }
      }
      return prev;
    });

  }, [workingpath]);

  // Refs for each prompt
  const promptRefs = useRef([]);


  // ---------- Focus Helpers ----------
  const focusPrompt = (index) => {
    const prompt = promptRefs.current[index];
    if (prompt) {
      prompt.focus();
      placeCaretAtEnd(prompt);
    }
  };

  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // ---------- Always focus last prompt on lines update ----------
  useEffect(() => {
    focusPrompt(lines.length - 1);
  }, [lines]);

  // ---------- Terminal Input Handlers ----------
  const handleKeyDown = async (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = lines[index].command.trim();
      let output = "";
      let newPath = lines[index].path;

      try {
        // --- Custom commands handled here ---
        if (command.startsWith("mkdir ")) {
          const folderName = command.split(" ")[1];
          await fetch("http://127.0.0.1:5000/makefolder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              foldername: folderName,
              rootdir: currentPath,
            }),
          });
          fetchDirectory(); // refresh explorer
          output = `Folder '${folderName}' created`;
        } else if (command.startsWith("touch ")) {
          const fileName = command.split(" ")[1];
          await fetch("http://127.0.0.1:5000/makefile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: fileName, rootdir: currentPath }),
          });
          fetchDirectory(); // refresh explorer
          output = `File '${fileName}' created`;
        } else if (command.startsWith("rm ")) {
          const target = command.split(" ")[1];
          await fetch("http://127.0.0.1:5000/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: target }),
          });
          fetchDirectory();
          output = `'${target}' deleted`;
        } else {
          // --- Fallback: send to backend terminal API ---
          const res = await fetch("http://127.0.0.1:5000/terminal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command }),
          });
          const data = await res.json();
          output = data.output || "";
          newPath = data.newPath || newPath;
           fetchDirectory(); // refresh explorer

          if (output === "__CLEAR__") {
            setLines([{ path: newPath, command: "", output: "" }]);
            return;
          }
        }
      } catch (err) {
        output = "Error executing command: " + err.message;
      }

      // Update lines
      setLines((prev) => [
        ...prev.map((line, i) =>
          i === index ? { ...line, command, output } : line
        ),
        { path: newPath, command: "", output: "" },
      ]);
    }
  };

  const handleInput = (e, index) => {
    const text = e.target.innerText;
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, command: text } : line))
    );
  };

  // ---------- Always focus last prompt on click ----------
  const handleTerminalClick = () => {
    focusPrompt(lines.length - 1);
  };

  return (
    <div className="nitroterminal-wrapper">
      <div
        className="nitroterminal"
        onClick={handleTerminalClick}
      >
        <div className="terminaltitle">
          <p>nitro terminal</p>
          <img src="../../../public/close.png" alt="close" onClick={()=>setTerminalToggle(!terminaltoggle)} />
        </div>

        <div className="terminalcommandsprompt">
          {lines.map((line, index) => (
            <div key={index} className="terminalline">
              <div className="prompt">
                <div className="terminalpath">
                  <p>
                    * {line.path} {">"}{" "}
                  </p>
                </div>
                <div
                  className="terminalprompt"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onInput={(e) => handleInput(e, index)}
                  ref={(el) => (promptRefs.current[index] = el)}
                >
                  {line.command}
                </div>
              </div>
              {line.output && (
                <div className="terminaloutput">
                  <pre>{line.output}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
