import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className='py-5 flex flex-col justify-center items-center gap-3 bg-[#f5e3b0]'>
      <h1 className='text-3xl'><a href='/'><span className='text-[#266907] font-black'>Naija</span>Report</a></h1>

      <nav className='w-full flex justify-around bg-[#e8f1fa]'>
        <NavLink
          to='/make-report'
          className={({isActive}) => 
            isActive ? 'text-[#266907]' :''
          }
        >Report Issue</NavLink>
        <p>|</p>
        <NavLink
          to='/reports'
          className={({isActive}) => 
            isActive ? 'text-[#266907]' :''
          }
        >Reports</NavLink>
        <p>|</p>
        <NavLink
          to='/terms'
          className={({isActive}) => 
            isActive ? 'text-[#266907]' :''
          }
        >Terms of Service</NavLink>
      </nav>
    </header>
  )
}

export default Header