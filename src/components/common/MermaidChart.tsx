import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { MermaidChartProps } from '../../types';

const MermaidChart = ({ chart }: MermaidChartProps) => {
  const [svg, setSvg] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#7aa2f7',
            primaryTextColor: '#c0caf5',
            primaryBorderColor: '#7aa2f7',
            lineColor: '#7aa2f7',
            secondaryColor: '#bb9af7',
            tertiaryColor: '#1a1b26',
            background: '#1a1b26',
            mainBkg: '#1a1b26',
            nodeBorder: '#7aa2f7',
            clusterBkg: 'rgba(122, 162, 247, 0.1)',
            titleColor: '#c0caf5',
            edgeLabelBackground: '#1a1b26',
          },
          flowchart: {
            curve: 'basis',
            padding: 20,
          },
          securityLevel: 'loose',
        });

        const { svg: svgContent } = await mermaid.render(chartId.current, chart);
        setSvg(svgContent);
      } catch (error) {
        console.error("Mermaid Render Error:", error);
        setSvg(`<pre>${chart}</pre>`);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="mermaid-container mermaid-animated"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidChart;