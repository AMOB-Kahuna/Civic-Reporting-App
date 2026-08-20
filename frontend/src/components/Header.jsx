import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <header className="py-5 flex flex-col justify-center items-center gap-3 bg-[#f5e3b0]">
      <h1 className="text-3xl">
        <Link to="/">
          <span className="text-[#266907] font-black">Naija</span>Report
        </Link>
      </h1>

      {!isLoginPage && (
        <nav className="w-full flex justify-around items-center bg-[#e8f1fa] py-2 text-base font-medium">
          <NavLink
            to="/make-report"
            className={({ isActive }) => (isActive ? 'text-[#266907] font-bold' : 'hover:text-[#266907]')}
          >
            Report Issue
          </NavLink>
          <p className="text-gray-400">|</p>
          <NavLink
            to="/reports"
            className={({ isActive }) => (isActive ? 'text-[#266907] font-bold' : 'hover:text-[#266907]')}
          >
            Reports
          </NavLink>
          <p className="text-gray-400">|</p>
          <NavLink
            to="/terms"
            className={({ isActive }) => (isActive ? 'text-[#266907] font-bold' : 'hover:text-[#266907]')}
          >
            Terms of Service
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;