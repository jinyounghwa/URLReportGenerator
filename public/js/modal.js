// 모달 팝업 관련 함수
document.addEventListener('DOMContentLoaded', () => {
  // 모달 요소 - 존재하는지 확인
  const featureModal = document.getElementById('feature-modal');
  const closeModal = document.getElementById('close-modal');
  const featureModalTitle = document.getElementById('feature-modal-title');
  const featureModalDesc = document.getElementById('feature-modal-desc'); // ID 수정
  const flowChart = document.getElementById('flow-chart');
  
  // 모달 관련 요소가 존재하는지 확인
  if (featureModal && closeModal) {
    // 모달 팝업 닫기 버튼 이벤트
    closeModal.addEventListener('click', () => {
      featureModal.style.display = 'none';
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
      if (e.target === featureModal) {
        featureModal.style.display = 'none';
      }
    });
  }
  
  // 기능 흐름도 표시 함수 - 전역으로 노출
  window.showFeatureFlow = function(feature) {
    // 필요한 요소들이 존재하는지 확인
    if (!featureModal || !window.featureFlows) return;
    
    const flowData = window.featureFlows[feature];
    if (!flowData) return;
    
    // 제목과 설명 설정 (요소가 존재하는 경우에만)
    if (featureModalTitle) featureModalTitle.textContent = flowData.title;
    if (featureModalDesc) featureModalDesc.textContent = flowData.description;
    
    // 흐름도 렌더링 (요소가 존재하는 경우에만)
    if (flowChart) {
      flowChart.innerHTML = `<div class="mermaid">${flowData.chart}</div>`;
    }
    
    // 모달 팝업 표시
    featureModal.style.display = 'block';
    
    // mermaid.js가 로드되었는지 확인
    if (window.mermaid) {
      try {
        window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      } catch (e) {
        console.error('Mermaid 렌더링 오류:', e);
      }
    } else {
      // mermaid.js가 아직 로드되지 않은 경우 대기
      const checkMermaid = setInterval(() => {
        if (window.mermaid) {
          clearInterval(checkMermaid);
          try {
            window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
          } catch (e) {
            console.error('Mermaid 렌더링 오류:', e);
          }
        }
      }, 100);
    }
  };
});
