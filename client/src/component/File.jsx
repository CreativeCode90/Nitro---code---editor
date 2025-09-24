import React, { useContext, useState, useEffect } from "react";
import { FileTabContext } from "../context/FileTabContent";
import Editor, { useMonaco } from "@monaco-editor/react";

export default function File() {
    const { fileopen, fileData, setFileData, setFileOpen } =
        useContext(FileTabContext);
    const [saving, setSaving] = useState(false);
    const [theme, setTheme] = useState("vs-dark"); // 🔥 user-selectable theme
    const monaco = useMonaco();
    // Map extensions to Monaco languages
    const getLanguage = (ext) => {
        const map = {
            ".js": "javascript",
            ".jsx": "javascript",
            ".ts": "typescript",
            ".tsx": "typescript",
            ".py": "python",
            ".json": "json",
            ".html": "html",
            ".css": "css",
            ".txt": "plaintext",
        };
        return map[ext] || "plaintext";
    };

    // Save file to backend
    const saveFile = async () => {
        if (!fileopen?.path) return;
        setSaving(true);
        try {
            const res = await fetch("http://127.0.0.1:5000/WriteFile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    path: fileopen.path,
                    content: fileData,
                }),
            });

            const result = await res.json();
            console.log("Save result:", result);
            alert(result.msg || "Saved!");
        } catch (error) {
            console.error("Error saving file:", error);
            alert("Failed to save file.");
        }
        setSaving(false);
    };

    // Close tab
    const closeTab = () => {
        setFileOpen({}); // Reset fileopen when closing tab
        setFileData(""); // Clear editor
    };

    // Automatically set tab title when file changes
    useEffect(() => {
        document.title = fileopen?.name ? `Editing: ${fileopen.name}` : "Editor";
    }, [fileopen]);

    // ✅ Register multiple themes
    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme("dracula", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { token: "comment", foreground: "6272a4" },
                    { token: "keyword", foreground: "ff79c6" },
                    { token: "string", foreground: "f1fa8c" },
                    { token: "number", foreground: "bd93f9" },
                ],
                colors: {
                    "editor.background": "#282a36",
                },
            });

            monaco.editor.defineTheme("solarized-light", {
                base: "vs",
                inherit: true,
                rules: [
                    { token: "comment", foreground: "93a1a1" },
                    { token: "keyword", foreground: "268bd2" },
                    { token: "string", foreground: "2aa198" },
                    { token: "number", foreground: "d33682" },
                ],
                colors: {
                    "editor.background": "#fdf6e3",
                },
            });

            monaco.editor.defineTheme("ocean-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { token: "keyword", foreground: "c594c5" },
                    { token: "string", foreground: "99c794" },
                    { token: "number", foreground: "f99157" },
                ],
                colors: {
                    "editor.background": "#1b2b34",
                },
            });
        }
    }, [monaco]);

    return (
        <div className="filem">
            {/* Tab bar */}
            <div className="tabbar">
                {fileopen?.name ? (
                    <div className="tabfile">
                        <p className="filename" title={fileopen.path}>
                            <img src={fileopen.icon} alt="" title={fileopen.path} />
                            {fileopen.name}
                        </p>
                        <button
                            onClick={saveFile}
                            disabled={saving}
                            className="savingbutton"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>

                        <img
                            src="../../public/close.png"
                            alt="close tab"
                            onClick={closeTab}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                ) : (
                    <p className="no-file">Empty</p>
                )}
                                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="theme-select"
                        >
                            <option value="vs-dark">Dark</option>
                            <option value="vs">Light</option>
                            <option value="hc-black">High Contrast</option>
                            <option value="dracula">Dracula</option>
                            <option value="solarized-light">Solarized Light</option>
                            <option value="ocean-dark">Ocean Dark</option>
                        </select>
            </div>

            {/* File Editor */}
            <div className="fileeditor">
                {fileopen?.type === "file" &&
                    [".txt", ".js", ".py", ".json", ".html", ".css", ".jsx"].includes(
                        fileopen.extension
                    ) && (
                        <Editor
                            theme={theme}
                            language={getLanguage(fileopen.extension)}
                            value={fileData}
                            onChange={(newValue) => setFileData(newValue)}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                wordWrap: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    )}
            </div>
        </div>
    );
}
