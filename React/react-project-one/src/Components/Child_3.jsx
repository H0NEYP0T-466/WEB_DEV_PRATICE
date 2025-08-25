import React from 'react'
import { useContext } from 'react'
import { UserContent } from '../App'

const Child_3 = () => {
  const {user,setUser}= useContext(UserContent);
  function changeTheme() {
    setUser({name: user.name === "Light" ? "Dark" : "Light"});
  }
  return (
    <div>
      <button onClick={changeTheme}>Change Theme</button>
    </div>
  )
} 

export default Child_3
