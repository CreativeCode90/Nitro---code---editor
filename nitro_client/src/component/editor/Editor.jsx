import React from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import './style.css'
export default function EditorLayout() {
  return (
    <div className="editor-container">
      <PanelGroup direction="horizontal">
        {/* Left Sidebar */}
        <Panel defaultSize={20} minSize={15} className="panel sidebar">
          <div className="panel-content">📂 File Explorer</div>
        </Panel>

        <PanelResizeHandle className="resize-handle vertical" />

        {/* Middle Panel with nested vertical split */}
        <Panel defaultSize={80}>
          <PanelGroup direction="vertical">
            {/* Editor Area */}
            <Panel defaultSize={70} minSize={50} className="panel editor">
              <div className="panel-content">📝 Code Editor</div>
            </Panel>

            <PanelResizeHandle className="resize-handle horizontal" />

            {/* Bottom Terminal */}
            <Panel defaultSize={30} minSize={20} className="panel terminal">
              <div className="panel-content">💻 Terminal / Output</div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
