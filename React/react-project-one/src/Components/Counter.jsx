import React, { useState } from 'react'
import './Counter.css'


const Counter = (props) => {
  return (
    <div>
        {props.children}
          <button onClick={props.x}>{props.text}</button>
    </div>
    
  )
}
 
export default Counter

