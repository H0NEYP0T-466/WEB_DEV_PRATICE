import React from 'react'
import { useContext } from 'react'
import { UserContent } from '../App'

const Child_3 = () => {
  const user= useContext(UserContent);
  return (
    <div>
      {user.name}
    </div>
  )
} 

export default Child_3
