import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

  // Memoize patterns to prevent recreation on each render
  const patterns = useMemo(() => ({
    arabic: /^[\u0600-\u06FF\s\u064B-\u0652]+$/,
    english: /^[a-zA-Z\s.,'-]+$/,
    commonInvalid: [
      /([^\u0621-\u063A\u0641-\u064A])\1{2,}/, // Repeated non-Arabic letters
      /\d+/, // Numbers
    ]
  }), []);

  const validateArabicText = useCallback((text) => {
    for (let pattern of patterns.commonInvalid) {
      if (pattern.test(text)) {
        setValidationMessage('الرجاء إدخال كلمات عربية صحيحة');
        setIsValid(false);
        return false;
      }
    }

    setValidationMessage('');
    setIsValid(true);
    return true;
  }, [patterns.commonInvalid]);

  const validateInput = useCallback((value) => {
    const normalizedValue = value.trim().replace(/\s+/g, ' ');
    
    if (normalizedValue.length < 2) {
      setValidationMessage('الرجاء إدخال كلمتين على الأقل');
      setIsValid(false);
      return false;
    }

    if (patterns.arabic.test(normalizedValue)) {
      return validateArabicText(normalizedValue);
    }
    else if (patterns.english.test(normalizedValue)) {
      setValidationMessage('الرجاء الكتابة باللغة العربية');
      setIsValid(false);
      return false;
    }
    else {
      setValidationMessage('الرجاء إدخال نص صحيح باللغة العربية');
      setIsValid(false);
      return false;
    }
  }, [patterns.arabic, patterns.english, validateArabicText]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

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
            <div className="logo-inner-ring"></div>
            <div className="main-logo">
              <div className="logo-content">
                <span className="logo-arabic">الباحث القرآني</span>
                <span className="logo-subtitle">للبحث في آيات القرآن الكريم</span>
              </div>
            </div>
          </div>
          <div className="verse-container">
            <h2 className="quran-verse">
              إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
            </h2>
          </div>
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
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" className="input-search-icon">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                {validationMessage && (
                  <div className="validation-message show">
                    <span className="validation-icon">⚠️</span>
                    {validationMessage}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className={`search-button ${isValid ? 'valid' : ''}`}
                disabled={isLoading || !searchInput.trim() || !isValid}
              >
                {isLoading ? (
                  <div className="loader"></div>
                ) : (
                  <span className="button-text">بحث</span>
                )}
              </button>
            </form>

            <div className="search-type-info">
              {/* <div className="info-text">اختر نوع البحث:</div> */}
              <div className="search-options">
                <button 
                  className="option-button lexical-button"
                  onClick={() => handleSearch('lexical')}
                  disabled={isLoading || !searchInput.trim() || !isValid}
                >
                  <span className="button-icon"></span>
                 <span>البحث باللفظ</span>
                </button>
                <button 
                  className="option-button semantic-button"
                  onClick={() => handleSearch('semantic')}
                  disabled={isLoading || !searchInput.trim() || !isValid}
                >
                  <span className="button-icon"></span>
                  <span>البحث بالمعنى</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          {recentSearches.length > 0 && (
            <div className="recent-searches">
              <h3>
                <span className="recent-icon">🕒</span>
                عمليات البحث الأخيرة
              </h3>
              <div className="recent-searches-list">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="recent-search-item"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <span className="search-text">{search}</span>
                    <span className="search-arrow">←</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="app-info">
            <p className="app-description">
              تطبيق للبحث في القرآن الكريم باستخدام تقنيات الذكاء الاصطناعي
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;