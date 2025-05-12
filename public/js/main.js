// 메인 애플리케이션 로직
document.addEventListener('DOMContentLoaded', () => {
  // 필수 요소 가져오기
  const form = document.getElementById('analyze-form');
  const urlInput = document.getElementById('url-input');
  const loadingEl = document.getElementById('loading');
  const reportContainer = document.getElementById('report-container');
  const reportUrl = document.getElementById('report-url');
  const techList = document.getElementById('tech-list');
  const featureList = document.getElementById('feature-list');
  const downloadBtn = document.getElementById('download-btn');
  
  // 옵션 요소 - 존재하는지 확인 후 사용
  const desktopOption = document.getElementById('desktop-option');
  const mobileOption = document.getElementById('mobile-option');
  const uxOption = document.getElementById('ux-option');
  
  // 구조 요소 - 존재하는지 확인 후 사용
  const menuList = document.getElementById('menu-list');
  const linksList = document.getElementById('links-list');
  
  // UX 점수 요소 - 존재하는지 확인 후 사용
  const performanceScore = document.getElementById('performance-score');
  const accessibilityScore = document.getElementById('accessibility-score');
  const bestPracticesScore = document.getElementById('best-practices-score');
  const seoScore = document.getElementById('seo-score');
  const totalScore = document.getElementById('total-score');
  
  let reportData = null;
  
  // 폼 제출 이벤트
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    if (!url) {
      alert('URL을 입력해주세요.');
      return;
    }
    
    // 옵션 객체 동적 생성
    const options = {};
    
    // 옵션 요소가 존재하는 경우에만 추가
    if (desktopOption) options.desktop = desktopOption.checked;
    if (mobileOption) options.mobile = mobileOption.checked;
    if (uxOption) options.ux = uxOption.checked;
    
    // 로딩 표시
    if (loadingEl) loadingEl.style.display = 'block';
    if (reportContainer) reportContainer.style.display = 'none';
    
    try {
      // 서버에 분석 요청
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, options })
      });
      
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      
      const data = await response.json();
      reportData = data;
      
      // 보고서 표시 - 요소가 존재하는 경우에만 처리
      if (reportUrl) reportUrl.textContent = data.url;
      
      // 기술 스택 처리
      if (techList && data.technologies) {
        techList.innerHTML = '';
        data.technologies.forEach(tech => {
          const li = document.createElement('li');
          li.className = 'tech-item';
          li.textContent = tech;
          techList.appendChild(li);
        });
      }
      
      // 주요 기능 처리 - 동적으로 추가
      if (featureList) {
        featureList.innerHTML = '';
        
        // 서버에서 받은 기능 목록이 있는 경우
        const features = data.features || [];
        
        // 사용자가 입력한 URL에서 추출한 추가 기능
        if (url) {
          // URL에서 도메인 이름 추출
          try {
            const domain = new URL(url).hostname;
            
            // 도메인에 따라 추가 기능 추출
            if (domain.includes('github')) {
              if (!features.includes('코드 저장소')) features.push('코드 저장소');
              if (!features.includes('프로젝트 관리')) features.push('프로젝트 관리');
              if (!features.includes('Git 클론')) features.push('Git 클론');
            } else if (domain.includes('google')) {
              if (!features.includes('검색 업그레이드')) features.push('검색 업그레이드');
              if (!features.includes('인공지능 검색')) features.push('인공지능 검색');
            } else if (domain.includes('facebook') || domain.includes('meta')) {
              if (!features.includes('소셜 네트워크')) features.push('소셜 네트워크');
              if (!features.includes('메신저')) features.push('메신저');
            } else if (domain.includes('amazon')) {
              if (!features.includes('상품 비교')) features.push('상품 비교');
              if (!features.includes('원클릭 구매')) features.push('원클릭 구매');
            }
          } catch (e) {
            console.log('도메인 추출 오류:', e);
          }
        }
        
        // 기능 항목 추가
        features.forEach(feature => {
          const li = document.createElement('li');
          li.className = 'feature-item';
          li.textContent = feature;
          
          // 기능 클릭 이벤트 추가 - featureFlows가 존재하고 해당 기능이 정의되어 있는 경우
          if (window.featureFlows && window.featureFlows[feature] && typeof window.showFeatureFlow === 'function') {
            li.addEventListener('click', () => {
              window.showFeatureFlow(feature);
            });
            li.title = '클릭하면 흐름도를 볼 수 있습니다';
          } else {
            // 흐름도가 없는 기능은 색상을 다르게 표시
            li.style.backgroundColor = '#e8f4fc';
            li.title = '추가 기능 (흐름도 없음)';
          }
          
          featureList.appendChild(li);
        });
      }
      
      // 웹사이트 구조 처리
      if (menuList && data.structure && data.structure.menu) {
        menuList.innerHTML = '';
        data.structure.menu.forEach(item => {
          const li = document.createElement('li');
          li.className = 'structure-item';
          li.textContent = item;
          menuList.appendChild(li);
        });
      }
      
      if (linksList && data.structure && data.structure.links) {
        linksList.innerHTML = '';
        data.structure.links.forEach(link => {
          const li = document.createElement('li');
          li.className = 'structure-item';
          li.textContent = link;
          linksList.appendChild(li);
        });
      }
      
      // UX 점수 처리 - 동적으로 처리
      if (data.uxScore) {
        // 점수 설정 함수 정의
        const setScoreClass = (element, valueElement, score) => {
          if (!element || !valueElement) return; // 요소가 없으면 처리하지 않음
          
          // 점수 표시
          valueElement.textContent = score;
          
          // 색상 클래스 설정
          let colorClass = '';
          if (score >= 90) {
            colorClass = 'good';
          } else if (score >= 70) {
            colorClass = 'average';
          } else {
            colorClass = 'poor';
          }
          
          // 점수 값과 점수 막대에 색상 클래스 적용
          valueElement.className = `score-value ${colorClass}`;
          element.className = `score-fill ${colorClass}`;
          
          // 그래프 너비 설정 - 요소의 style 속성을 직접 설정
          element.style.width = `${score}%`;
        };
        
        // UX 점수 원형 그래프 업데이트
        const uxScoreCircle = document.getElementById('ux-score-circle');
        if (uxScoreCircle) {
          const overallScore = data.uxScore.overall || 0;
          uxScoreCircle.textContent = overallScore;
          
          // 점수에 따라 색상 변경
          if (overallScore >= 90) {
            uxScoreCircle.className = 'score-circle good';
          } else if (overallScore >= 70) {
            uxScoreCircle.className = 'score-circle average';
          } else {
            uxScoreCircle.className = 'score-circle poor';
          }
        }
        
        // 개별 UX 점수 설정 - HTML의 ID와 일치하도록 수정
        const performanceBar = document.getElementById('performance-score');
        const performanceValue = document.getElementById('performance-value');
        const accessibilityBar = document.getElementById('accessibility-score');
        const accessibilityValue = document.getElementById('accessibility-value');
        const bestPracticesBar = document.getElementById('best-practices-score');
        const bestPracticesValue = document.getElementById('best-practices-value');
        const seoBar = document.getElementById('seo-score');
        const seoValue = document.getElementById('seo-value');
        
        // UX 점수 설정
        setScoreClass(performanceBar, performanceValue, data.uxScore.performance);
        setScoreClass(accessibilityBar, accessibilityValue, data.uxScore.accessibility);
        setScoreClass(bestPracticesBar, bestPracticesValue, data.uxScore.bestPractices);
        setScoreClass(seoBar, seoValue, data.uxScore.seo);
      }
      
      // 보고서 표시
      if (reportContainer) reportContainer.style.display = 'block';
    } catch (error) {
      console.error('분석 오류:', error);
      alert('URL 분석 중 오류가 발생했습니다: ' + error.message);
    } finally {
      // 로딩 표시 요소가 존재하는 경우에만 숨김
      if (loadingEl) loadingEl.style.display = 'none';
    }
  });
  
  // 다운로드 버튼 이벤트 - PDF 다운로드로 변경
  if (downloadBtn) {
    // 버튼 텍스트 변경
    downloadBtn.textContent = 'PDF 다운로드';
    
    downloadBtn.addEventListener('click', () => {
      if (!reportData) return;
      
      // 로딩 상태 표시
      if (loadingEl) {
        loadingEl.style.display = 'block';
        const loadingText = loadingEl.querySelector('p');
        if (loadingText) loadingText.textContent = 'PDF 생성 중...';
      }
      
      // 보고서 컨테이너 참조
      const reportElement = document.getElementById('report-container');
      if (!reportElement) {
        alert('PDF를 생성할 보고서를 찾을 수 없습니다.');
        if (loadingEl) loadingEl.style.display = 'none';
        return;
      }
      
      // PDF 생성
      try {
        // 현재 스크롤 위치 저장
        const scrollPosition = window.scrollY;
        
        // 보고서 요소의 스타일 복사
        const originalStyle = window.getComputedStyle(reportElement);
        const originalWidth = reportElement.style.width;
        const originalDisplay = reportElement.style.display;
        
        // PDF용 스타일 설정
        reportElement.style.width = '800px';
        reportElement.style.display = 'block';
        reportElement.style.margin = '0';
        reportElement.style.position = 'absolute';
        reportElement.style.top = '0';
        reportElement.style.left = '0';
        reportElement.style.zIndex = '-9999';
        
        // HTML2Canvas를 사용하여 보고서를 이미지로 변환
        html2canvas(reportElement, {
          scale: 1,
          useCORS: true,
          logging: false,
          allowTaint: true
        }).then(canvas => {
          // 원래 스타일 복원
          reportElement.style.width = originalWidth;
          reportElement.style.display = originalDisplay;
          reportElement.style.margin = '';
          reportElement.style.position = '';
          reportElement.style.top = '';
          reportElement.style.left = '';
          reportElement.style.zIndex = '';
          
          // 스크롤 위치 복원
          window.scrollTo(0, scrollPosition);
          
          // jsPDF 사용하여 PDF 생성
          const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          // 캔버스 이미지를 PDF에 추가
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210; // A4 포맷 너비 (mm)
          const pageHeight = 295; // A4 포맷 높이 (mm)
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
          
          // 첫 페이지 추가
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          // 여러 페이지일 경우 추가 페이지 생성
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          // PDF 다운로드
          pdf.save(`URL-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
          
          // 로딩 상태 숨김
          if (loadingEl) loadingEl.style.display = 'none';
        }).catch(error => {
          console.error('PDF 생성 오류:', error);
          alert('PDF 생성 중 오류가 발생했습니다.');
          
          // 원래 스타일 복원
          reportElement.style.width = originalWidth;
          reportElement.style.display = originalDisplay;
          reportElement.style.margin = '';
          reportElement.style.position = '';
          reportElement.style.top = '';
          reportElement.style.left = '';
          reportElement.style.zIndex = '';
          
          // 스크롤 위치 복원
          window.scrollTo(0, scrollPosition);
          
          // 로딩 상태 숨김
          if (loadingEl) loadingEl.style.display = 'none';
        });
      } catch (error) {
        console.error('PDF 생성 오류:', error);
        alert('PDF 생성 중 오류가 발생했습니다.');
        
        // 로딩 상태 숨김
        if (loadingEl) loadingEl.style.display = 'none';
      }
    });
  }
});
