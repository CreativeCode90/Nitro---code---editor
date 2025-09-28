import { useContext } from 'react'
import './ToolBar.css'
import { ToolBarContext } from '../../context/ToolbarContext'
export default function ToolBar() {
    const {terminaltoggle , setTerminalToggle, projectopen , setProjectopen} = useContext(ToolBarContext);
  return (
    <div className="toolbar">
        <div className="tool" onClick={()=>setProjectopen(!projectopen)} >
            <img src="../../../public/blueprint.png" alt="new project" title='new project' />
            <p>project</p>
        </div>
        <div className="tool">
            <img src="../../../public/github.png" alt="github" title='new project' />
            <p>git</p>
        </div>
        <div className="tool" onClick={()=>setTerminalToggle(!terminaltoggle)} >
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
