import { useState, useRef, useEffect, useContext } from "react";
import "./style.css";
import { FileTabContext } from "../../context/FileTabContent";
export default function NitroTerminal() {
  const { workingpath } = useContext(FileTabContext);

  const [lines, setLines] = useState([
    {
      path: workingpath,
      command: "ls",
      output: "",
    },
  ]);
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

  const [height, setHeight] = useState(200);
  const terminalRef = useRef(null);
  const isResizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  // Refs for each prompt
  const promptRefs = useRef([]);

  // ---------- Resizing Handlers ----------
  const onMouseDown = (e) => {
    isResizing.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isResizing.current) return;
    const dy = startY.current - e.clientY;
    setHeight(Math.max(50, startHeight.current + dy));
  };

  const onMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

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
        const res = await fetch("http://127.0.0.1:5000/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command }),
        });

        const data = await res.json();
        output = data.output || "";
        newPath = data.newPath || newPath;
        
        // Clear command
        if (output === "__CLEAR__") {
          setLines([
            {
              path: newPath,
              command: "",
              output: "",
            },
          ]);
          return;
        }
      } catch (err) {
        output = "Error executing command";
      }

      setLines((prev) => [
        ...prev.map((line, i) =>
          i === index ? { ...line, command, output } : line
        ),
        {
          path: newPath,
          command: "",
          output: "",
        },
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
      <div className="resizer" onMouseDown={onMouseDown}></div>
      <div
        className="nitroterminal"
        ref={terminalRef}
        style={{ height: `${height}px` }}
        onClick={handleTerminalClick}
      >
        <div className="terminaltitle">
          <p>nitro terminal</p>
          <img src="../../../public/close.png" alt="close" />
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
