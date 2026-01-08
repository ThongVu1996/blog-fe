import { forwardRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';
import MermaidChart from './MermaidChart';
import { MarkdownProps } from '../../types';
import { slugify } from '../../utils/slugify';

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

// Helper to recursively extract text from React children
const extractText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props?.children) return extractText(node.props.children);
  return '';
};

// Custom heading component to generate consistent IDs using shared slugify
const createHeading = (level: number) => {
  const HeadingComponent = ({ children, ...props }: any) => {
    const text = extractText(children);
    const id = slugify(text);

    const HeadingTag = ({ ...tagProps }: any) => {
      switch (level) {
        case 1: return <h1 id={id} {...tagProps}>{children}</h1>;
        case 2: return <h2 id={id} {...tagProps}>{children}</h2>;
        case 3: return <h3 id={id} {...tagProps}>{children}</h3>;
        case 4: return <h4 id={id} {...tagProps}>{children}</h4>;
        case 5: return <h5 id={id} {...tagProps}>{children}</h5>;
        case 6: return <h6 id={id} {...tagProps}>{children}</h6>;
        default: return <h2 id={id} {...tagProps}>{children}</h2>;
      }
    };
    return <HeadingTag {...props} />;
  };
  return HeadingComponent;
};

const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(({ onClick, content, className = "" }, ref) => {
  return (
    <div ref={ref} className={`${className} markdown-body`.trim()} onClick={onClick}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]} components={{
        h1: createHeading(1),
        h2: createHeading(2),
        h3: createHeading(3),
        h4: createHeading(4),
        h5: createHeading(5),
        h6: createHeading(6),
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

