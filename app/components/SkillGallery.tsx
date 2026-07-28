// 스킬 카드 목록과 검색 기능을 담당하는 클라이언트 컴포넌트

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SkillRepo } from '../lib/github';

export default function SkillGallery({ skills }: { skills: SkillRepo[] }) {
  const [query, setQuery] = useState('');

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: "'DM Sans', 'Pretendard', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .site-header {
          background: #fff;
          border-bottom: 1px solid #e7e5e4;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .site-header-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 14px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .site-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .site-logo img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #e7e5e4;
        }

        .site-logo-text { display: flex; flex-direction: column; }

        .site-logo-name {
          font-size: 14px;
          font-weight: 600;
          color: #1c1917;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .site-logo-sub {
          font-size: 11px;
          color: #a8a29e;
          font-weight: 300;
          margin-top: 1px;
        }

        .site-header-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          text-decoration: none;
          transition: background 0.15s;
          white-space: nowrap;
        }

        .header-link-kakao {
          background: #FEE500;
          color: #1c1917;
        }

        .header-link-kakao:hover { background: #f0d900; }

        .header-link-youtube {
          background: #FF0000;
          color: #fff;
        }

        .header-link-youtube:hover { background: #cc0000; }

        .hero {
          padding: 72px 40px 56px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a8a29e;
          margin-bottom: 20px;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 5vw, 56px);
          color: #1c1917;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .hero-title span { color: #d97706; }

        .hero-sub {
          font-size: 15px;
          color: #78716c;
          line-height: 1.7;
          max-width: 380px;
          font-weight: 300;
          word-break: keep-all;
        }

        .search-wrap {
          margin-top: 36px;
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #a8a29e;
          font-size: 14px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 1.5px solid #e7e5e4;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          background: #fff;
          color: #1c1917;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus { border-color: #d97706; }
        .search-input::placeholder { color: #c4b5a5; }

        .divider {
          height: 1px;
          background: #e7e5e4;
          max-width: 1100px;
          margin: 0 auto;
        }

        .grid-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 40px 80px;
        }

        .count-label {
          font-size: 12px;
          color: #a8a29e;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-bottom: 28px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .card {
          background: #fff;
          border: 1.5px solid #e7e5e4;
          border-radius: 16px;
          overflow: hidden;
          transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
        }

        .card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          transform: translateY(-2px);
          border-color: #d6d3d1;
        }

        .card-thumb {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
          background: #f5f5f4;
        }

        .card-thumb-empty {
          width: 100%;
          height: 180px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .card-body { padding: 20px; }

        .card-name {
          font-size: 15px;
          font-weight: 600;
          color: #1c1917;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.01em;
        }

        .card-desc {
          font-size: 13px;
          color: #a8a29e;
          line-height: 1.5;
          height: 2.8em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-weight: 300;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .btn-ghost {
          flex: 1;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1.5px solid #e7e5e4;
          color: #78716c;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }

        .btn-ghost:hover {
          background: #fafaf9;
          border-color: #d6d3d1;
        }

        .btn-primary {
          flex: 1;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1.5px solid #d97706;
          background: #d97706;
          color: #fff;
          text-decoration: none;
          transition: background 0.15s;
        }

        .btn-primary:hover {
          background: #b45309;
          border-color: #b45309;
        }

        .empty {
          text-align: center;
          padding: 80px 0;
          color: #c4b5a5;
          font-size: 15px;
        }

        @media (max-width: 1024px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .site-header-inner { padding: 12px 24px; }
          .site-logo-sub { display: none; }
          .header-link span { display: none; }
          .hero { padding: 48px 24px 40px; }
          .grid-section { padding: 32px 24px 60px; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* 상단 헤더 */}
      <header className="site-header">
        <div className="site-header-inner">
          <a href="/" className="site-logo">
            <img
              src="/logo.png"
              alt="조남경 로고"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="site-logo-text">
              <span className="site-logo-name">미드저니 코리아</span>
              <span className="site-logo-sub">조남경입니다.</span>
            </div>
          </a>
          <div className="site-header-links">
            <a
              href="https://open.kakao.com/o/gKaTQprg"
              target="_blank"
              rel="noopener noreferrer"
              className="header-link header-link-kakao"
            >
              💬 <span>오픈톡방</span>
            </a>
            <a
              href="https://www.youtube.com/@mjKorea123"
              target="_blank"
              rel="noopener noreferrer"
              className="header-link header-link-youtube"
            >
              ▶ <span>유튜브</span>
            </a>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="hero">
        <p className="hero-eyebrow">Claude Cowork Skills</p>
        <h1 className="hero-title">
          스킬을 찾고,<br />
          <span>바로 써보세요.</span>
        </h1>
        <p className="hero-sub">
          깃허브를 몰라도 괜찮습니다.<br />
          원하는 스킬을 찾아 버튼 하나로 다운로드하세요.
        </p>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="스킬 이름 또는 기능으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <div className="divider" />

      {/* 카드 그리드 */}
      <section className="grid-section">
        <p className="count-label">{filtered.length}개의 스킬</p>
        {filtered.length === 0 ? (
          <p className="empty">검색 결과가 없습니다.</p>
        ) : (
          <div className="grid">
            {filtered.map((skill) => (
              <div className="card" key={skill.name}>
                {skill.imageUrls[0] ? (
                  <img src={skill.imageUrls[0]} alt={skill.name} className="card-thumb" />
                ) : (
                  <div className="card-thumb-empty">🧩</div>
                )}
                <div className="card-body">
                  <p className="card-name">
                    {skill.name}
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '10px',
                      fontWeight: 500,
                      padding: '2px 7px',
                      borderRadius: '20px',
                      background: skill.fileType === 'plugin' ? '#f0fdf4' : '#eff6ff',
                      color: skill.fileType === 'plugin' ? '#16a34a' : '#2563eb',
                      border: skill.fileType === 'plugin' ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                      verticalAlign: 'middle',
                    }}>
                      {skill.fileType === 'plugin' ? 'Plugin' : 'Skill'}
                    </span>
                  </p>
                  <p className="card-desc">{skill.description || '설명이 없습니다.'}</p>
                  <div className="card-actions">
                    <Link href={`/skills/${skill.name}`} className="btn-ghost">
                      자세히 보기
                    </Link>
                    <a href={skill.skillFileUrl} download={skill.name} className="btn-primary">
                      {skill.fileType === 'plugin' ? '플러그인 다운로드' : '스킬 다운로드'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
