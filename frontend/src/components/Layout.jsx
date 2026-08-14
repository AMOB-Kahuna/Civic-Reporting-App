import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <Header />
      <main className='min-h-full px-5 py-5 text-xl grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout