import React, { useState } from 'react'
import './Counter.css'


const Counter = () => {
    const [num,manu]=useState(0)
  return (
    <div className='box'>
        <p id='para'>You have clicked this button {num} times:</p>
        <button id='but' onClick={()=>{manu(num+1)}}>Click ME</button>

    </div>
  )
}

export default Counter
