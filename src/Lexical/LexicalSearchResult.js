import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './LexicalSearchResult.css';

function LexicalSearchResult() {
  const { searchInput } = useParams();
  const [lexicalResult, setLexicalResult] = useState([]); // Changed to an array
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const resultsPerPage = 5;

  useEffect(() => {
    const fetchLexicalData = async () => {
      setIsLoading(true);
      try {
        // Encode the search input to handle special characters
        const encodedSearchInput = encodeURIComponent(searchInput);
        const response = await fetch(`https://quran-lexical-api.vercel.app/search?text=${encodedSearchInput}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLexicalResult(data); // Directly set the array of results
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching lexical data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLexicalData();
  }, [searchInput]);

  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span>جاري التحميل...</span>
    </div>
  );

  const LexicalError = () => (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>عذراً! حدث خطأ</h3>
      <p>حدث خطأ أثناء جلب البيانات. الرجاء المحاولة مرة أخرى.</p>
    </div>
  );

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = lexicalResult.slice(indexOfFirstResult, indexOfLastResult); // Use lexicalResult directly
  const totalPages = Math.ceil(lexicalResult.length / resultsPerPage); // Calculate total pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <LexicalError />;

  return (
    <div className="lexical-search-container">
      <div className="search-results">
        <div className="search-header">
          <h2>نتائج البحث اللفظي</h2>
          {lexicalResult.length === 0 ? (
            <div className="no-results">
              <p>لا توجد نتائج بحث عن: <span className="search-term">"{searchInput}"</span></p>
            </div>
          ) : (
            <div className="results-summary">
              <p>
                نتائج البحث بلفظ: <span className="search-term">"{searchInput}"</span>
              </p>
              <p className="results-count">
                عدد النتائج: <span>{lexicalResult.length}</span>
              </p>
            </div>
          )}
        </div>

        <div className="results-list">
          {currentResults.map((item, index) => (
            <div key={index} className="result-card">
              <div className="result-header">
                <h3>سورة {item.surah}</h3>
              </div>
              <div className="verse-text">
                <p>{item.verse}</p>
              </div>
            </div>
          ))}
        </div>

        {lexicalResult.length > resultsPerPage && (
          <div className="pagination-container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-arrow"
            >
              &#8594;
            </button>
            
            <div className="pagination-numbers">
              {renderPagination()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-arrow"
            >
              &#8592;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LexicalSearchResult;