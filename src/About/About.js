import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>البحث الدلالي في القرآن الكريم</h1>
        <div className="header-decoration"></div>
      </div>

      <div className="about-content">
        <section className="project-description">
          <h2>عن المشروع</h2>
          <p>
            يهدف هذا المشروع إلى تيسير البحث في القرآن الكريم باستخدام تقنيتين متطورتين:
          </p>
          <div className="search-types">
            <div className="search-type">
              <h3>البحث اللفظي</h3>
              <p>يعتمد على البحث بالكلمات المفتاحية المباشرة</p>
            </div>
            <div className="search-type">
              <h3>البحث الدلالي</h3>
              <p>يعتمد على فهم المعنى والمفهوم العام للنص</p>
            </div>
          </div>
        </section>

        <section className="technical-details">
          <h2>المنهجية العلمية</h2>
          <ul className="features-list">
            <li>
              <span className="feature-icon">🔍</span>
              <span>استخدام نماذج متقدمة مدربة على نصوص عربية واسعة لتحليل المعاني</span>
            </li>
            <li>
              <span className="feature-icon">📚</span>
              <span>الاعتماد على قاعدة بيانات موثقة للقرآن الكريم مع التشكيل الكامل</span>
            </li>
            <li>
              <span className="feature-icon">⚡</span>
              <span>حساب متجهات الخصائص للنصوص باستخدام تقنيات التحليل المتقدمة</span>
            </li>
            <li>
              <span className="feature-icon">📊</span>
              <span>استخدام تقنية التشابه الجيبي لاسترجاع الآيات الأكثر صلة</span>
            </li>
            <li>
              <span className="feature-icon">🎯</span>
              <span>عرض أفضل 50 آية متطابقة مع نص البحث</span>
            </li>
          </ul>
        </section>

        <section className="project-note">
          <h2>ملاحظة هامة</h2>
          <div className="note-content">
            <p>
              نتائج البحث الدلالي في هذا التطبيق تعتمد على نماذج متخصصة ومدربة مسبقاً. 
              رغم سعينا للدقة العالية، إلا أن النتائج تختلف عن مخرجات نماذج اللغة الكبيرة (LLM). 
              نوصي المستخدمين بالتحقق والتدقيق عند الاعتماد على هذه النتائج.
            </p>
          </div>
        </section>

        <section className="project-info">
          <div className="university-info">
            <h2>معلومات المشروع</h2>
            <p>
              تم تطوير هذا المشروع كجزء من متطلبات درجة البكالوريوس في هندسة النظم والحاسبات
              <br />
              <strong>جامعة الأزهر - 2022</strong>
            </p>
          </div>
        </section>

        <section className="contact-section">
          <h2>للتواصل </h2>
          <p className="developer-name">Omar Shamkh</p>
          <div className="social-links">
            <a href="mailto:omarshamkh2510@gmail.com" className="social-link email">
              <span className="icon">📧</span>
              <span>Gamil</span>
            </a>
            <a href="https://www.linkedin.com/in/omarshamkh/" className="social-link linkedin" target="_blank" rel="noreferrer">
              <span className="icon">💼</span>
              <span>linkedin</span>
            </a>
            <a href="https://github.com/OmarShamkh/" className="social-link github" target="_blank" rel="noreferrer">
              <span className="icon">💻</span>
              <span>Github</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;