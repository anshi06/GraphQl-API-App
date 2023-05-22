import React from "react";
import { NavLink } from "react-router-dom";
import './MainNavigation.css';
const mainNavigation = () => {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>The Nav-Bar</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/auth">Auth</NavLink>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default mainNavigation;
