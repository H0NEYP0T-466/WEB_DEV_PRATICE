import React from 'react'
import './New_card.css'

const New_card = (props) => {
  return (
    <div id='newcard'>
        <p>{props.name}</p>
        <p>{props.children}</p>
    </div>
  )
}

export default New_card
