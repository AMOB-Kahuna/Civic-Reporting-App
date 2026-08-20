import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col justify-between bg-slate-50/50 text-[#2d3047]'>
      <Header />
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-base md:text-lg grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;