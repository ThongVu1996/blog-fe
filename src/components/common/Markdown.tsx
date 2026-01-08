import { forwardRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Copy, Check } from 'lucide-react';
import MermaidChart from './MermaidChart';
import { MarkdownProps } from '../../types';

import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css';

// CodeBlock component with copy button
const CodeBlock = ({ children, ...props }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Extract text content from the code element
    const codeElement = children?.props?.children;
    const textToCopy = typeof codeElement === 'string'
      ? codeElement
      : String(codeElement || '');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <button
        className={`copy-code-btn ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  );
};

const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(({ onClick, content, className = "" }, ref) => {
  return (
    <div ref={ref} className={`${className} markdown-body`.trim()} onClick={onClick}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]} components={{
        pre(props: any) {
          return <CodeBlock {...props} />;
        },
        code(props: any) {
          const { inline, className, children, ...rest } = props;
          const match = /language-mermaid/.exec(className || ''); if (!inline
            && match) {
            return (<MermaidChart chart={String(children).replace(/\n$/, '')} />
            );
          }

          return (
            <code className={className} {...rest}>
              {children}
            </code>
          );
        },
        table({ children, ...props }: any) {
          return (
            <div className="table-wrapper">
              <table {...props}>{children}</table>
            </div>
          );
        },
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

export default Markdown;
