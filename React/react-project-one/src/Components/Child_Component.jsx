import React from 'react'

const Child_Component = (props) => {
    console.log("Child Component Rendered");
  return (
    <div>
      <button>{props.name}</button>
    
    </div>
  )
}

export default Child_Component
