import React from 'react'
import { Link } from 'react-router'

const Navbar =  () => {
  return (
    <nav className='navbar'>
     <Link to= "/">
        <p className='text-2xl font-bold text-gradient'>AIxANALYZER</p>
        </Link>
        <Link to="/upload" className='primary-button w-fit'>
        Drop ur 23 year 
     </Link>
        </nav>
  )
 
 
}

export default Navbar