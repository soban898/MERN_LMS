
import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <div className='bg-gray-200 flex pt-16'>
        <Sidebar />
        <div className='flex-1'>
            <Outlet/>
        </div>
      
    </div>
  )
}

export default Admin
