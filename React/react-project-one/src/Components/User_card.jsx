import React from 'react'
import './User_card.css'

const user_card = (props) => {
  return (
    <div className='class' style={props.style}>
      <p id='user-name'>{props.name}</p>
      <img id='user-image' src={props.image} alt="" />
      <p id='user-description'>{props.desc}</p>
      
    </div>
  )
}

export default user_card
