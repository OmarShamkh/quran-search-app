import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Arabic and English patterns
  const arabicPattern = /^[\u0600-\u06FF\s\u064B-\u0652]+$/;
  const englishPattern = /^[a-zA-Z\s.,'-]+$/;

  const validateArabicText = useCallback((text) => {
    const commonInvalidPatterns = [
      /([^\u0621-\u063A\u0641-\u064A])\1{2,}/, // Repeated non-Arabic letters
      /\d+/, // Numbers
    ];

    for (let pattern of commonInvalidPatterns) {
      if (pattern.test(text)) {
        setValidationMessage('الرجاء إدخال كلمات عربية صحيحة');
        setIsValid(false);
        return false;
      }
    }

    setValidationMessage('');
    setIsValid(true);
    return true;
  }, []);

  const validateInput = useCallback((value) => {
    // Remove extra spaces and normalize Arabic characters
    const normalizedValue = value.trim().replace(/\s+/g, ' ');
    
    if (normalizedValue.length < 2) {
      setValidationMessage('الرجاء إدخال كلمتين على الأقل');
      setIsValid(false);
      return false;
    }

    // Check if input is Arabic
    if (arabicPattern.test(normalizedValue)) {
      return validateArabicText(normalizedValue);
    }
    // Check if input is English
    else if (englishPattern.test(normalizedValue)) {
      setValidationMessage('الرجاء الكتابة باللغة العربية');
      setIsValid(false);
      return false;
    }
    // Invalid characters
    else {
      setValidationMessage('الرجاء إدخال نص صحيح باللغة العربية');
      setIsValid(false);
      return false;
    }
  }, [validateArabicText]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Debounced input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput) {
        validateInput(searchInput);
      } else {
        setValidationMessage('');
        setIsValid(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, validateInput]);

  const handleSearch = useCallback((type) => {
    if (!searchInput.trim() || !isValid) return;

    setIsLoading(true);
    
    const newRecentSearches = [
      searchInput,
      ...recentSearches.filter(search => search !== searchInput)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    navigate(`/${type}-search/${encodeURIComponent(searchInput)}`);
  }, [searchInput, isValid, recentSearches, navigate]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchInput(suggestion);
    setSuggestions([]);
    searchInputRef.current?.focus();
  }, []);

  const handleRecentSearchClick = useCallback((search) => {
    setSearchInput(search);
    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="home">
      <div className="islamic-pattern-overlay"></div>
      
      <div className="home-content">
        <section className="logo-section">
          <div className="logo-container">
            <div className="logo-ring"></div>
            <div className="main-logo">
              <span className="logo-arabic">الباحث القرآني</span>
            </div>
          </div>
          <h2 className="quran-verse">
            إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
          </h2>
        </section>

        <section className="search-section">
          <div className="search-container">
            <form 
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch('semantic');
              }}
            >
              <div className="input-wrapper">
                <input
                  ref={searchInputRef}
                  type="text"
                  className={`search-input ${validationMessage ? 'error' : isValid ? 'valid' : ''}`}
                  placeholder="ابحث في القرآن الكريم..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  dir="rtl"
                />
                {validationMessage && (
                  <div className="validation-message show">
                    {validationMessage}
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                        type="button"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="search-button"
                disabled={isLoading || !searchInput.trim() || !isValid}
              >
                {isLoading ? (
                  <div className="loader"></div>
                ) : (
                  <svg className="search-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                )}
              </button>
            </form>
          </div>

          <div className="search-options">
            <button 
              className="option-button lexical-button"
              onClick={() => handleSearch('lexical')}
              disabled={isLoading || !searchInput.trim() || !isValid}
            >
              <span>البحث باللفظ</span>
            </button>
            <button 
              className="option-button semantic-button"
              onClick={() => handleSearch('semantic')}
              disabled={isLoading || !searchInput.trim() || !isValid}
            >
              <span>البحث بالمعنى</span>
            </button>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            {recentSearches.length > 0 && (
              <div className="recent-searches">
                <h3>عمليات البحث الأخيرة</h3>
                <div className="recent-searches-list">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="recent-search-item"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;