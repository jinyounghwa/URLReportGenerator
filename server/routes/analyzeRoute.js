const express = require('express');
const router = express.Router();
const websiteAnalyzer = require('../analyzer/websiteAnalyzer');
const techAnalyzer = require('../analyzer/techAnalyzer');
const uxScorer = require('../analyzer/uxScorer');

// 웹사이트 분석 요청 처리
router.post('/analyze', async (req, res) => {
  try {
    const { url, options } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL이 필요합니다' });
    }
    
    // URL 형식 검증
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ message: '유효한 URL 형식이 아닙니다' });
    }
    
    console.log(`분석 시작: ${url}`);
    
    // 웹사이트 구조 분석
    const structureData = await websiteAnalyzer.analyzeStructure(url, options);
    
    // 기술 스택 분석
    const techData = await techAnalyzer.analyzeTechnologies(url);
    
    // UX 분석 (옵션)
    let uxData = null;
    if (options?.analyzeUX) {
      uxData = await uxScorer.analyzeUX(url);
    }
    
    // 결과 조합
    const result = {
      url,
      timestamp: new Date().toISOString(),
      structure: structureData.structure,
      features: structureData.features,
      technologies: techData.technologies,
      ux: uxData
    };
    
    res.json(result);
  } catch (error) {
    console.error('분석 오류:', error);
    res.status(500).json({ 
      message: '분석 중 오류가 발생했습니다', 
      error: error.message 
    });
  }
});

// 저장된 리포트 목록 조회
router.get('/reports', (req, res) => {
  // 실제 구현에서는 데이터베이스에서 리포트 목록을 조회
  res.json([]);
});

// 특정 리포트 조회
router.get('/reports/:id', (req, res) => {
  const { id } = req.params;
  // 실제 구현에서는 데이터베이스에서 특정 ID의 리포트를 조회
  res.status(404).json({ message: '리포트를 찾을 수 없습니다' });
});

module.exports = router;
