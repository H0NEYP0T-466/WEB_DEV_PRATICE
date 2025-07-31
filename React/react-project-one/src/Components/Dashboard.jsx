import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      Dashboard page
     <Outlet />
     </div>
  )
}

export default Dashboard
