import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [searchInput, setSearchInput] = useState('');

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="index-form">
      <form>
        <img className="index-logo" src="/quran-logo2.png" alt="logo" />
        <div className="input-container">
          <input
            className="index-input"
            dir="rtl"
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="ابحث في القرآن الكريم..."
          />
          <div className="button-container">
            <Link to={`/semantic-search/${searchInput}`}>
              <button className="index-button">بحث بالمعنى</button>
            </Link>
            <Link to={`/lexical-search/${searchInput}`}>
              <button className="index-button">بحث باللفظ</button>
            </Link>
          </div>
        </div>
      </form>

      <p>© 2023 Quranic Search App</p>
    
    </div>
  );
}

export default Home;
