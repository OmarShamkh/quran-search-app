import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SemanticSearchResult.css';

function SemanticSearchResult() {
  const { searchInput } = useParams();
  const [semanticResult, setSemanticResult] = useState(null);
  const [lexicalResults, setLexicalResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const resultsPerPage = 5;

  useEffect(() => {
    const fetchSemanticData = async () => {
      setIsLoading(true);
      try {
        setError('عذراً. خدمة البحث الدلالي غير متوفرة حالياً بسبب عدم توفر الموارد اللازمة لتشغيل الخادم. نعمل على إصلاح المشكلة.');
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error fetching semantic data:', error);
        setError('عذراً. خدمة البحث الدلالي غير متوفرة حالياً. نعمل على إصلاح المشكلة.');
        setIsLoading(false);
      }
    };

    fetchSemanticData();
  }, [searchInput]);

  useEffect(() => {
    if (semanticResult) {
      const fetchLexicalData = async () => {
        try {
          const startIndex = (currentPage - 1) * resultsPerPage;
          const endIndex = startIndex + resultsPerPage;
          const selectedResults = semanticResult.slice(startIndex, endIndex);

          const results = await Promise.all(
            selectedResults.map(async (item) => {
              try {
                const response = await fetch(`https://lexical-search.azurewebsites.net/api/lexical/verse-in-quran/${item[1] + 1}`);
                if (!response.ok) {
                  throw new Error('Failed to fetch lexical data');
                }
                const data = await response.json();
                return { ...data, similarity: item[0] };
              } catch (error) {
                console.error('Error fetching lexical data:', error);
                return null;
              }
            })
          );
          console.log(results);
          setLexicalResults(results.filter((result) => result));
          setIsLoading(false);
        } catch (error) {
          setError('Error fetching lexical data');
          setIsLoading(false);
        }
      };

      fetchLexicalData();
    }
  }, [semanticResult, currentPage]);

  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span>جاري البحث الدلالي...</span>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>عذراً! حدث خطأ</h3>
      <p>{message}</p>
    </div>
  );

  const totalPages = semanticResult ? Math.ceil(semanticResult.length / resultsPerPage) : 0;

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
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="semantic-search-container">
      {lexicalResults.length > 0 ? (
        <div className="search-results">
          <div className="search-header">
            <h2>نتائج البحث الدلالي بالمعنى</h2>
            <div className="results-summary">
              <p>
                البحث عن معنى: <span className="search-term">"{searchInput}"</span>
              </p>
              <p className="results-count">
                عدد النتائج: <span>{semanticResult.length}</span>
              </p>
            </div>
          </div>

          <div className="results-list">
            {lexicalResults.map((result, index) => (
              <div key={index} className="result-card">
                <div className="result-header">
                  <h3>سورة {result.data.surah}</h3>
                  <div className="verse-info">
                    <span className="verse-number">آية رقم {result.data.numberInSurah}</span>
                    <span className="similarity-score">
                      نسبة تطابق المعنى: {(result.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="verse-text">
                  <p>{result.data.verse}</p>
                </div>
                <div className="audio-player">
                  <audio controls className="custom-audio">
                    <source src={result.data.audio} type="audio/mp3" />
                    متصفحك لا يدعم مشغل الصوت.
                  </audio>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
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
      ) : (
        <div className="no-results">
          <p>لا توجد نتائج بحث دلالي عن: <span className="search-term">"{searchInput}"</span></p>
        </div>
      )}
    </div>
  );
}

export default SemanticSearchResult;