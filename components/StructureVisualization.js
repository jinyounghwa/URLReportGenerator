import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * 사이트 구조 시각화 컴포넌트
 * @param {Object} props
 * @param {Object} props.structure - 사이트 구조 데이터
 */
export default function StructureVisualization({ structure }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!structure || !containerRef.current) return;
    
    // Mermaid 초기화
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        curve: 'basis'
      }
    });
    
    // 메뉴 구조 다이어그램 생성
    const generateMenuDiagram = () => {
      if (!structure.menu || structure.menu.length === 0) return '';
      
      let diagram = 'graph TD;\n';
      diagram += 'Home[홈페이지];\n';
      
      // 메뉴 항목 추가
      structure.menu.forEach((item, index) => {
        const id = `menu${index}`;
        diagram += `${id}["${item.text}"];\n`;
        diagram += `Home --> ${id};\n`;
      });
      
      return diagram;
    };
    
    // 링크 구조 다이어그램 생성
    const generateLinksDiagram = () => {
      if (!structure.links || structure.links.length === 0) return '';
      
      // 링크가 너무 많으면 최대 20개만 표시
      const maxLinks = 20;
      const links = structure.links.slice(0, maxLinks);
      
      let diagram = 'graph LR;\n';
      diagram += 'Home[홈페이지];\n';
      
      // 중복 방지를 위한 Set
      const addedLinks = new Set();
      
      // 링크 항목 추가
      links.forEach((link, index) => {
        const id = `link${index}`;
        const text = link.text.length > 20 ? link.text.substring(0, 20) + '...' : link.text;
        
        // 이미 추가된 텍스트는 건너뛰기
        if (addedLinks.has(text)) return;
        addedLinks.add(text);
        
        diagram += `${id}["${text}"];\n`;
        diagram += `Home --> ${id};\n`;
      });
      
      return diagram;
    };
    
    // 다이어그램 렌더링
    const renderDiagram = async (diagram, elementId) => {
      if (!diagram) return;
      
      try {
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = diagram;
          await mermaid.run({ nodes: [element] });
        }
      } catch (error) {
        console.error('다이어그램 렌더링 오류:', error);
      }
    };
    
    // 메뉴 다이어그램 렌더링
    const menuDiagram = generateMenuDiagram();
    if (menuDiagram) {
      const menuElement = document.createElement('div');
      menuElement.id = 'menu-diagram';
      menuElement.className = 'mermaid';
      containerRef.current.appendChild(menuElement);
      renderDiagram(menuDiagram, 'menu-diagram');
    }
    
    // 링크 다이어그램 렌더링
    const linksDiagram = generateLinksDiagram();
    if (linksDiagram) {
      const linksElement = document.createElement('div');
      linksElement.id = 'links-diagram';
      linksElement.className = 'mermaid';
      containerRef.current.appendChild(linksElement);
      renderDiagram(linksDiagram, 'links-diagram');
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [structure]);
  
  if (!structure) {
    return <div>구조 데이터가 없습니다</div>;
  }
  
  return (
    <div className="structure-visualization">
      <div ref={containerRef} className="diagrams-container"></div>
      
      {/* 다이어그램이 렌더링되지 않을 경우를 대비한 폴백 */}
      {(!structure.menu || structure.menu.length === 0) && 
       (!structure.links || structure.links.length === 0) && (
        <div className="fallback-message">
          <p>시각화할 구조 데이터가 충분하지 않습니다.</p>
        </div>
      )}
    </div>
  );
}
