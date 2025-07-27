import React from 'react'
import './User_card.css'
import pharoh from '../assets/m4.jpeg'


const user_card = (props) => {
  return (
    <div className='class'>
      <p id='user-name'>{props.name}</p>
      <img id='user-image' src={pharoh} alt="" />
      <p id='user-description'>THIS IS HONEYPOT DESCRIPTION</p>
      
    </div>
  )
}

export default user_card
