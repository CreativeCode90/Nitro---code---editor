import { createContext, useState } from "react";

export const ModeContext  = createContext()
export const ModeCOntextProvider = (props)=>{
    const [Mode , setMode] = useState('normal')
    return(
        <ModeContext.Provider value={{Mode , setMode}} >
            {
                props.children
            }
        </ModeContext.Provider>
    )
}