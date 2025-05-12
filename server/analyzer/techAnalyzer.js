// 실제 puppeteer 구현 대신 더미 데이터를 반환하는 간단한 구현으로 대체

/**
 * 웹사이트 기술 스택 분석 함수
 * @param {string} url - 분석할 웹사이트 URL
 * @returns {Promise<Object>} - 분석 결과
 */
async function analyzeTechnologies(url) {
  console.log(`기술 스택 분석 중: ${url}`);
  
  // 더미 기술 스택 데이터 반환
  return {
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
    ]
  };
}

/**
 * 웹사이트 기술 스택 감지 함수
 * @param {puppeteer.Page} page - Puppeteer 페이지 객체
 * @returns {Promise<Array>} - 감지된 기술 목록
 */
async function detectTechnologies(page) {
  // 메타 태그, 스크립트, 스타일시트 분석
  const technologies = await page.evaluate(() => {
    const techs = new Set();
    
    // 프레임워크 및 라이브러리 감지
    
    // React 감지
    if (
      document.querySelector('[data-reactroot]') ||
      document.querySelector('[data-reactid]') ||
      window.React ||
      Array.from(document.querySelectorAll('*')).some(el => Object.keys(el).some(key => key.startsWith('__react')))
    ) {
      techs.add('React');
    }
    
    // Next.js 감지
    if (
      document.querySelector('#__next') ||
      document.querySelector('script[src*="/_next/"]')
    ) {
      techs.add('Next.js');
    }
    
    // Vue.js 감지
    if (
      document.querySelector('[data-v-]') ||
      window.Vue ||
      document.querySelector('script[src*="vue.js"]') ||
      document.querySelector('script[src*="vue.min.js"]')
    ) {
      techs.add('Vue.js');
    }
    
    // Angular 감지
    if (
      document.querySelector('[ng-app]') ||
      document.querySelector('[ng-controller]') ||
      document.querySelector('[ng-model]') ||
      document.querySelector('[data-ng-app]') ||
      document.querySelector('app-root') ||
      window.angular
    ) {
      techs.add('Angular');
    }
    
    // jQuery 감지
    if (window.jQuery || window.$ && window.$.fn && window.$.fn.jquery) {
      techs.add('jQuery');
    }
    
    // Bootstrap 감지
    if (
      document.querySelector('.container') && 
      document.querySelector('.row') &&
      (document.querySelector('.col') || document.querySelector('[class^="col-"]')) ||
      document.querySelector('link[href*="bootstrap"]')
    ) {
      techs.add('Bootstrap');
    }
    
    // Tailwind CSS 감지
    if (
      document.querySelector('[class*="text-"]') &&
      document.querySelector('[class*="bg-"]') &&
      document.querySelector('[class*="flex"]') &&
      document.querySelector('[class*="grid"]') &&
      document.querySelector('[class*="p-"]') &&
      document.querySelector('[class*="m-"]')
    ) {
      techs.add('Tailwind CSS');
    }
    
    // WordPress 감지
    if (
      document.querySelector('link[href*="/wp-content/"]') ||
      document.querySelector('script[src*="/wp-content/"]') ||
      document.querySelector('link[href*="/wp-includes/"]') ||
      document.querySelector('script[src*="/wp-includes/"]') ||
      document.querySelector('body.wp-')
    ) {
      techs.add('WordPress');
    }
    
    // 웹 서버 정보 (HTTP 헤더에서 가져올 수 있는 정보는 제한적)
    
    // Google Analytics 감지
    if (
      document.querySelector('script[src*="google-analytics.com"]') ||
      document.querySelector('script[src*="googletagmanager.com"]') ||
      window.ga ||
      window.gtag ||
      window.dataLayer
    ) {
      techs.add('Google Analytics');
    }
    
    // 폰트 관련 기술 감지
    if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
      techs.add('Google Fonts');
    }
    
    if (document.querySelector('script[src*="fontawesome"]')) {
      techs.add('Font Awesome');
    }
    
    // 기타 일반적인 라이브러리 감지
    const scriptSrcs = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    
    if (scriptSrcs.some(src => src.includes('lodash'))) {
      techs.add('Lodash');
    }
    
    if (scriptSrcs.some(src => src.includes('moment'))) {
      techs.add('Moment.js');
    }
    
    if (scriptSrcs.some(src => src.includes('axios'))) {
      techs.add('Axios');
    }
    
    return Array.from(techs);
  });
  
  return technologies;
}

module.exports = {
  analyzeTechnologies
};
