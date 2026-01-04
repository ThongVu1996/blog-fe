import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { uniqueId } from 'lodash';

const MermaidChart = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const containerRef = useRef(null);
  const chartId = useRef(`mermaid-${uniqueId()}`); // Tạo ID duy nhất cho mỗi sơ đồ

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;

      try {
        // Reset Mermaid để tránh lỗi cache
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });

        // Vẽ sơ đồ ra chuỗi SVG
        const { svg: svgContent } = await mermaid.render(chartId.current, chart);
        setSvg(svgContent);
      } catch (error) {
        console.error("Mermaid Render Error:", error);
        // Nếu lỗi, hiển thị mã thô để debug
        setSvg(`<pre>${chart}</pre>`);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className="mermaid-container"
      style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export default MermaidChart;