import { useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isDesktop, setIsDesktop] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeUX, setAnalyzeUX] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('URL을 입력해주세요');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError('');
      
      const response = await axios.post('/api/analyze', {
        url,
        options: {
          isDesktop,
          analyzeUX
        }
      });
      
      setReport(response.data);
    } catch (err) {
      setError('분석 중 오류가 발생했습니다: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    // 리포트 다운로드 로직 구현
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>경쟁사 URL 분석 도구</h1>
        
        <p className={styles.description}>
          경쟁사 웹사이트 URL을 입력하면 자동으로 분석 리포트를 생성합니다
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button} disabled={isAnalyzing}>
              {isAnalyzing ? '분석 중...' : '분석 시작'}
            </button>
          </div>

          <div className={styles.options}>
            <label className={styles.option}>
              <input
                type="checkbox"
                checked={isDesktop}
                onChange={() => setIsDesktop(!isDesktop)}
              />
              데스크탑 모드로 분석
            </label>
            
            <label className={styles.option}>
              <input
                type="checkbox"
                checked={analyzeUX}
                onChange={() => setAnalyzeUX(!analyzeUX)}
              />
              UX/성능 분석 포함
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </form>

        {report && (
          <div className={styles.report}>
            <h2>분석 결과</h2>
            
            <div className={styles.reportSection}>
              <h3>웹사이트 정보</h3>
              <p><strong>URL:</strong> {report.url}</p>
              <p><strong>분석 일시:</strong> {new Date(report.timestamp).toLocaleString()}</p>
            </div>
            
            {report.technologies && (
              <div className={styles.reportSection}>
                <h3>기술 스택</h3>
                <ul className={styles.techList}>
                  {report.technologies.map((tech, index) => (
                    <li key={index} className={styles.techItem}>{tech}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {report.structure && (
              <div className={styles.reportSection}>
                <h3>사이트 구조</h3>
                <div className={styles.structureVisualization}>
                  {/* 여기에 Mermaid.js 또는 D3.js로 시각화 */}
                  <pre>{JSON.stringify(report.structure, null, 2)}</pre>
                </div>
              </div>
            )}
            
            {report.features && (
              <div className={styles.reportSection}>
                <h3>주요 기능</h3>
                <ul>
                  {report.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {report.ux && (
              <div className={styles.reportSection}>
                <h3>UX 분석</h3>
                <div className={styles.uxScores}>
                  <div className={styles.uxScore}>
                    <span>종합 점수</span>
                    <div className={styles.scoreCircle}>{report.ux.uxScore}</div>
                  </div>
                  <div className={styles.uxScoreDetails}>
                    <div className={styles.scoreDetail}>
                      <span>성능</span>
                      <div className={styles.scoreBar}>
                        <div 
                          className={styles.scoreBarFill} 
                          style={{ width: `${report.ux.scores.performance}%` }}
                        />
                      </div>
                      <span>{report.ux.scores.performance}</span>
                    </div>
                    <div className={styles.scoreDetail}>
                      <span>접근성</span>
                      <div className={styles.scoreBar}>
                        <div 
                          className={styles.scoreBarFill} 
                          style={{ width: `${report.ux.scores.accessibility}%` }}
                        />
                      </div>
                      <span>{report.ux.scores.accessibility}</span>
                    </div>
                    <div className={styles.scoreDetail}>
                      <span>모범 사례</span>
                      <div className={styles.scoreBar}>
                        <div 
                          className={styles.scoreBarFill} 
                          style={{ width: `${report.ux.scores.bestPractices}%` }}
                        />
                      </div>
                      <span>{report.ux.scores.bestPractices}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={downloadReport} 
              className={styles.downloadButton}
            >
              리포트 다운로드
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
