import React from 'react'
import  { use, useState,useEffect } from 'react';


const Useeffect = () => {
    const[count,set] =useState(0)
    
   
       useEffect(() => {
        console.log("hello")

        return()=>
        {
            console.log("Dis-mounted from the UI")
        };
  },
  
   [count]);
  return(
   <div>
    <p>the value is{count}</p>
    <button onClick={()=>set(count+1)}>Click me</button>
   </div>
  )
}

export default Useeffect
