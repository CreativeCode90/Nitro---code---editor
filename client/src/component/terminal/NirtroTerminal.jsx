import { useState, useEffect, useRef } from "react";
import "./style.css";

export default function NitroTerminal() {
  const [lines, setLines] = useState([
    {
      path: "C:\\Users\\dell\\Desktop\\py\\Nitro - code - editor\\client>",
      command: "",
    },
  ]);

  const lastPromptRef = useRef(null);

  // Always focus on the latest prompt
  useEffect(() => {
    if (lastPromptRef.current) {
      lastPromptRef.current.focus();

      // Move caret to the end
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(lastPromptRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [lines]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = lines[index].command;

      setLines((prev) => [
        ...prev.map((line, i) =>
          i === index ? { ...line, command } : line
        ),
        {
          path: "C:\\Users\\dell\\Desktop\\py\\Nitro - code - editor\\client>",
          command: "",
        },
      ]);
    }
  };

  const handleInput = (e, index) => {
    const text = e.target.innerText;
    setLines((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, command: text } : line
      )
    );

    // keep caret at end
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(e.target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div
      className="nitroterminal"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="terminaltitle">
        <p>nitro terminal</p>
        <img src="../../../public/close.png" alt="close" />
      </div>

      <div className="terminalcommandsprompt">
        {lines.map((line, index) => (
          <div key={index} className="terminalline">
            <div className="terminalpath">
              <p>* {line.path}</p>
            </div>
            <div
              className="terminalprompt"
              ref={index === lines.length - 1 ? lastPromptRef : null}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onInput={(e) => handleInput(e, index)}
            >
              {line.command}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
