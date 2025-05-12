// 실제 lighthouse 구현 대신 더미 데이터를 반환하는 간단한 구현으로 대체

/**
 * UX 점수 분석 함수
 * @param {string} url - 분석할 웹사이트 URL
 * @returns {Promise<Object>} - 분석 결과
 */
async function analyzeUX(url) {
  console.log(`UX 분석 중: ${url}`);
  
  // 더미 UX 점수 데이터 반환
  const score = {
    performance: 85,
    accessibility: 92,
    bestPractices: 88,
    seo: 95,
    pwa: 60
  };
  
  // 가중치를 적용한 종합 점수 계산
  const weightedScore =
    score.performance * 0.3 +
    score.accessibility * 0.3 +
    score.bestPractices * 0.15 +
    score.seo * 0.1 +
    score.pwa * 0.15;
  
  return {
    scores: score,
    uxScore: Math.round(weightedScore),
    audits: {
      firstContentfulPaint: {
        score: 0.85,
        value: '1.2 s'
      },
      speedIndex: {
        score: 0.82,
        value: '1.8 s'
      },
      largestContentfulPaint: {
        score: 0.79,
        value: '2.1 s'
      },
      interactive: {
        score: 0.88,
        value: '2.5 s'
      },
      totalBlockingTime: {
        score: 0.90,
        value: '120 ms'
      },
      cumulativeLayoutShift: {
        score: 0.95,
        value: '0.02'
      }
    }
  };
}

module.exports = {
  analyzeUX
};
