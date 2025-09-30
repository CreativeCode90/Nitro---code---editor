import { createContext, useState } from "react";

export const ToolBarContext = createContext();

export const ToolBarContextPoovider = (props) =>{
    const [terminaltoggle ,setTerminalToggle] = useState(false);
    const [projectopen , setProjectopen] = useState(true);
    return(
        <ToolBarContext.Provider value={{terminaltoggle , setTerminalToggle, projectopen , setProjectopen}} >
            {props.children}
        </ToolBarContext.Provider>
    )
}