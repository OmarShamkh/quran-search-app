import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Ensure to include the correct path to your CSS file for header styles

function Header() {
  return (
    <header className="app-header">
      <Link to="/">
        <img src="https://equran.me/assets/-images/logo-x.png" alt="App Logo" className="app-logo" />
      </Link>
      <h2 className="app-name">الباحث القرآني</h2>
      <nav>
        <ul className="nav-links">
          <li><Link to="/about">من نحن</Link></li>
          <li><Link to="/">الرئيسية</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
