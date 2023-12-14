import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './LexicalSearchResult.css';

function LexicalSearchResult() {
  const { searchInput } = useParams();
  const [lexicalResult, setLexicalResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const resultsPerPage = 5;

  useEffect(() => {
    const fetchLexicalData = async () => {
      try {
        const response = await fetch(`https://lexical-search.azurewebsites.net/api/lexical/search/${searchInput}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLexicalResult(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching lexical data');
      }
    };

    fetchLexicalData();
  }, [searchInput]);

  const LexicalError = () => (
    <div className="error-container">
      <p>There was an error while fetching lexical data.</p>
    </div>
  );

  // Pagination 
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = lexicalResult ? lexicalResult.data.slice(indexOfFirstResult, indexOfLastResult) : [];

  const totalPages = Math.ceil(lexicalResult?.data.length / resultsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      {error === 'Error fetching lexical data' ? (
        <LexicalError />
      ) : (
        lexicalResult ? (
          <div>
            <div className="result-container">
              {lexicalResult.data.length === 0 ? (
                <p>لا توجد نتائج بحث عن : '{searchInput}'</p>
              ) : (
                <div>
                  <p>
                    نتائج البحث بلفظ : <span className="highlighted">{searchInput}</span> - عدد النتائج: {lexicalResult.data.length}
                  </p>
                  {currentResults.map((item, index) => (
                    <div key={index} className="result-item">
                      <h4>السورة : {item.surah} </h4>
                      <p>{item.verse}</p>
                      <audio controls>
                        <source src={item.audio} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                  <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn">
                    السابق
                    </button>
                    <span className="pagination-text">{`الصفحة ${currentPage} من ${totalPages}`}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">
                    التالي
                    </button>
                </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )
      )}
    </div>
  );
}

export default LexicalSearchResult;
