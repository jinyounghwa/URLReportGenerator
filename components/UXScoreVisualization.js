import { useEffect, useRef } from 'react';
import styles from '@/styles/Home.module.css';

/**
 * UX 점수 시각화 컴포넌트
 * @param {Object} props
 * @param {Object} props.uxData - UX 분석 데이터
 */
export default function UXScoreVisualization({ uxData }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!uxData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 캔버스 크기 설정
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    // 점수 데이터
    const scores = [
      { name: '성능', value: uxData.scores.performance, color: '#4285F4' },
      { name: '접근성', value: uxData.scores.accessibility, color: '#34A853' },
      { name: '모범 사례', value: uxData.scores.bestPractices, color: '#FBBC05' },
      { name: 'SEO', value: uxData.scores.seo, color: '#EA4335' },
      { name: 'PWA', value: uxData.scores.pwa, color: '#8E44AD' }
    ];
    
    // 레이더 차트 그리기
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // 배경 그리드 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.75, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.25, 0, 2 * Math.PI);
    ctx.stroke();
    
    // 각 축 그리기
    const angleStep = (2 * Math.PI) / scores.length;
    
    scores.forEach((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#ddd';
      ctx.stroke();
      
      // 라벨 그리기
      const labelX = centerX + (radius + 20) * Math.cos(angle);
      const labelY = centerY + (radius + 20) * Math.sin(angle);
      
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(score.name, labelX, labelY);
    });
    
    // 데이터 점 그리기
    ctx.beginPath();
    scores.forEach((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = score.value / 100; // 0-1 사이 값으로 정규화
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // 첫 번째 점과 연결하여 폐곡선 만들기
    const firstAngle = -Math.PI / 2;
    const firstValue = scores[0].value / 100;
    const firstX = centerX + radius * firstValue * Math.cos(firstAngle);
    const firstY = centerY + radius * firstValue * Math.sin(firstAngle);
    ctx.lineTo(firstX, firstY);
    
    // 영역 채우기
    ctx.fillStyle = 'rgba(66, 133, 244, 0.2)';
    ctx.fill();
    
    // 선 그리기
    ctx.strokeStyle = '#4285F4';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 데이터 점 그리기
    scores.forEach((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = score.value / 100;
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = score.color;
      ctx.fill();
    });
    
    // 중앙에 종합 점수 표시
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(uxData.uxScore.toString(), centerX, centerY);
    
    ctx.font = '12px Arial';
    ctx.fillText('종합 점수', centerX, centerY + 20);
  }, [uxData]);
  
  if (!uxData) {
    return <div>UX 데이터가 없습니다</div>;
  }
  
  return (
    <div className={styles.uxVisualization}>
      <canvas ref={canvasRef} className={styles.uxCanvas}></canvas>
      
      <div className={styles.uxScoreDetails}>
        <div className={styles.scoreDetail}>
          <span>성능</span>
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreBarFill} 
              style={{ width: `${uxData.scores.performance}%` }}
            />
          </div>
          <span>{uxData.scores.performance}</span>
        </div>
        
        <div className={styles.scoreDetail}>
          <span>접근성</span>
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreBarFill} 
              style={{ width: `${uxData.scores.accessibility}%` }}
            />
          </div>
          <span>{uxData.scores.accessibility}</span>
        </div>
        
        <div className={styles.scoreDetail}>
          <span>모범 사례</span>
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreBarFill} 
              style={{ width: `${uxData.scores.bestPractices}%` }}
            />
          </div>
          <span>{uxData.scores.bestPractices}</span>
        </div>
        
        <div className={styles.scoreDetail}>
          <span>SEO</span>
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreBarFill} 
              style={{ width: `${uxData.scores.seo}%` }}
            />
          </div>
          <span>{uxData.scores.seo}</span>
        </div>
        
        <div className={styles.scoreDetail}>
          <span>PWA</span>
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreBarFill} 
              style={{ width: `${uxData.scores.pwa}%` }}
            />
          </div>
          <span>{uxData.scores.pwa}</span>
        </div>
      </div>
    </div>
  );
}
