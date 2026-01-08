import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import MermaidChart from './MermaidChart';
import { MarkdownProps } from '../../types';

import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css';

const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(({ onClick, content, className = "" }, ref) => {
  return (
    <div ref={ref} className={`${className} markdown-body`.trim()} onClick={onClick}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]} components={{
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
