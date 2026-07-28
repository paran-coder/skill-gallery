// 스킬 상세 페이지 - README 렌더링, 이미지 갤러리, 다운로드 버튼 제공

import { getSkillRepo, getSkillRepos } from '../../lib/github';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const repos = await getSkillRepos();
  return repos.map((r) => ({ name: r.name }));
}

export default async function SkillPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const skill = await getSkillRepo(name);
  if (!skill) notFound();

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: "'DM Sans', 'Pretendard', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .top-bar {
          border-bottom: 1px solid #e7e5e4;
          background: #fff;
        }

        .top-bar-inner {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .back-link {
          font-size: 13px;
          color: #a8a29e;
          text-decoration: none;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: color 0.15s;
        }

        .back-link:hover { color: #1c1917; }

        .hero-section {
          background: #fff;
          border-bottom: 1px solid #e7e5e4;
        }

        .hero-inner {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 40px 48px;
        }

        .skill-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #d97706;
          background: #fef3c7;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .skill-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 4vw, 40px);
          color: #1c1917;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .skill-desc {
          font-size: 15px;
          color: #78716c;
          font-weight: 300;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          background: #1c1917;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          border-radius: 10px;
          transition: background 0.15s, transform 0.15s;
          letter-spacing: 0.01em;
        }

        .download-btn:hover {
          background: #292524;
          transform: translateY(-1px);
        }

        .content {
          max-width: 800px;
          margin: 0 auto;
          padding: 48px 40px 80px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .section-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a8a29e;
          margin-bottom: 16px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        .image-grid img {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #e7e5e4;
          object-fit: cover;
          display: block;
        }

        .readme-box {
          background: #fff;
          border: 1.5px solid #e7e5e4;
          border-radius: 14px;
          padding: 28px 32px;
          font-size: 14px;
          color: #44403c;
          line-height: 1.8;
          font-weight: 300;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .install-box {
          background: #fffbeb;
          border: 1.5px solid #fde68a;
          border-radius: 14px;
          padding: 28px 32px;
        }

        .install-title {
          font-size: 15px;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 16px;
        }

        .install-list {
          list-style: none;
          counter-reset: steps;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .install-list li {
          counter-increment: steps;
          display: flex;
          gap: 12px;
          font-size: 14px;
          color: #78350f;
          font-weight: 400;
          line-height: 1.5;
        }

        .install-list li::before {
          content: counter(steps);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background: #d97706;
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 600;
          flex-shrink: 0;
          margin-top: 1px;
        }

        @media (max-width: 640px) {
          .top-bar-inner, .hero-inner, .content { padding-left: 24px; padding-right: 24px; }
        }
      `}</style>

      <div className="top-bar">
        <div className="top-bar-inner">
          <Link href="/" className="back-link">← 갤러리로 돌아가기</Link>
        </div>
      </div>

      <div className="hero-section">
        <div className="hero-inner">
          <span className="skill-tag">Claude Cowork Skill</span>
          <h1 className="skill-title">{skill.name}</h1>
          {skill.description && (
            <p className="skill-desc">{skill.description}</p>
          )}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '28px' }}>
            <a href={skill.skillFileUrl} download={skill.name} className="download-btn">
              {skill.fileType === 'plugin' ? '📥 플러그인 다운로드' : '📥 스킬 다운로드'}
            </a>
            <a
              href={skill.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '13px 20px',
                border: '1.5px solid #e7e5e4',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#44403c',
                textDecoration: 'none',
                background: '#fff',
              }}
            >
              GitHub에서 보기 ↗
            </a>
          </div>
        </div>
      </div>

      <div className="content">
        {skill.imageUrls.length > 0 && (
          <section>
            <p className="section-label">미리보기</p>
            <div className="image-grid">
              {skill.imageUrls.map((url, i) => (
                <img key={i} src={url} alt={skill.name + ' 샘플 ' + (i + 1)} />
              ))}
            </div>
          </section>
        )}

        {skill.readme && (
          <section>
            <p className="section-label">설명</p>
            <div className="readme-box">{skill.readme}</div>
          </section>
        )}

        <section>
          <div className="install-box">
            <p className="install-title">설치 방법</p>
            <ol className="install-list">
              <li>위의 {skill.fileType === 'plugin' ? '플러그인' : '스킬'} 다운로드 버튼을 클릭해 .{skill.fileType} 파일을 저장합니다.</li>
              <li>Claude Cowork 앱을 엽니다.</li>
              <li>다운로드한 .skill 파일을 Cowork의 플러그인 폴더에 복사합니다.</li>
              <li>Cowork를 재시작하면 스킬이 활성화됩니다.</li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
