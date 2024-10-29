import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React, { useEffect } from 'react';
import './App.css';
import Home from './Home/Home';
import SemanticSearchResult from './Semantic/SemanticSearchResult';
import LexicalSearchResult from './Lexical/LexicalSearchResult';
import Header from './Header/Header';
import About from './About/About';

function App() {
  useEffect(() => {
    document.title = "الباحث القرآني";
  }, [])
  
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/semantic-search/:searchInput" element={<SemanticSearchResult />} />
            <Route path="/lexical-search/:searchInput" element={<LexicalSearchResult />} />
            <Route path="/about" element={<About/>} /> عن المشروع
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;