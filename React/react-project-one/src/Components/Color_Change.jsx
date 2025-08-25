import React, { useState } from 'react'
import './Color_Chnage.css'

const Color_Change = () => {

    const[click,change] =useState(0)
    const[btn,set] =useState(0)

    const handleButtonClick  = (e)=>
    {
        
        e.stopPropagation();
        set(btn+1);
    }

  return (
    <div onClick={()=>{
        change(click+1);
    }} id='main_div'>
        <p>Num of Clicks on the div is{click}</p>
        <button onClick={handleButtonClick } >Color Change</button>
        <p>Num of Clicks on the button  is{btn}</p>
      
    </div>
  )
}

export default Color_Change
