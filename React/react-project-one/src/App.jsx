import './App.css'
import m4 from './assets/m4.jpeg'
import m4f from './assets/m4fool.jpg'
import akm from './assets/akm.webp'
import Counter from './Components/Counter'
import React, { useState } from 'react';
import State_lifting from './Components/State_lifting'

function App() {
  const [val , fun] = useState("");
 
  return (
    <div>
       <State_lifting text="Child#1" val={val} fun={fun}/>
       <State_lifting text="Child#2" val={val} fun={fun}/>
       <p>Parent component: {val}</p>
   </div>
  )
}

export default App
 /* <div className='container'>
      <User_card name="HONEYPOT" desc="1st" image={m4} style={{"border-radius":"10px"}}/>
      <User_card name="honeypot" desc="2st" image={m4f} style={{"border-radius":"10px"}}/>
      <User_card name="honeyPOT" desc="3st" image={akm} style={{"border-radius":"10px"}}/>
      */


/*const [num,set] = useState(0)

  function newfun()
  { 
    set(num+1);
    
  }
    
  
  <Counter x={newfun} text="click me">
        <h1>{num}</h1>
        </Counter> */