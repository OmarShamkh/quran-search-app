import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h2>Quranic Search App</h2>
      <p>
        This project aims to facilitate Quran searches using two techniques: lexical (keyword-based) and semantic (concept-based). It's designed to assist individuals, especially Muslims, in navigating and searching the Holy Quran more efficiently. The project involves various phases:
      </p>
      <ul>
        <li>Collection of pre-trained models from credible sources to generate feature vectors for words by training on extensive Arabic corpus.</li>
        <li>Acquisition of a suitable database to display Quranic Verses with accurate Tashkeel.</li>
        <li>Calculation of feature vectors for input queries and Quran verses using techniques like computing max and average similarity, frequency analysis, and Pooling for each word in a sentence.</li>
        <li>Utilization of cosine similarity to retrieve the most relevant verses, facilitating a more efficient search and providing answers within the Holy Quran.</li>
        <li><strong>Retrieval of the top 50 most similar Ayas</strong> using the mentioned techniques, further refining the search results.</li>
      </ul>
      <p>
        This project was a part of the degree requirements for Bachelor of Science in Systems and Computers Engineering at Al-Azhar University(2022).
      </p>
      <p>
        <strong>Semantic Search Results Note:</strong><br />
        <strong>The semantic search results provided by this app are generated using pre-trained models and specialized techniques. While these results aim to offer the best answers and strive for accuracy, they differ from LLM (Large Language Model) outputs. Users can expect reliable responses but should exercise discretion when interpreting or relying solely on these outcomes.</strong>
        <p dir='rtl'>
        <strong>ملاحظة حول نتائج البحث بالمعنى:</strong><br />
        نتائج البحث بالمعنى المقدمة من خلال هذا التطبيق تم إنشاؤها باستخدام نماذج مدربة مسبقًا وتقنيات متخصصة. على الرغم من أن هذه النتائج تهدف إلى تقديم أفضل الإجابات وتسعى للدقة، إلا أنها تختلف عن نتائج نماذج اللغة الكبيرة (LLM). يمكن للمستخدمين أن يتوقعوا استجابات موثوقة ولكن يجب ممارسة الحذر عند تفسير أو الاعتماد فقط على هذه النتائج.
      </p>
      </p>
      <p>
        <strong>Contact me: Omar Shamkh </strong>
        <ul className="contact-links">
          <li><a href="mailto:omarshamkh2510@gmail.com" target="_blank" rel="noreferrer">Email</a></li>
          <li><a href="https://www.linkedin.com/in/omarshamkh/" target="_blank" rel="noreferrer">Linkedin</a></li>
          <li><a href="https://github.com/OmarShamkh/" target="_blank" rel="noreferrer">Github</a></li>
        </ul>
      </p>
    </div>
  );
}

export default About;
