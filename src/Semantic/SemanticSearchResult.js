import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SemanticSearchResult.css';

function SemanticSearchResult() {
  const { searchInput } = useParams();
  const [semanticResult, setSemanticResult] = useState(null);
  const [lexicalResults, setLexicalResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5; // Results to display per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/similar-verse/${searchInput}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setSemanticResult(data.results);
      } catch (error) {
        setError('Error fetching semantic data');
      }
    };

    fetchData();

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
                return data;
              } catch (error) {
                console.error('Error fetching lexical data:', error);
                return null;
              }
            })
          );
          setLexicalResults(results.filter((result) => result));
        } catch (error) {
          setError('Error fetching lexical data');
        }
      };

      fetchLexicalData();
    }
  }, [semanticResult, currentPage]);

  const totalPages = Math.ceil(semanticResult?.length / resultsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const SemanticError = () => (
    <div className="error-container">
      <p>There was an error while fetching semantic data.</p>
    </div>
  );

  const LexicalError = () => (
    <div className="error-container">
      <p>There was an error while fetching lexical data.</p>
    </div>
  );

  if (error === 'Error fetching semantic data') {
    return <SemanticError />;
  }

  if (error === 'Error fetching lexical data') {
    return <LexicalError />;
  }

  return (
    <div>
      {lexicalResults.length > 0 ? 
      (
        <div>
          <div className="result-container">
            <p>
              نتائج البحث بمعنى : <span className="highlighted">{searchInput}</span> - عدد النتائج: {lexicalResults.length}
            </p>
            {lexicalResults.map((result, index) => (
              <div key={index} className="result-item">
                <h4>السورة : {result.data.surah} </h4>
                <p>{result.data.verse}</p>
                {/* <p>Page: {result.page}</p> */}
                <audio controls>
                  <source src={result.data.audio} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
          <div className="pagination">
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">
              التالي
            </button>
            <span className="pagination-text">{`الصفحة ${currentPage} من ${totalPages}`}</span>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn">
              السابق
            </button>
            
            
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SemanticSearchResult;
