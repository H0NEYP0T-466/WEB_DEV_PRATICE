import React from 'react'

const State_lifting = (props) => {
  return (
    <div>
        <p>{props.text}</p>
        <p>the value is the child {props.text} is {props.val}</p>  
        <input type="text" onChange={(e)=> props.fun(e.target.value)}/>
        
       
      
    </div>
  )
}

export default State_lifting
