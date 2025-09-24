import React from 'react'
import './ToolBar.css'
export default function ToolBar() {
  return (
    <div className="toolbar">
        <div className="tool">
            <img src="../../../public/blueprint.png" alt="new project" title='new project' />
            <p>project</p>
        </div>
        <div className="tool">
            <img src="../../../public/github.png" alt="github" title='new project' />
            <p>git</p>
        </div>
        <div className="tool">
            <img src="../../../public/terminal.png" alt="github" title='new project' />
            <p>terminal</p>
        </div>
        <div className="tool">
            <img src="../../../public/theme.png" alt="github" title='new project' />
            <p>theme</p>
        </div>
    </div>
  )
}
