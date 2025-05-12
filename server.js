// 서버 실행을 위한 메인 파일
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 분석 API 엔드포인트
app.post('/api/analyze', (req, res) => {
  const { url, options } = req.body;
  
  if (!url) {
    return res.status(400).json({ message: 'URL이 필요합니다' });
  }
  
  console.log(`분석 요청 받음: ${url}`);
  
  // 더미 데이터 반환
  setTimeout(() => {
    const result = {
      url,
      timestamp: new Date().toISOString(),
      structure: {
        menu: [
          { text: '홈', url: `${url}`, level: 1 },
          { text: '제품', url: `${url}/products`, level: 1 },
          { text: '서비스', url: `${url}/services`, level: 1 },
          { text: '회사 소개', url: `${url}/about`, level: 1 },
          { text: '고객 지원', url: `${url}/support`, level: 1 },
          { text: '문의하기', url: `${url}/contact`, level: 1 }
        ],
        links: [
          { text: '홈페이지', url: `${url}` },
          { text: '제품 목록', url: `${url}/products` },
          { text: '서비스 안내', url: `${url}/services` },
          { text: '회사 소개', url: `${url}/about` },
          { text: '고객 지원', url: `${url}/support` },
          { text: '문의하기', url: `${url}/contact` },
          { text: '이용약관', url: `${url}/terms` },
          { text: '개인정보처리방침', url: `${url}/privacy` }
        ]
      },
      features: [
        '로그인',
        '회원가입',
        '검색',
        '장바구니',
        '결제',
        '폼 입력',
        '탭 인터페이스'
      ],
      technologies: [
        'React',
        'Next.js',
        'Bootstrap',
        'jQuery',
        'Google Analytics',
        'Google Fonts',
        'Cloudflare',
        'Nginx',
        'Node.js'
      ],
      uxScore: {
        performance: 85,
        accessibility: 92,
        bestPractices: 88,
        seo: 95,
        overall: 85,
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
      }
    };
    
    res.json(result);
  }, 2000); // 2초 뒤에 결과 반환 (분석 중인 것 처럼 보이게)
});

// 기본 HTML 페이지 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`URL 분석 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`웹 브라우저에서 http://localhost:${PORT} 접속하세요`);
});
