import React from 'react'
import { useRef } from 'react'

const UserefHookDOM = () => {
    let buttonref=useRef();
    function clickHandel()
    {
        buttonref.current.style.backgroundColor = "red";
    }
  return (
    <div>
      <button 
      ref={buttonref}
      >Hello</button>
      <button onClick={clickHandel}>Click to change the Color of the 1st button</button>
    </div>
  )
}

export default UserefHookDOM
